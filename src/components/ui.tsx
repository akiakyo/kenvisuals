import type { ReactNode } from 'react'
import DecryptedText from './reactbits/DecryptedText/DecryptedText'
import Magnet from './reactbits/Magnet/Magnet'
import SplitText from './reactbits/SplitText/SplitText'
import StarBorder from './reactbits/StarBorder/StarBorder'

/** Mono section label that unscrambles when scrolled into view. */
export function Kicker({ text }: { text: string }) {
  return (
    <span className="section-kicker">
      <DecryptedText text={text} animateOn="view" sequential speed={28} revealDirection="start" encryptedClassName="kicker-scramble" />
    </span>
  )
}

/** Section heading whose words rise in on scroll; `accent` tints the last word. */
export function Heading({ text, accent = true, className = '' }: { text: string; accent?: boolean; className?: string }) {
  return (
    <SplitText
      tag="h2"
      text={text}
      className={`heading${accent ? ' accent-last' : ''} ${className}`}
      splitType="words"
      delay={70}
      duration={1}
      from={{ opacity: 0, y: 70, rotate: 4 }}
      to={{ opacity: 1, y: 0, rotate: 0 }}
      textAlign="left"
      rootMargin="-60px"
    />
  )
}

type CtaProps = { href: string; children: ReactNode; variant?: 'primary' | 'ghost'; external?: boolean; className?: string }

/** Magnetic button; the primary variant gets a travelling star border. */
export function Cta({ href, children, variant = 'primary', external, className = '' }: CtaProps) {
  const ext = external ? { target: '_blank', rel: 'noopener' } : {}
  return (
    <Magnet padding={40} magnetStrength={6}>
      {variant === 'primary' ? (
        <StarBorder as="a" href={href} className={`button primary ${className}`} color="#f1e4ff" trailColor="#a875ff" radius={15} glow={0.8} sparkle {...ext}>
          {children}
        </StarBorder>
      ) : (
        <a href={href} className={`button ghost ${className}`} {...ext}>{children}</a>
      )}
    </Magnet>
  )
}
