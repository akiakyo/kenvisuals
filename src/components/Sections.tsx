import { useRef, useState } from 'react'
import { clients, links, profile, skills } from '../content'
import { Icon } from './Icons'
import { AfterEffectsLogo, FigmaLogo } from './Logos'
import Panel from './Panel'
import GlareHover from './reactbits/GlareHover/GlareHover'
import ProfileCard from './reactbits/ProfileCard/ProfileCard'
import { Cta, Heading, Kicker } from './ui'
import { ArrowUpRight, Check } from 'lucide-react'

/** An AE property row whose value can be scrubbed by dragging, like After Effects' blue numbers. */
function ScrubProperty({ name, initial }: { name: string; initial: number }) {
  const [value, setValue] = useState(initial)
  const start = useRef(0)
  const onDown = (e: React.PointerEvent<HTMLSpanElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    start.current = e.clientX - value * 2
  }
  const onMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return
    setValue(Math.round(Math.min(100, Math.max(0, (e.clientX - start.current) / 2)) * 10) / 10)
  }
  return (
    <div className="prop reveal" style={{ '--level': `${value}%` } as React.CSSProperties}>
      <span className="prop-name"><Icon name="stopwatch" size={13} />{name}</span>
      <span
        className="scrub"
        role="slider"
        tabIndex={0}
        aria-label={name}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') setValue((v) => Math.min(100, v + 1))
          if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') setValue((v) => Math.max(0, v - 1))
        }}
      >
        {value.toFixed(1)}%
      </span>
      <i />
    </div>
  )
}

export function About() {
  return (
    <section id="about" className="section-pad about">
      <div className="about-card reveal">
        <ProfileCard
          avatarUrl={profile.card}
          miniAvatarUrl={profile.avatar}
          iconUrl=""
          grainUrl=""
          name="Kenjie"
          title={profile.title}
          handle={profile.handle}
          status="Motion Designer @ ZXENO"
          contactText="Contact"
          innerGradient="linear-gradient(145deg, #7b2ff7aa 0%, #2ee6b033 100%)"
          behindGlowColor="rgba(155, 92, 255, .7)"
          onContactClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
        />
      </div>

      <div className="about-copy">
        <Kicker text="02 / about kenjie" />
        <Heading text="Movement with intent." />
        <Panel title="Effect Controls: kenjie_villacorta" className="fx-panel reveal">
          <p>
            I'm <strong>Kenjie Villacorta</strong>, also known as <strong>ken.visuals</strong> — a motion designer and video editor
            with 4 years of experience shaping digital visuals for brands, campaigns, and content.
          </p>
          <p>
            Currently creating as a <strong>Motion Designer at ZXENO Studio</strong>, working across motion graphics, compositing,
            edit pacing, and visual storytelling.
          </p>
          <div className="props">
            <div className="props-head"><span>fx</span> Skills <small>drag the blue values</small></div>
            {skills.map((s) => <ScrubProperty key={s.name} name={s.name} initial={s.level} />)}
          </div>
          <div className="project-items">
            <div className="item"><AfterEffectsLogo size={34} /><div><b>After Effects</b><span>Motion graphics · compositing · animation systems</span></div></div>
            <div className="item"><FigmaLogo size={34} /><div><b>Figma</b><span>Visual direction · layout · interface concepts</span></div></div>
          </div>
        </Panel>
      </div>
    </section>
  )
}

export function Clients() {
  return (
    <section id="clients" className="section-pad">
      <div className="section-head">
        <div><Kicker text="03 / selected collaborations" /><Heading text="Worked with." accent={false} /></div>
        <p className="reveal">Motion and visual work across real estate, AI, and creator technology.</p>
      </div>
      <Panel title="Project" tabs={['Footage', 'Clients']} className="project-panel reveal">
        <div className="client-grid">
          {clients.map((c) => (
            <a key={c.name} className="client-card" href={c.href} target="_blank" rel="noopener">
              <GlareHover
                width="100%"
                height="120px"
                background={c.light ? '#f2f2f2' : '#1a1a1a'}
                borderColor="#3a3a3a"
                borderRadius="6px"
                glareColor={c.light ? '#9b5cff' : '#ffffff'}
                glareOpacity={c.light ? 0.25 : 0.2}
                glareSize={260}
                transitionDuration={750}
                className="client-logo-wrap"
              >
                <img src={c.logo} alt={`${c.name} logo`} className={c.invert ? 'invert' : undefined} />
              </GlareHover>
              <div className="client-meta"><span>{c.name}</span><small>{c.role}</small><b><ArrowUpRight size={14} strokeWidth={2.25} /></b></div>
            </a>
          ))}
        </div>
      </Panel>
    </section>
  )
}

export function Contact() {
  return (
    <section id="contact" className="section-pad contact">
      <div className="contact-copy">
        <Kicker text="04 / contact" />
        <Heading text="Have a frame in mind?" accent={false} />
        <Heading text="Let's make it move." className="heading-dark" accent={false} />
      </div>
      <Panel title="Render Queue" className="render-panel reveal">
        <div className="rq-head"><span>Render</span><span>#</span><span>Comp Name</span><span>Status</span></div>
        <div className="rq-row">
          <span className="check on" aria-hidden="true"><Check size={11} strokeWidth={3} /></span>
          <span>1</span>
          <span className="rq-comp">Your Next Project</span>
          <span className="rq-status">Queued</span>
        </div>
        <div className="rq-progress" aria-hidden="true"><i /></div>
        <dl className="rq-settings">
          <div><dt>Render Settings</dt><dd>Motion design · editing · visual direction</dd></div>
          <div><dt>Output To</dt><dd>{links.email}</dd></div>
        </dl>
        <div className="rq-actions">
          <Cta href={`mailto:${links.email}`}>Render <b><ArrowUpRight size={14} strokeWidth={2.25} /></b></Cta>
        </div>
      </Panel>
    </section>
  )
}
