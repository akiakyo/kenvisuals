/** A piece of work, shown as a layer in the Compositions timeline. */
export type Layer = {
  id: string
  title: string
  tag: string
  video: string
  poster?: string
  /** AE-style label colour for the layer bar. */
  label: string
  /** Default in-point and length on the comp timeline, in seconds. */
  start: number
  duration: number
}

/** Length of the Compositions timeline, in seconds. */
export const COMP_DURATION = 30
export const FPS = 24

export const layers: Layer[] = [
  { id: 'reel', title: 'Frames that move', tag: 'showreel / 2026', video: '/assets/videos/frames-that-move.mp4', label: '#9b5cff', start: 0, duration: 7 },
  { id: 'humain', title: 'HUMAIN', tag: 'brand motion / ai', video: '/assets/videos/humain.mp4', poster: '/assets/posters/humain.jpg', label: '#2ee6b0', start: 6, duration: 7 },
  { id: 'solaire', title: 'Solaire', tag: 'social edit / vertical', video: '/assets/videos/solaire.mp4', poster: '/assets/posters/solaire.jpg', label: '#ff6ad5', start: 12, duration: 6 },
  { id: 'business', title: 'Surmount', tag: 'explainer / visual system', video: '/assets/videos/business-motion.mp4', poster: '/assets/posters/business.jpg', label: '#3d9bff', start: 17, duration: 7 },
  { id: 'chf', title: 'BestClip.io', tag: 'motion study / compositing', video: '/assets/videos/chf-motion.mp4', poster: '/assets/posters/chf.jpg', label: '#f2c94c', start: 23, duration: 7 },
]

export const profile = {
  name: 'Kenjie Villacorta',
  handle: 'ken.visuals',
  title: 'Motion Designer · Video Editor',
  hero: '/assets/profile/kenjie-hero.jpg',
  card: '/assets/profile/kenjie-profile.jpg',
  avatar: '/assets/profile/kenjie-avatar.jpg',
  circle: '/assets/profile/kenjie-circle.jpg',
}

export const clients = [
  { name: 'Surmount', role: 'brand / motion', href: 'https://surmount.com/', logo: '/assets/logos/surmount-user.png', invert: true },
  { name: 'HUMAIN', role: 'motion graphics', href: 'https://www.humain.com/en/fabric.html', logo: '/assets/logos/humain-user.png' },
  { name: 'BestClip.io', role: 'video content', href: 'https://www.bestclip.io/', logo: '/assets/logos/bestclip-user.webp' },
  { name: 'ZXENO Studio', role: 'motion designer', href: 'https://zxenostudio.com', logo: '/assets/logos/zxeno-user.png', light: true },
]

export const skills = [
  { name: 'Motion Graphics', level: 94 },
  { name: 'After Effects', level: 93 },
  { name: 'Video Editing', level: 90 },
  { name: 'Figma', level: 82 },
]

export const links = {
  portfolio: 'https://drive.google.com/drive/folders/1ICj09iPZ1IZwO2lqayA-v56-MY_jdOrr',
  email: 'kenjievillacorta24@gmail.com',
  instagram: 'ken.villacorta',
  /** Local PH format for display; wa.me needs it in international form. */
  whatsapp: '09497027995',
  whatsappIntl: '639497027995',
}
