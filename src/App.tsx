import { useCallback, useEffect, useState } from 'react'
import { Boot, Footer, Nav, Ticker } from './components/Chrome'
import Hero from './components/Hero'
import Timeline from './components/Timeline'
import { About, Clients, Contact } from './components/Sections'
import VideoModal, { type ModalState } from './components/VideoModal'
import ClickSpark from './components/reactbits/ClickSpark/ClickSpark'
import { useRevealAll } from './hooks'
import { installSfx, sfx } from './sfx'

export default function App() {
  const [ready, setReady] = useState(false)
  const [modal, setModal] = useState<ModalState>(null)
  const onBootDone = useCallback(() => setReady(true), [])
  const openVideo = useCallback((src: string, title: string) => {
    sfx.whoosh()
    setModal({ src, title })
  }, [])
  const closeVideo = useCallback(() => setModal(null), [])
  useRevealAll(ready)
  useEffect(installSfx, [])

  return (
    <ClickSpark sparkColor="#ffffff" sparkSize={11} sparkRadius={22} sparkCount={9} duration={450}>
      <Boot onDone={onBootDone} />
      <div className="noise" aria-hidden="true" />
      <Nav />
      <main>
        <Hero ready={ready} />
        <Ticker />
        <Timeline onOpen={openVideo} />
        <About />
        <Clients />
        <Contact />
      </main>
      <Footer />
      <VideoModal state={modal} onClose={closeVideo} />
    </ClickSpark>
  )
}
