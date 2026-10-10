/**
 * Tiny UI sound kit, synthesised with Web Audio so there are no files to load.
 * Audio only starts after the visitor's first click/key press (browser autoplay rules).
 */
const STORAGE_KEY = 'kv-sound'

let ctx: AudioContext | null = null
let master: GainNode | null = null
let enabled = (() => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off'
  } catch {
    return true
  }
})()
const listeners = new Set<(on: boolean) => void>()

function unlock() {
  if (!ctx) {
    ctx = new AudioContext()
    master = ctx.createGain()
    master.gain.value = 0.35
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume()
}

/** A short enveloped oscillator, optionally gliding to `to` Hz. */
function tone(freq: number, dur: number, vol: number, type: OscillatorType = 'sine', to?: number, delay = 0) {
  if (!enabled || !ctx || !master || ctx.state !== 'running') return
  const t = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur)
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(vol, t + 0.004)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(gain).connect(master)
  osc.start(t)
  osc.stop(t + dur + 0.02)
}

/** Band-passed noise sweep. */
function whoosh() {
  if (!enabled || !ctx || !master || ctx.state !== 'running') return
  const t = ctx.currentTime
  const dur = 0.45
  const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buf
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.Q.value = 1.2
  filter.frequency.setValueAtTime(300, t)
  filter.frequency.exponentialRampToValueAtTime(3200, t + dur)
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(0.35, t + 0.12)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(filter).connect(gain).connect(master)
  src.start(t)
}

let lastTick = 0

export const sfx = {
  hover: () => tone(1800, 0.035, 0.05, 'sine'),
  click: () => tone(520, 0.07, 0.16, 'triangle', 260),
  /** Timeline scrub tick, throttled so fast drags don't buzz. */
  tick: () => {
    const now = performance.now()
    if (now - lastTick < 45) return
    lastTick = now
    tone(2400, 0.02, 0.05, 'square')
  },
  whoosh,
  unlock,
  /** Creates the audio context early; true when the browser lets it play without a gesture. */
  prime: () => {
    if (!enabled) return false
    unlock()
    return ctx?.state === 'running'
  },
  bootStep: () => tone(880, 0.05, 0.05, 'sine', 1320),
  /** Startup chime: a rising arpeggio over a soft low swell. */
  bootDone: () => {
    tone(130.8, 1.4, 0.1, 'sine', 196)
    ;[523.3, 659.3, 784, 1046.5].forEach((f, i) => {
      tone(f, 0.9, 0.09, 'triangle', undefined, 0.08 * i)
      tone(f * 2, 0.6, 0.025, 'sine', undefined, 0.08 * i + 0.01)
    })
  },
  toggle: (on: boolean) => {
    tone(on ? 660 : 520, 0.08, 0.14, 'sine')
    tone(on ? 990 : 390, 0.1, 0.12, 'sine', undefined, 0.07)
  },
  get enabled() {
    return enabled
  },
  setEnabled(on: boolean) {
    enabled = on
    try {
      localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off')
    } catch {
      /* storage blocked; the choice just won't persist */
    }
    listeners.forEach((fn) => fn(on))
    if (on) {
      unlock()
      sfx.toggle(true)
    }
  },
  subscribe(fn: (on: boolean) => void) {
    listeners.add(fn)
    return () => void listeners.delete(fn)
  },
}

const INTERACTIVE = 'a, button, [role="button"], .bar, input, select'

/** Site-wide hover/click sounds via event delegation. Returns a cleanup function. */
export function installSfx() {
  let hovered: Element | null = null
  const onOver = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const el = (e.target as Element).closest(INTERACTIVE)
    if (el && el !== hovered) sfx.hover()
    hovered = el
  }
  const onDown = (e: PointerEvent) => {
    unlock()
    // The sound toggle plays its own chime.
    const el = (e.target as Element).closest(INTERACTIVE)
    if (el && !el.closest('.sound-toggle')) sfx.click()
  }
  const onKey = () => unlock()
  document.addEventListener('pointerover', onOver)
  document.addEventListener('pointerdown', onDown)
  document.addEventListener('keydown', onKey)
  return () => {
    document.removeEventListener('pointerover', onOver)
    document.removeEventListener('pointerdown', onDown)
    document.removeEventListener('keydown', onKey)
  }
}
