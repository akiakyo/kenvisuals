import { useEffect, useState } from 'react'

/** Adds `.visible` to every `.reveal` element once it scrolls into view. */
export function useRevealAll(ready: boolean) {
  useEffect(() => {
    if (!ready) return
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('visible')
          io.unobserve(entry.target)
        }),
      { threshold: 0.15 },
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ready])
}

/** Fraction of the page scrolled, 0–1. */
export function useScrollProgress() {
  const [state, setState] = useState({ progress: 0, scrolled: false })
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight
      setState({ progress: max ? scrollY / max : 0, scrolled: scrollY > 50 })
    }
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])
  return state
}
