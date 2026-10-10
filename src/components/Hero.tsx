import { links, profile } from '../content'
import { Icon, type IconName } from './Icons'
import { AfterEffectsLogo, FigmaLogo } from './Logos'
import BlurText from './reactbits/BlurText/BlurText'
import CountUp from './reactbits/CountUp/CountUp'
import RotatingText from './reactbits/RotatingText/RotatingText'
import SideRays from './reactbits/SideRays/SideRays'
import SplitText from './reactbits/SplitText/SplitText'
import { Cta } from './ui'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

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
      <div className="hero-rays" aria-hidden="true">
        <SideRays origin="top-right" rayColor1="#ffffff" rayColor2="#ffc4f0" speed={1.6} intensity={1.6} spread={2.2} saturation={1.1} blend={0.6} falloff={1.4} opacity={0.85} />
      </div>
      <Decor />
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
          <span className="hero-name">
            {ready ? (
              <>
                <SplitText text="KENJIE" tag="span" className="hero-line" splitType="chars" delay={45} duration={1.1} ease="power4.out" from={{ opacity: 0, y: 120, rotateX: -80 }} to={{ opacity: 1, y: 0, rotateX: 0 }} textAlign="left" rootMargin="0px" />
                <br />
                <SplitText text="VILLACORTA" tag="span" className="hero-line dark" splitType="chars" delay={40} duration={1.1} ease="power4.out" from={{ opacity: 0, y: 120, rotateX: -80 }} to={{ opacity: 1, y: 0, rotateX: 0 }} textAlign="left" rootMargin="0px" />
              </>
            ) : (
              <span className="hero-line" style={{ visibility: 'hidden' }}>KENJIE<br />VILLACORTA</span>
            )}
          </span>
          {/* His photo as a selected AE layer: bounding box and transform handles. */}
          <span className={`hero-photo${ready ? ' in' : ''}`}>
            <img src={profile.circle} alt="" width={600} height={600} />
            <span className="layer-box" aria-hidden="true">
              {['tl', 't', 'tr', 'r', 'br', 'b', 'bl', 'l'].map((h) => <i key={h} className={`h-${h}`} />)}
            </span>
          </span>
        </h1>

        {ready ? <BlurText text={lede} className="hero-lede" animateBy="words" delay={35} stepDuration={0.3} direction="bottom" /> : <p className="hero-lede" style={{ visibility: 'hidden' }}>{lede}</p>}

        <div className="hero-actions reveal">
          <Cta href="#work">open the timeline <b><ArrowDownRight size={14} strokeWidth={2.25} /></b></Cta>
          <Cta href={links.portfolio} variant="ghost" external>full portfolio <b><ArrowUpRight size={14} strokeWidth={2.25} /></b></Cta>
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
