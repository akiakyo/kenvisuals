import { lazy, Suspense, useEffect, useState } from 'react'
import { links } from '../content'
import { useScrollProgress } from '../hooks'
import { GmailLogo, InstagramLogo, WhatsAppLogo } from './Logos'
import ScrollVelocity from './reactbits/ScrollVelocity/ScrollVelocity'
import { Cta } from './ui'
import { ArrowUp, ArrowUpRight, Volume2, VolumeX } from 'lucide-react'
import { sfx } from '../sfx'

const CRTWarp = lazy(() => import('./reactbits/CRTWarp/CRTWarp'))

const bootSteps = [
  'Scanning folder: Effects',
  'Loading plug-ins: Motion Blur',
  'Reading project: showreel.aep',
  'Caching footage: 5 layers',
  'Building RAM preview',
  'Opening composition: ken.visuals',
]

const stepIndex = (pct: number) => Math.min(bootSteps.length - 1, Math.floor((pct / 100) * bootSteps.length))

/** Deterministic pseudo-random so the starfield is identical on every render. */
function seeded(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
}

const stars = (() => {
  const r = seeded(7)
  return Array.from({ length: 90 }, () => ({ x: r() * 680, y: r() * 190, s: r() * 1.2 + 0.3, d: r() * 4 }))
})()

// [apex x, base y, half width, height] — base sits on the horizon/floor.
const pyramids: [number, number, number, number][] = [
  [92, 250, 34, 92], [205, 268, 44, 128], [280, 276, 32, 86], [330, 262, 22, 56],
  [392, 252, 12, 30], [430, 248, 7, 16], [480, 228, 9, 34], [560, 234, 7, 20],
  [622, 300, 38, 118], [650, 214, 16, 66],
]

function SplashScene() {
  return (
    <svg className="splash-scene" viewBox="0 0 680 330" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="sp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#07051a" />
          <stop offset=".35" stopColor="#1d0f4d" />
          <stop offset=".56" stopColor="#5a28b8" />
          <stop offset=".64" stopColor="#b25bd6" />
          <stop offset=".68" stopColor="#ffb05a" />
          <stop offset=".7" stopColor="#3a1c6e" />
          <stop offset="1" stopColor="#0c0820" />
        </linearGradient>
        <linearGradient id="sp-pyr" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".55" stopColor="#e6dcff" />
          <stop offset="1" stopColor="#a98cff" />
        </linearGradient>
        <linearGradient id="sp-pyr-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9b6ff" />
          <stop offset="1" stopColor="#6d4bd8" />
        </linearGradient>
        <radialGradient id="sp-sun" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#ffd59a" stopOpacity=".9" />
          <stop offset=".4" stopColor="#ff8a4a" stopOpacity=".35" />
          <stop offset="1" stopColor="#ff8a4a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sp-moon" cx=".35" cy=".35" r=".7">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".35" />
          <stop offset="1" stopColor="#9999ff" stopOpacity=".05" />
        </radialGradient>
        <filter id="sp-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect width="680" height="330" fill="url(#sp-sky)" />
      <g className="splash-stars">
        {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.s} fill="#fff" style={{ animationDelay: `${s.d}s` }} />)}
      </g>
      <ellipse cx="420" cy="225" rx="300" ry="34" fill="url(#sp-sun)" />

      {/* wireframe rigging, top right */}
      <g stroke="#b9a6ff" strokeOpacity=".28" strokeWidth=".7" fill="none">
        <path d="M680 0 L470 70 L560 140 L680 60 M470 70 L410 0 M560 140 L640 0 M520 40 L680 120 M470 70 L680 160" />
        <path d="M150 0 L60 250 M150 0 L250 120 M150 0 L120 260" strokeOpacity=".18" />
      </g>
      <circle cx="356" cy="52" r="20" fill="url(#sp-moon)" stroke="#c8bcff" strokeOpacity=".4" strokeWidth=".6" />
      <circle cx="522" cy="118" r="6" fill="#120a24" />
      <circle cx="600" cy="108" r="11" fill="#120a24" />
      <circle cx="642" cy="158" r="4" fill="#120a24" />

      {/* perspective floor grid */}
      <g stroke="#9b7bff" strokeOpacity=".16" strokeWidth=".6">
        {Array.from({ length: 15 }, (_, i) => <line key={`v${i}`} x1={340} y1={228} x2={-400 + i * 105} y2={330} />)}
        {[236, 248, 264, 286, 316].map((y) => <line key={`h${y}`} x1={0} y1={y} x2={680} y2={y} />)}
      </g>

      {/* floating inverted pyramid */}
      <g className="splash-float" filter="url(#sp-glow)">
        <polygon points="300,22 265,70 300,96 335,70" fill="#fff" opacity=".9" />
        <polygon points="300,96 185,160 300,180 410,152" fill="url(#sp-pyr)" />
        <polygon points="300,96 410,152 300,180" fill="url(#sp-pyr-shade)" opacity=".55" />
      </g>

      {/* grounded pyramids + floor reflections */}
      {pyramids.map(([x, y, w, h], i) => (
        <g key={i} className="splash-pyr" style={{ animationDelay: `${i * 0.35}s` }}>
          <polygon points={`${x - w},${y + 2} ${x + w},${y + 2} ${x},${y + h * 0.45}`} fill="#c9b6ff" opacity=".1" />
          <g filter="url(#sp-glow)">
            <polygon points={`${x},${y - h} ${x - w},${y} ${x + w * 0.15},${y + 4}`} fill="url(#sp-pyr)" />
            <polygon points={`${x},${y - h} ${x + w * 0.15},${y + 4} ${x + w},${y}`} fill="url(#sp-pyr-shade)" />
          </g>
        </g>
      ))}
    </svg>
  )
}

export function Boot({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    // Sounds only play if the browser already allows audio (no gesture yet on a first visit).
    sfx.prime()
    let p = 0
    let lastStep = 0
    const t = setInterval(() => {
      p = Math.min(100, p + Math.ceil(Math.random() * 5))
      setPct(p)
      if (stepIndex(p) !== lastStep) {
        lastStep = stepIndex(p)
        sfx.bootStep()
      }
      if (p === 100) {
        clearInterval(t)
        setTimeout(() => {
          sfx.bootDone()
          setHidden(true)
          onDone()
        }, 450)
      }
    }, 60)
    return () => clearInterval(t)
  }, [onDone])

  const step = bootSteps[stepIndex(pct)]
  return (
    <div className={`boot${hidden ? ' hidden' : ''}`} aria-hidden="true">
      <div className="splash">
        <SplashScene />
        <div className="splash-info">
          <div className="splash-brand">
            <div className="splash-mark">Kv</div>
            <div className="splash-sub">ken.visuals motion studio</div>
            <div className="splash-name">Motion Designer CC</div>
            <div className="splash-ver">Version {new Date().getFullYear()}</div>
          </div>
          <div className="splash-meta">
            <div className="splash-status">
              <span>{step}…</span>
              <span>{pct}%</span>
            </div>
            <div className="splash-line"><span style={{ width: `${pct}%` }} /></div>
            <p>© {new Date().getFullYear()} Kenjie Villacorta. All rights reserved. Motion design, video editing &amp; visual systems — made in the Philippines.</p>
            <p className="splash-credit">Illustration by ken.visuals<br />Scroll down to see the work.</p>
          </div>
        </div>
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

function SoundToggle() {
  const [on, setOn] = useState(sfx.enabled)
  useEffect(() => sfx.subscribe(setOn), [])
  return (
    <button className="sound-toggle" onClick={() => sfx.setEnabled(!on)} aria-pressed={on} aria-label={on ? 'Mute sound effects' : 'Turn on sound effects'} title={on ? 'Sound on' : 'Sound off'}>
      {on ? <Volume2 size={16} /> : <VolumeX size={16} />}
    </button>
  )
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
      <SoundToggle />
      <Cta href="#contact" className="nav-cta"><span>start a project</span><b><ArrowUpRight size={14} strokeWidth={2.25} /></b></Cta>
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

const contacts = [
  { label: 'Email', value: links.email, href: `mailto:${links.email}`, logo: <GmailLogo size={26} />, tile: 'gmail' },
  { label: 'Instagram', value: `@${links.instagram}`, href: `https://instagram.com/${links.instagram}`, logo: <InstagramLogo size={24} />, tile: 'instagram', external: true },
  { label: 'WhatsApp', value: links.whatsapp.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3'), href: `https://wa.me/${links.whatsappIntl}`, logo: <WhatsAppLogo size={24} />, tile: 'whatsapp', external: true },
]

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-bg" aria-hidden="true">
        <Suspense fallback={null}>
          <CRTWarp color="#9b5cff" backgroundColor="#0b0714" speed={0.4} brightness={1.1} noise={0.08} vignette={0.35} />
        </Suspense>
      </div>
      <div className="footer-inner">
        <div className="footer-head reveal">
          <span className="section-kicker">get in touch</span>
          <h2>Say hi — I reply fast.</h2>
        </div>
        <ul className="footer-contacts">
          {contacts.map((c, i) => (
            <li key={c.label} className="reveal" style={{ '--d': `${0.12 * (i + 1)}s` } as React.CSSProperties}>
              <a href={c.href} {...(c.external ? { target: '_blank', rel: 'noopener' } : {})}>
                <span className={`footer-logo ${c.tile}`}>{c.logo}</span>
                <span className="footer-detail"><small>{c.label}</small><b>{c.value}</b></span>
                <i aria-hidden="true"><ArrowUpRight size={18} /></i>
              </a>
            </li>
          ))}
        </ul>
        <div className="footer-bar reveal" style={{ '--d': '.5s' } as React.CSSProperties}>
          <span>ken.visuals © {new Date().getFullYear()}</span>
          <span>motion designer · philippines</span>
          <a href="#top">back to top <ArrowUp size={12} /></a>
        </div>
      </div>
    </footer>
  )
}
