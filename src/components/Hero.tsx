import { lazy, Suspense } from 'react'
import { links } from '../content'
import { Icon, type IconName } from './Icons'
import { AfterEffectsLogo, FigmaLogo } from './Logos'
import BlurText from './reactbits/BlurText/BlurText'
import CountUp from './reactbits/CountUp/CountUp'
import RotatingText from './reactbits/RotatingText/RotatingText'
import SplitText from './reactbits/SplitText/SplitText'
import { Cta } from './ui'

const Scene = lazy(() => import('./Scene'))

const lede = 'I design motion that gives brands a pulse — clean visuals, sharp rhythm, and movement built to be remembered.'
const tools: IconName[] = ['home', 'select', 'hand', 'zoom', 'pen', 'text', 'rect', 'move']

/** Decorative After Effects UI pieces floating on the purple canvas. */
function Decor() {
  return (
    <div className="decor" aria-hidden="true">
      <div className="d-panel d-tools">
        {tools.map((n) => <span key={n} className={n === 'select' ? 'on' : ''}><Icon name={n} size={17} /></span>)}
      </div>

      <div className="d-panel d-graph">
        <div className="d-graph-head"><i /><b /><i /></div>
        <svg viewBox="0 0 300 120" preserveAspectRatio="none">
          <g className="d-grid">{[30, 60, 90].map((y) => <line key={y} x1="0" x2="300" y1={y} y2={y} />)}</g>
          <path className="d-curve" d="M0 110 C 40 110, 55 15, 75 15 S 110 110, 150 110 S 190 15, 225 15 S 260 110, 300 110" />
          <line className="d-play" x1="150" x2="150" y1="0" y2="120" />
        </svg>
        <div className="d-graph-foot"><span>px/sec</span><span>speed graph</span></div>
      </div>

      <div className="d-panel d-mini">
        <div className="d-ruler"><span>00f</span><span>04f</span><span>08f</span><span>12f</span></div>
        <div className="d-track"><i style={{ left: '0%', width: '62%', background: '#ff6ad5' }} /></div>
        <div className="d-track"><i style={{ left: '20%', width: '72%', background: '#9b5cff' }} /></div>
        <div className="d-track"><i style={{ left: '38%', width: '45%', background: '#2ee6b0' }} /></div>
        <b className="d-head" />
      </div>

      <span className="d-fx">fx</span>
      <span className="d-eye"><Icon name="eye" size={30} /></span>
      <span className="d-watch"><Icon name="stopwatch" size={30} /></span>
    </div>
  )
}

export default function Hero({ ready }: { ready: boolean }) {
  return (
    <section className="hero" id="top">
      <Decor />
      <div className="hero-canvas" aria-hidden="true">
        <Suspense fallback={null}><Scene /></Suspense>
      </div>

      <div className="hero-copy">
        <div className="eyebrow reveal">
          <span className="status-dot" /> available for
          <RotatingText
            texts={['motion design', 'video editing', 'visual systems', 'brand motion']}
            mainClassName="rotating-pill"
            splitLevelClassName="rotating-split"
            staggerFrom="last"
            staggerDuration={0.02}
            rotationInterval={2400}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-120%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
          />
        </div>

        {/* Mounted once the boot screen lifts so the entrance is actually seen. */}
        <h1 className="hero-title" aria-label="Kenjie Villacorta">
          {ready ? (
            <>
              <SplitText text="KENJIE" tag="span" className="hero-line" splitType="chars" delay={45} duration={1.1} ease="power4.out" from={{ opacity: 0, y: 120, rotateX: -80 }} to={{ opacity: 1, y: 0, rotateX: 0 }} textAlign="left" rootMargin="0px" />
              <br />
              <SplitText text="VILLACORTA" tag="span" className="hero-line dark" splitType="chars" delay={40} duration={1.1} ease="power4.out" from={{ opacity: 0, y: 120, rotateX: -80 }} to={{ opacity: 1, y: 0, rotateX: 0 }} textAlign="left" rootMargin="0px" />
            </>
          ) : (
            <span className="hero-line" style={{ visibility: 'hidden' }}>KENJIE<br />VILLACORTA</span>
          )}
        </h1>

        {ready ? <BlurText text={lede} className="hero-lede" animateBy="words" delay={35} stepDuration={0.3} direction="bottom" /> : <p className="hero-lede" style={{ visibility: 'hidden' }}>{lede}</p>}

        <div className="hero-actions reveal">
          <Cta href="#work">open the timeline <b>↘</b></Cta>
          <Cta href={links.portfolio} variant="ghost" external>full portfolio <b>↗</b></Cta>
        </div>
      </div>

      <div className="hero-stats panel reveal">
        <div><strong><CountUp to={4} duration={1.4} delay={0.6} />+</strong><span>years crafting motion</span></div>
        <div><strong>ZXENO</strong><span>motion designer</span></div>
        <div className="hero-tools">
          <AfterEffectsLogo size={30} />
          <FigmaLogo size={30} />
          <span>core tools</span>
        </div>
      </div>
    </section>
  )
}
