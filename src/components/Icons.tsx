import type { SVGProps } from 'react'

/** Small stroke icons echoing the After Effects tool bar and timeline. */
const paths = {
  home: 'M3 11l9-7 9 7M5 10v10h5v-6h4v6h5V10',
  select: 'M5 3l14 8-6 2-3 6z',
  hand: 'M8 13V5.5a1.5 1.5 0 013 0V11m0-6.5a1.5 1.5 0 013 0V11m0-5a1.5 1.5 0 013 0v7a7 7 0 01-7 7h-1a6 6 0 01-5-3l-2.6-4.4a1.5 1.5 0 012.5-1.6L8 13',
  zoom: 'M11 18a7 7 0 100-14 7 7 0 000 14zm5-2l5 5',
  pen: 'M12 19l7-7-3-3-7 7-2 5zM14 7l3 3M2 22l5-2',
  text: 'M5 5h14M12 5v14M9 19h6',
  rect: 'M4 5h16v14H4z',
  move: 'M12 3v18M3 12h18M12 3l-3 3m3-3l3 3m-3 15l-3-3m3 3l3-3M3 12l3-3m-3 3l3 3m15-3l-3-3m3 3l-3 3',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zm10 3a3 3 0 100-6 3 3 0 000 6z',
  eyeOff: 'M3 3l18 18M10.6 5.1A10 10 0 0112 5c6.5 0 10 7 10 7a17 17 0 01-3 3.9M6.6 6.6A17 17 0 002 12s3.5 7 10 7a10 10 0 005-1.4',
  stopwatch: 'M12 21a8 8 0 100-16 8 8 0 000 16zm0-8V9m-2-7h4m5 4l1.5-1.5',
  play: 'M7 4l13 8-13 8z',
  pause: 'M7 4h4v16H7zM14 4h4v16h-4z',
  stepBack: 'M18 5L8 12l10 7zM6 5v14',
  stepFwd: 'M6 5l10 7-10 7zM18 5v14',
  reset: 'M4 4v6h6M4.5 15a8 8 0 102-8.5L4 10',
  speaker: 'M4 9h4l5-4v14l-5-4H4zM17 9a4 4 0 010 6',
  lock: 'M6 11h12v9H6zM8 11V8a4 4 0 018 0v3',
  expand: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  menu: 'M4 7h16M4 12h16M4 17h16',
} as const

export type IconName = keyof typeof paths

export function Icon({ name, size = 16, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      <path d={paths[name]} />
    </svg>
  )
}
