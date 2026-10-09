import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { COMP_DURATION, FPS, layers as initialLayers, type Layer } from '../content'
import { Icon } from './Icons'
import Panel from './Panel'
import { Heading, Kicker } from './ui'

type LayerState = Layer & { visible: boolean }
type Open = (src: string, title: string) => void

const MIN_DURATION = 1
const SNAP_PX = 8
const ROW_H = 38

const pad = (n: number) => String(n).padStart(2, '0')
/** AE drop-frame-style timecode: 0;00;SS;FF */
export const timecode = (t: number) => {
  const s = Math.floor(t)
  return `0;00;${pad(s)};${pad(Math.floor((t - s) * FPS))}`
}
const frame = (t: number) => Math.round(t * FPS) / FPS
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const pct = (t: number) => `${(t / COMP_DURATION) * 100}%`

const fresh = (): LayerState[] => initialLayers.map((l) => ({ ...l, visible: true }))

/** Follow the pointer until release; `onMove` gets the pixel delta from the press point. */
function drag(e: React.PointerEvent, onMove: (dx: number, dy: number, ev: PointerEvent) => void, onEnd?: () => void) {
  e.preventDefault()
  e.stopPropagation()
  const x0 = e.clientX
  const y0 = e.clientY
  const move = (ev: PointerEvent) => onMove(ev.clientX - x0, ev.clientY - y0, ev)
  const up = () => {
    removeEventListener('pointermove', move)
    removeEventListener('pointerup', up)
    removeEventListener('pointercancel', up)
    document.body.classList.remove('is-dragging')
    onEnd?.()
  }
  document.body.classList.add('is-dragging')
  addEventListener('pointermove', move)
  addEventListener('pointerup', up)
  addEventListener('pointercancel', up)
}

export default function Timeline({ onOpen }: { onOpen: Open }) {
  const [items, setItems] = useState<LayerState[]>(fresh)
  const [t, setT] = useState(1.5)
  const [playing, setPlaying] = useState(false)
  const [selected, setSelected] = useState<string>('reel')
  const [dragId, setDragId] = useState<string | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const tRef = useRef(t)
  tRef.current = t

  // Topmost visible layer under the playhead is what the comp viewer shows.
  const active = useMemo(() => items.find((l) => l.visible && t >= l.start && t < l.start + l.duration), [items, t])
  const sel = items.find((l) => l.id === selected)

  // Playback clock.
  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const next = tRef.current + (now - last) / 1000
      last = now
      setT(next >= COMP_DURATION ? 0 : next)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  // Start playing the first time the timeline scrolls into view; pause when it leaves.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    let started = false
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        started = true
        setPlaying(true)
      } else if (!entry.isIntersecting) setPlaying(false)
    }, { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Keep the viewer's video in step with the playhead.
  useEffect(() => {
    const v = videoRef.current
    if (!v || !active) return
    const local = t - active.start
    const target = v.duration ? local % v.duration : local
    if (playing) {
      if (v.paused) v.play().catch(() => {})
      if (Math.abs(v.currentTime - target) > 0.35) v.currentTime = target
    } else {
      if (!v.paused) v.pause()
      if (!v.seeking && Math.abs(v.currentTime - target) > 1 / (FPS * 2)) v.currentTime = target
    }
  }, [t, active, playing])

  const pxPerSec = () => (trackRef.current?.getBoundingClientRect().width ?? 1) / COMP_DURATION

  /** Magnetic snap to the playhead and comp edges; otherwise round to a frame. */
  const snapTo = useCallback((v: number, pps: number) => {
    for (const target of [tRef.current, 0, COMP_DURATION]) if (Math.abs(v - target) * pps < SNAP_PX) return { v: target, hit: true }
    return { v: frame(v), hit: false }
  }, [])
  const snap = (v: number, pps: number) => snapTo(v, pps).v

  const update = (id: string, patch: Partial<LayerState>) => setItems((list) => list.map((l) => (l.id === id ? { ...l, ...patch } : l)))

  const onBar = (e: React.PointerEvent, layer: LayerState, mode: 'move' | 'in' | 'out') => {
    if (e.button !== 0) return
    setSelected(layer.id)
    setDragId(layer.id)
    const pps = pxPerSec()
    const { start, duration } = layer
    const end = start + duration
    drag(e, (dx) => {
      const ds = dx / pps
      if (mode === 'move') {
        // Either edge of the bar can catch a snap target.
        const a = snapTo(start + ds, pps)
        const b = snapTo(start + ds + duration, pps)
        const s = a.hit || !b.hit ? a.v : b.v - duration
        update(layer.id, { start: clamp(s, 0, COMP_DURATION - duration) })
      } else if (mode === 'in') {
        const s = clamp(snap(start + ds, pps), 0, end - MIN_DURATION)
        update(layer.id, { start: s, duration: end - s })
      } else {
        const e2 = clamp(snap(end + ds, pps), start + MIN_DURATION, COMP_DURATION)
        update(layer.id, { duration: e2 - start })
      }
    }, () => setDragId(null))
  }

  const onName = (e: React.PointerEvent, id: string) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest('button')) return
    setSelected(id)
    setDragId(id)
    const order = items.map((l) => l.id)
    const from = order.indexOf(id)
    drag(e, (_dx, dy) => {
      const to = clamp(from + Math.round(dy / ROW_H), 0, order.length - 1)
      const next = order.filter((x) => x !== id)
      next.splice(to, 0, id)
      setItems((list) => next.map((x) => list.find((l) => l.id === x)!))
    }, () => setDragId(null))
  }

  const onScrub = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    const rect = trackRef.current!.getBoundingClientRect()
    const at = (x: number) => clamp(frame(((x - rect.left) / rect.width) * COMP_DURATION), 0, COMP_DURATION - 1 / FPS)
    setPlaying(false)
    setT(at(e.clientX))
    drag(e, (_dx, _dy, ev) => setT(at(ev.clientX)))
  }

  const nudge = (layer: LayerState, frames: number) =>
    update(layer.id, { start: clamp(frame(layer.start + frames / FPS), 0, COMP_DURATION - layer.duration) })

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === ' ' && !(e.target as HTMLElement).closest('button')) {
      e.preventDefault()
      setPlaying((p) => !p)
    } else if (e.key === 'Home') {
      e.preventDefault()
      setT(0)
    }
  }

  const ticks = Array.from({ length: COMP_DURATION + 1 }, (_, i) => i)
  const openActive = () => active && onOpen(active.video, `${active.title} — ${active.tag}`)

  return (
    <section id="work" className="section-pad timeline-section">
      <div className="section-head">
        <div><Kicker text="01 / compositions" /><Heading text="Frames that move." /></div>
        <p className="reveal">
          Every project is a layer. Drag bars to retime, pull the edges to trim, drag names to restack — the viewer renders whatever is on top at the playhead.
        </p>
      </div>

      <div className="workspace reveal" ref={rootRef} tabIndex={-1} onKeyDown={onKey}>
        <Panel
          title={`Composition: ${active?.title ?? 'Selected Work'}`}
          className="viewer-panel"
          actions={<button className="ae-btn" onClick={openActive} disabled={!active} aria-label="Open active layer full screen"><Icon name="expand" size={14} /></button>}
        >
          <div className={`viewer${active ? '' : ' empty'}`} onDoubleClick={openActive}>
            {active ? (
              <video ref={videoRef} key={active.id} src={active.video} poster={active.poster} muted playsInline preload="auto" loop />
            ) : (
              <span className="viewer-empty">No layer at the playhead — drag one under it.</span>
            )}
            <div className="viewer-guides" aria-hidden="true"><i /><i /></div>
            {active && <span className="viewer-label" style={{ '--label': active.label } as React.CSSProperties}>{active.title}</span>}
          </div>
          <div className="viewer-bar">
            <span>100%</span><span>Full</span><span className="tc">{timecode(t)}</span><span className="muted">1920 × 1080 · {FPS} fps</span>
          </div>
        </Panel>

        <Panel title="Info" className="info-panel">
          {sel && (
            <dl className="info">
              <div><dt>Layer</dt><dd><i style={{ background: sel.label }} />{sel.title}</dd></div>
              <div><dt>Type</dt><dd>{sel.tag}</dd></div>
              <div><dt>In</dt><dd className="tc">{timecode(sel.start)}</dd></div>
              <div><dt>Out</dt><dd className="tc">{timecode(sel.start + sel.duration)}</dd></div>
              <div><dt>Duration</dt><dd className="tc">{timecode(sel.duration)}</dd></div>
              <div><dt>Visible</dt><dd>{sel.visible ? 'On' : 'Off'}</dd></div>
            </dl>
          )}
          <button className="ae-btn wide" onClick={() => sel && onOpen(sel.video, `${sel.title} — ${sel.tag}`)}>
            <Icon name="expand" size={14} /> Open {sel?.title}
          </button>
          <p className="hint">
            <b>Space</b> play · <b>Home</b> to start · <b>←/→</b> nudge a layer a frame (<b>Shift</b> = 10)
          </p>
        </Panel>

        <Panel
          title="Timeline: Selected Work"
          className="timeline-panel"
          actions={
            <>
              <span className="tc big">{timecode(t)}</span>
              <button className="ae-btn" onClick={() => setT(0)} aria-label="Go to start"><Icon name="stepBack" size={14} /></button>
              <button className="ae-btn play" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause' : 'Play'}>
                <Icon name={playing ? 'pause' : 'play'} size={14} />
              </button>
              <button className="ae-btn" onClick={() => setT((x) => clamp(frame(x + 1 / FPS), 0, COMP_DURATION))} aria-label="Next frame"><Icon name="stepFwd" size={14} /></button>
              <button className="ae-btn" onClick={() => { setItems(fresh()); setT(1.5) }} aria-label="Reset layout"><Icon name="reset" size={14} /></button>
            </>
          }
        >
          <div className="tl-scroll">
            <div className="tl" style={{ '--rows': items.length } as React.CSSProperties}>
              <div className="tl-names-head"><span><Icon name="eye" size={13} /></span><span>#</span><span>Source Name</span></div>
              <div className="tl-ruler" onPointerDown={onScrub}>
                {ticks.map((i) => (
                  <span key={i} className={i % 5 === 0 ? 'major' : ''} style={{ left: pct(i) }}>{i % 5 === 0 && i < COMP_DURATION ? `${pad(i)}s` : ''}</span>
                ))}
                <b className="tl-head" style={{ left: pct(t) }} />
              </div>

              <div className="tl-names">
                {items.map((l, i) => (
                  <div
                    key={l.id}
                    className={`tl-name${selected === l.id ? ' sel' : ''}${dragId === l.id ? ' dragging' : ''}${l.visible ? '' : ' hidden'}`}
                    onPointerDown={(e) => onName(e, l.id)}
                  >
                    <button className="eye" onClick={() => update(l.id, { visible: !l.visible })} aria-label={`${l.visible ? 'Hide' : 'Show'} ${l.title}`} aria-pressed={l.visible}>
                      <Icon name={l.visible ? 'eye' : 'eyeOff'} size={13} />
                    </button>
                    <i className="swatch" style={{ background: l.label }} />
                    <span className="num">{i + 1}</span>
                    <span className="nm">{l.title}<small>{l.tag}</small></span>
                  </div>
                ))}
              </div>

              <div className="tl-tracks" ref={trackRef} onPointerDown={onScrub}>
                {ticks.filter((i) => i % 5 === 0).map((i) => <i key={i} className="grid" style={{ left: pct(i) }} />)}
                {items.map((l) => (
                  <div key={l.id} className="tl-row">
                    <div
                      className={`bar${selected === l.id ? ' sel' : ''}${dragId === l.id ? ' dragging' : ''}${l.visible ? '' : ' hidden'}${active?.id === l.id ? ' live' : ''}`}
                      style={{ left: pct(l.start), width: pct(l.duration), '--label': l.label } as React.CSSProperties}
                      tabIndex={0}
                      role="slider"
                      aria-label={`${l.title} layer, in at ${timecode(l.start)}`}
                      aria-valuemin={0}
                      aria-valuemax={COMP_DURATION}
                      aria-valuenow={Number(l.start.toFixed(2))}
                      onPointerDown={(e) => onBar(e, l, 'move')}
                      onDoubleClick={() => onOpen(l.video, `${l.title} — ${l.tag}`)}
                      onFocus={() => setSelected(l.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                          e.preventDefault()
                          nudge(l, (e.key === 'ArrowLeft' ? -1 : 1) * (e.shiftKey ? 10 : 1))
                        }
                      }}
                    >
                      <span className="trim in" onPointerDown={(e) => onBar(e, l, 'in')} />
                      <span className="bar-label">{l.title}</span>
                      <span className="kf" style={{ left: 10 }} /><span className="kf" style={{ right: 10 }} />
                      <span className="trim out" onPointerDown={(e) => onBar(e, l, 'out')} />
                    </div>
                  </div>
                ))}
                <b className="tl-line" style={{ left: pct(t) }} />
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </section>
  )
}
