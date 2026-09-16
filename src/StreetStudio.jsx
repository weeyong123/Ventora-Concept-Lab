import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './StreetStudio.css'

gsap.registerPlugin(ScrollTrigger)
const moments = ['OUTSIDE', 'OPEN', 'PASSAGE', 'TURN RIGHT', 'MAIN HALL', 'FINAL MARK']
const duration = 11.2
const stops = [0, 1.8, 3.84, 6, 8, duration].map(t => t / duration)
const roomAt = p => { const t = p * duration; return t < 1.25 ? 0 : t < 3.3 ? 1 : t < 4.45 ? 2 : t < 7.05 ? 3 : t < 9.9 ? 4 : 5 }
const asset = name => `/street-studio/rebuild/${name}.png`

export default function StreetStudio() {
  const root = useRef(null)
  const sequence = useRef(null)
  const dialog = useRef(null)
  const focusBefore = useRef(null)
  const [moment, setMoment] = useState(0)
  const [motionOff, setMotionOff] = useState(false)
  const [systemReduced, setSystemReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const reduced = motionOff || systemReduced

  useLayoutEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setSystemReduced(query.matches)
    query.addEventListener('change', update)
    const title = document.title
    document.title = 'MARK® / Enter the building — Demo 07'
    return () => { query.removeEventListener('change', update); document.title = title }
  }, [])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const depth = () => root.current.clientWidth / 2
      const advance = () => Math.min(250, root.current.clientWidth * .32)
      const report = p => {
        const next = roomAt(p)
        setMoment(next)
        root.current.dataset.moment = String(next)
        gsap.set('.mk-progress i', { scaleX: p })
      }
      if (reduced) {
        sequence.current = ScrollTrigger.create({ trigger: '.mk-journey', start: 'top top', end: 'bottom bottom', onUpdate: s => report(s.progress), onRefresh: s => report(s.progress) })
        report(sequence.current.progress)
        return
      }
      const size = () => {
        gsap.set(root.current, { '--mk-depth': `${depth()}px` })
        gsap.set('.mk-camera', { perspective: Math.max(1100, depth() * 2.2) })
        gsap.set('.mk-corridor', { z: -depth() })
        gsap.set('.mk-hall', { x: depth(), rotationY: -90 })
        gsap.set('.mk-corner', { z: -depth() + Math.min(220, depth() * .45), rotationY: -35 })
      }
      size()
      gsap.set('.mk-hall, .mk-corner, .mk-exit', { autoAlpha: 0 })
      const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
        trigger: '.mk-journey', start: 'top top', end: 'bottom bottom', scrub: .7,
        invalidateOnRefresh: true, onRefreshInit: size,
        onUpdate: s => report(s.progress),
      } })
      sequence.current = tl.scrollTrigger
      tl.fromTo('.mk-approach', { scale: .88 }, { scale: 1.14, duration: 1.25, ease: 'power1.inOut' }, 0)
        .to('.mk-outside-post', { scale: 1.4, duration: 1.25 }, 0)
        .to('.mk-door-left', { xPercent: -101, duration: 1, ease: 'power2.inOut' }, 1.25)
        .to('.mk-door-right', { xPercent: 101, duration: 1, ease: 'power2.inOut' }, 1.25)
        .fromTo('.mk-entry-spill', { opacity: .08 }, { opacity: .75, duration: .8 }, 1.3)
        .to('.mk-approach', { scale: 4.8, duration: 1.05, ease: 'power2.in' }, 2.25)
        .to('.mk-outside-post', { scale: 2.8, autoAlpha: 0, duration: .75 }, 2.3)
        .set('.mk-outside', { autoAlpha: 0 }, 3.3)
        .fromTo('.mk-world', { z: () => depth() - 145 }, { z: depth, duration: 1.15, ease: 'power1.inOut' }, 3.3)
        .to('.mk-corridor-canvas', { scale: 1.42, duration: 1.15, ease: 'power1.inOut' }, 3.3)
        // Finish the approach, then hold the compressed end wall for 0.6 units.
        .set('.mk-hall, .mk-corner', { autoAlpha: 1 }, 5.05)
        .to('.mk-world', { rotationY: 90, duration: 1.9, ease: 'power2.inOut' }, 5.05)
        // The perpendicular hall opens behind the close corner, late in the turn.
        .fromTo('.mk-hall-canvas', { filter: 'brightness(.65)' }, { filter: 'brightness(1.08)', duration: 1.05, ease: 'power1.inOut' }, 5.9)
        .set('.mk-corridor, .mk-corner', { autoAlpha: 0 }, 7.05)
        // Forward movement starts only after the full 90-degree turn and settling beat.
        .fromTo('.mk-world', { z: depth }, { z: () => depth() + advance(), duration: 1.95, ease: 'power1.inOut', immediateRender: false }, 7.15)
        .to('.mk-hall-front', { z: 300, scale: 1.12, duration: 1.95, ease: 'power1.inOut' }, 7.15)
        .fromTo('.mk-exit', { autoAlpha: 1, clipPath: 'inset(26% 43% 24% 43%)', scale: .86 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.3, ease: 'power2.inOut', immediateRender: false }, 9.3)
        .to('.mk-world', { autoAlpha: 0, duration: .5 }, 10.2)
        .fromTo('.mk-exit-camera', { scale: 1 }, { scale: 1.12, duration: .6, ease: 'power1.out' }, 10.6)
    }, root)
    return () => { ctx.revert(); sequence.current = null }
  }, [reduced])

  const go = i => {
    const st = sequence.current
    if (!st) return
    window.scrollTo({ top: st.start + (st.end - st.start) * stops[i], behavior: reduced ? 'instant' : 'smooth' })
  }
  const openContact = () => { focusBefore.current = document.activeElement; dialog.current.showModal() }
  const closeContact = () => { dialog.current.close(); focusBefore.current?.focus() }

  return <main ref={root} className={`mk-studio${reduced ? ' mk-reduced' : ''}`} data-moment={moment}>
    <header className="mk-ui mk-header">
      <a href="/street-studio" className="mk-logo" aria-label="MARK studio entrance">MARK<sup>®</sup></a>
      <span className="mk-edition">VENTORA / SPATIAL STUDIES<br />07 — THE BUILDING</span>
      <button className="mk-motion" aria-pressed={reduced} onClick={() => setMotionOff(!motionOff)} disabled={systemReduced}>{reduced ? 'MOTION OFF' : 'MOTION ON'}</button>
      <button className="mk-project" onClick={() => go(5)}>START A PROJECT ↗</button>
    </header>
    <div className="mk-journey"><div className="mk-stage">
      <div className="mk-camera"><div className="mk-world">
        <section className="mk-room mk-corridor" aria-label="Graffiti corridor and right turn" aria-hidden={moment < 2 || moment > 3}>
          <div className="mk-room-canvas mk-corridor-canvas">
            <img src={asset('corridor')} alt="Narrow blue and magenta graffiti corridor ending at a concrete wall with an orange-lit opening to the right" />
            <div className="mk-wall-statement"><p>01 / THROUGH THE NOISE</p><h2>INDEPENDENT<br /><em>by design.</em></h2><span aria-hidden="true">↱</span></div>
          </div>
          <div className="mk-passage-frame" aria-hidden="true" />
        </section>
        <section className="mk-room mk-hall" aria-label="Main exhibition hall" aria-hidden={moment !== 4}>
          <div className="mk-room-canvas mk-hall-canvas"><img src={asset('hall')} alt="Double-height orange mural wall painted WE DON'T MAKE QUIET WORK, surrounded by saturated blue and pink murals, concrete columns and installation plinths" /></div>
          <h2 className="mk-sr-only">WE DON’T MAKE QUIET WORK.</h2>
          <div className="mk-hall-front" aria-hidden="true"><i /><b /></div>
        </section>
        <div className="mk-corner" aria-hidden="true"><i /><span /></div>
      </div></div>
      <section className="mk-outside" aria-label={moment === 1 ? 'Door opening' : 'Outside approach'} aria-hidden={moment > 1}>
        <div className="mk-approach"><div className="mk-facade">
          <div className="mk-facade-skin" />
          <div className="mk-entry-leaves">
            <div className="mk-door mk-door-left"><h1>ENTER</h1><span>07</span></div>
            <div className="mk-door mk-door-right"><p>THE<br />MARK.</p><i aria-hidden="true" /></div>
          </div>
          <div className="mk-entry-spill" aria-hidden="true" />
          <span className="mk-entrance-plate">MARK® — INDEPENDENT CREATIVE SPACE</span>
        </div></div>
        <div className="mk-outside-post mk-post-left" aria-hidden="true" /><div className="mk-outside-post mk-post-right" aria-hidden="true" />
      </section>
      <section className="mk-exit" aria-label="Final mark and project contact" aria-hidden={moment !== 5}>
        <div className="mk-exit-camera"><div className="mk-room-canvas mk-exit-canvas"><img src={asset('exit')} alt="Quiet concrete exit chamber with a blue steel door, pink ceiling light and a painted floor line" /><div className="mk-final-door"><p>MAKE<br />YOUR<br /><em>MARK.</em></p><button onClick={openContact} tabIndex={moment === 5 ? 0 : -1}>START A PROJECT →</button></div></div></div>
      </section>
      <div className="mk-grain" aria-hidden="true" />
    </div></div>
    <nav className="mk-ui mk-navigation" aria-label="Building journey">
      <span className="mk-position">0{moment + 1}<small> / 06</small></span>
      <div className="mk-stops">{moments.map((name, i) => <button key={name} onClick={() => go(i)} aria-label={name} aria-current={moment === i ? 'step' : undefined}><i /><span>{name}</span></button>)}</div>
    </nav>
    <div className="mk-ui mk-bottom"><span>{reduced ? 'SCROLL TO EXPLORE' : moment === 3 ? 'TURN RIGHT ↱' : moment === 5 ? 'LEAVE A TRACE.' : 'SCROLL TO MOVE DEEPER ↓'}</span><button onClick={() => go(0)}>BACK TO ENTRANCE ↖</button></div>
    <div className="mk-progress" aria-hidden="true"><i /></div>
    <dialog ref={dialog} className="mk-dialog" aria-label="Start a project" onCancel={closeContact} onClick={e => { if (e.target === dialog.current) closeContact() }}>
      <button className="mk-close" onClick={closeContact} aria-label="Close">×</button><p>MARK® / VENTORA CONCEPT LAB</p><h2>LET’S MAKE<br />A MARK.</h2><p>This is a fictional studio concept.<br />No live enquiries are collected.</p><button className="mk-dialog-back" onClick={closeContact}>BACK INTO THE BUILDING ↗</button>
    </dialog>
  </main>
}
