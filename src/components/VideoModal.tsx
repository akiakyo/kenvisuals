import { useEffect } from 'react'

export type ModalState = { src: string; title: string } | null

export default function VideoModal({ state, onClose }: { state: ModalState; onClose: () => void }) {
  useEffect(() => {
    if (!state) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      removeEventListener('keydown', onKey)
    }
  }, [state, onClose])

  return (
    <div className={`modal${state ? ' open' : ''}`} aria-hidden={!state} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <button className="modal-close" aria-label="Close" onClick={onClose}>×</button>
      <div className="modal-shell glass-strong" role="dialog" aria-modal="true" aria-label={state?.title}>
        <div className="modal-title"><span>{state?.title ?? 'Selected work'}</span><small>selected work</small></div>
        {state && <video key={state.src} src={state.src} controls autoPlay playsInline />}
      </div>
    </div>
  )
}
