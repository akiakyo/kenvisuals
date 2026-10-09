import aeUrl from '../assets/logos/after-effects.svg'
import figmaUrl from '../assets/logos/figma.svg'

export const logoUrls = { ae: aeUrl, figma: figmaUrl }

export function AfterEffectsLogo({ size = 56 }: { size?: number }) {
  return <img src={aeUrl} width={size} height={size * (234 / 240)} alt="Adobe After Effects logo" draggable={false} />
}

export function FigmaLogo({ size = 56 }: { size?: number }) {
  return <img src={figmaUrl} width={size * (38 / 57)} height={size} alt="Figma logo" draggable={false} />
}
