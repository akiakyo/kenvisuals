import { useEffect, useState } from 'react'
import { useScrollProgress } from '../hooks'
import ScrollVelocity from './reactbits/ScrollVelocity/ScrollVelocity'
import { Cta } from './ui'

export function Boot({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    let p = 0
    const t = setInterval(() => {
      p = Math.min(100, p + Math.ceil(Math.random() * 9))
      setPct(p)
      if (p === 100) {
        clearInterval(t)
        setTimeout(() => {
          setHidden(true)
          onDone()
        }, 250)
      }
    }, 55)
    return () => clearInterval(t)
  }, [onDone])
  return (
    <div className={`boot${hidden ? ' hidden' : ''}`} aria-hidden="true">
      <div className="boot-inner">
        <div className="boot-mark"><span className="app-icon">Kv</span>ken.visuals</div>
        <div className="boot-line"><span style={{ width: `${pct}%` }} /></div>
        <div className="boot-row"><span>initializing motion system…</span><span>{pct}%</span></div>
      </div>
    </div>
  )
}

const workspaces = [
  { label: 'Work', id: 'work' },
  { label: 'About', id: 'about' },
  { label: 'Clients', id: 'clients' },
  { label: 'Contact', id: 'contact' },
]

/** Highlights the workspace tab for whichever section is in the middle of the screen. */
function useActiveSection() {
  const [active, setActive] = useState('')
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ;['top', ...workspaces.map((w) => w.id)].forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])
  return active
}

export function Nav() {
  const { progress } = useScrollProgress()
  const active = useActiveSection()
  return (
    <header className="nav">
      <a className="brand" href="#top" aria-label="ken.visuals home">
        <span className="app-icon">Kv</span><span>ken.visuals</span>
      </a>
      <nav className="workspaces" aria-label="Main navigation">
        {workspaces.map((w) => (
          <a key={w.id} href={`#${w.id}`} className={active === w.id ? 'on' : ''} aria-current={active === w.id ? 'true' : undefined}>{w.label}</a>
        ))}
      </nav>
      <Cta href="#contact" className="nav-cta"><span>start a project</span><b>↗</b></Cta>
      <div className="scroll-progress"><span style={{ width: `${progress * 100}%` }} /></div>
    </header>
  )
}

export function Ticker() {
  return (
    <section className="ticker" aria-hidden="true">
      <ScrollVelocity
        texts={['Motion Graphics / Video Editing / Visual Systems /', 'After Effects / Figma / Compositing / Edit Pacing /']}
        velocity={45}
        numCopies={4}
        className="ticker-text"
        parallaxClassName="ticker-row"
        scrollerClassName="ticker-scroller"
      />
    </section>
  )
}

export function Footer() {
  return (
    <footer>
      <span>ken.visuals © {new Date().getFullYear()}</span>
      <span>motion designer · philippines</span>
      <a href="#top">back to top ↑</a>
    </footer>
  )
}
