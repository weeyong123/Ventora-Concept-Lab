import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './VentoraShowreel.css'

// Independent screenshots; frame the hero and early content instead of fitting the whole page.
// Width/left values trim empty side gutters without modifying the supplied files.
const studies = [
  { id: 'fitness', name: 'Fitness', line: 'A stronger first impression.', beforeHeight: 820, beforeWidth: 100, beforeLeft: 0, pan: 145 },
  { id: 'construction', name: 'Construction', line: 'Built on confidence.', beforeHeight: 880, beforeWidth: 100, beforeLeft: 0, pan: 160 },
  { id: 'dental', name: 'Dental', line: 'Care, made clearer.', beforeHeight: 500, beforeWidth: 153, beforeLeft: -26.5, pan: 125 },
  { id: 'law', name: 'Law', line: 'Expertise. Clear direction.', beforeHeight: 760, beforeWidth: 100, beforeLeft: 0, pan: 150 },
  { id: 'actualized', name: 'Actualized', line: 'A clearer path forward.', beforeHeight: 1100, beforeWidth: 152.08, beforeLeft: -27.08, pan: 130 },
]
const source = (id, phase) => `/showreel-assets/${id}-${phase}.png`
const logo = '/showreel-assets/ventora-logo-transparent.png'
const OPEN = .85
const CASE_DURATIONS = [2.2, 2.25, 2.25, 2.25, 2.25]
const CLOSE = 3.5
const LOOP = OPEN + CASE_DURATIONS.reduce((sum, duration) => sum + duration, 0) + CLOSE

function Screenshot({ study, phase }) {
  return <div className={`vs-page-track vs-page-${phase}`} style={phase === 'before' ? { width: `${study.beforeWidth}%`, marginLeft: `${study.beforeLeft}%` } : undefined}>
    <img className="vs-page-image" src={source(study.id, phase)} alt={`${study.name} website ${phase}`} draggable="false" />
  </div>
}

export default function VentoraShowreel() {
  const root = useRef(null)
  const stage = useRef(null)
  const [error, setError] = useState(false)

  useLayoutEffect(() => {
    // This component mounts only on /ventora-showreel; never change the shared HTML head.
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    document.head.appendChild(robots)
    const oldTitle = document.title
    document.title = 'Ventora Digital — Website Transformations'
    const fit = () => stage.current?.style.setProperty('--vs-scale', Math.min(root.current.clientWidth / 1080, root.current.clientHeight / 1920))
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(root.current)
    let disposed = false
    let ctx
    let timeline
    const images = [...studies.flatMap(({ id }) => ['before', 'after'].map((phase) => source(id, phase))), logo].map((src) => {
      const img = new Image()
      img.src = src
      return img.decode()
    })
    // Start only when every screenshot and the logo are decoded, so recording never catches a loading frame.
    Promise.all([...images, document.fonts.ready]).then(() => {
      if (disposed) return
      ctx = gsap.context(() => {
        timeline = gsap.timeline({ repeat: -1, id: 'ventora-showreel', defaults: { ease: 'power3.inOut' } })
        // Background motion shares the film clock and returns to its initial pose at the seam.
        timeline.fromTo('.vs-haze-back', { x: -28, y: 12, rotation: -8 }, { x: 35, y: -32, rotation: -3, duration: LOOP / 2, ease: 'sine.inOut' }, 0)
          .to('.vs-haze-back', { x: -28, y: 12, rotation: -8, duration: LOOP / 2, ease: 'sine.inOut' }, LOOP / 2)
          .fromTo('.vs-haze-front', { x: 22, y: -18 }, { x: -38, y: 30, duration: LOOP / 2, ease: 'sine.inOut' }, 0)
          .to('.vs-haze-front', { x: 22, y: -18, duration: LOOP / 2, ease: 'sine.inOut' }, LOOP / 2)
          .fromTo('.vs-atmosphere-lines', { x: -12, y: 18 }, { x: 18, y: -26, duration: LOOP / 2, ease: 'sine.inOut' }, 0)
          .to('.vs-atmosphere-lines', { x: -12, y: 18, duration: LOOP / 2, ease: 'sine.inOut' }, LOOP / 2)
        gsap.utils.toArray('.vs-dust').forEach((particle, index) => {
          const drift = 14 + (index % 4) * 8
          timeline.fromTo(particle, { y: 0, opacity: .08 }, { y: -drift, opacity: .2, duration: LOOP / 2, ease: 'sine.inOut' }, 0)
            .to(particle, { y: 0, opacity: .08, duration: LOOP / 2, ease: 'sine.inOut' }, LOOP / 2)
        })
        timeline.set('.vs-opening', { autoAlpha: 1 }, 0)
          .to('.vs-opening', { autoAlpha: 0, duration: .2 }, OPEN - .2)
        studies.forEach((study, i) => {
          const start = OPEN + CASE_DURATIONS.slice(0, i).reduce((sum, duration) => sum + duration, 0)
          const duration = CASE_DURATIONS[i]
          const scene = `.vs-case-${study.id}`
          const reveal = start + (i === 0 ? .5 : .6)
          timeline.to(`.vs-tone-${study.id}`, { opacity: 1, duration: .45, ease: 'sine.inOut' }, start)
          if (i > 0) timeline.to(`.vs-tone-${studies[i - 1].id}`, { opacity: 0, duration: .45, ease: 'sine.inOut' }, start)
          const push = .34
          const settle = .2
          timeline.set(scene, { autoAlpha: 1 }, start)
            .fromTo(`${scene} .vs-case-heading`, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .18 }, start)
            .fromTo(`${scene} .vs-before`, { opacity: 0, scale: .97, x: 0 }, { opacity: 1, scale: 1, x: 0, duration: .1 }, start)
            .fromTo(`${scene} .vs-page-before`, { y: 0 }, { y: -16, duration: reveal - start, ease: 'none' }, start)
            // The old site recedes as the new site pushes forward through the mask.
            .fromTo(`${scene} .vs-after`, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .28, ease: 'power2.inOut' }, reveal)
            .to(`${scene} .vs-before`, { opacity: 0, scale: .91, x: -55, duration: .24, ease: 'power2.in' }, reveal)
            .fromTo(`${scene} .vs-after-art`, { scale: 1, y: 0 }, { scale: 1.1, y: 0, duration: push, ease: 'power3.out' }, reveal)
            .to(`${scene} .vs-after-art`, { scale: 1.075, duration: settle, ease: 'sine.inOut' }, reveal + push)
            .to(`${scene} .vs-after-art`, { y: -study.pan, duration: start + duration - .15 - (reveal + push), ease: 'none' }, reveal + push)
            .to(`${scene} .vs-label-before`, { opacity: 0, duration: .1 }, reveal)
            .fromTo(`${scene} .vs-label-after`, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .18 }, reveal + .1)
            .fromTo(`${scene} .vs-outcome`, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .25 }, reveal + .22)
            .to(scene, { autoAlpha: 0, duration: .15 }, start + duration - .15)
        })
        const end = OPEN + CASE_DURATIONS.reduce((sum, duration) => sum + duration, 0)
        timeline.to('.vs-tone-actualized', { opacity: 0, duration: .65 }, end)
        timeline.set('.vs-closing', { autoAlpha: 1 }, end)
          .fromTo('.vs-closing-copy > *', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .42, stagger: .09 }, end)
          .to('.vs-closing', { autoAlpha: 0, duration: .25, ease: 'sine.inOut' }, end + CLOSE - .25)
          // Finish in the exact opening state so the repeat boundary has no flash or reset.
          .to('.vs-opening', { autoAlpha: 1, duration: .25, ease: 'sine.inOut' }, end + CLOSE - .25)
      }, stage)
    }).catch(() => { if (!disposed) setError(true) })
    const visibility = () => { if (document.hidden) timeline?.pause(); else timeline?.restart() }
    document.addEventListener('visibilitychange', visibility)
    return () => {
      disposed = true
      ctx?.revert()
      observer.disconnect()
      document.removeEventListener('visibilitychange', visibility)
      robots.remove()
      document.title = oldTitle
    }
  }, [])

  return <main className="vs-shell" ref={root} aria-label="Ventora Digital, five website transformations in a looping 15.55-second film">
    <div className="vs-stage" ref={stage}>
      <div className="vs-light" aria-hidden="true">
        {studies.map(({ id }) => <div key={id} className={`vs-atmosphere-tone vs-tone-${id}`} />)}
        <div className="vs-haze vs-haze-back" />
        <div className="vs-haze vs-haze-front" />
        <div className="vs-atmosphere-lines"><i /><i /><i /></div>
        {Array.from({ length: 18 }, (_, i) => <i key={i} className="vs-dust" style={{ left: `${4 + (i * 37) % 92}%`, top: `${8 + (i * 23) % 86}%`, width: 1.5 + i % 3, height: 1.5 + i % 3 }} />)}
        <div className="vs-atmosphere-vignette" />
      </div>
      <div className="vs-brand"><img src={logo} alt="Ventora Digital" className="vs-brand-logo" /></div>
      <span className="vs-edition">SELECTED TRANSFORMATIONS / 01—05</span>
      <section className="vs-opening vs-scene">
        <div className="vs-opening-copy"><p className="vs-eyebrow">SAME BUSINESS. NEW POSSIBILITIES.</p><h1>WE DON’T JUST<br />REDESIGN<br />WEBSITES.<br /><span>WE MAKE<br />THE JOURNEY<br />CLEARER.</span></h1><div className="vs-rule" /></div>
      </section>
      {studies.map((study, i) => <section className={`vs-case vs-case-${study.id} vs-scene`} key={study.id}>
        <div className="vs-case-heading"><p className="vs-eyebrow">WEBSITE TRANSFORMATION <span>0{i + 1} / 05</span></p><h2>{study.name}<span>↗</span></h2></div>
        <div className="vs-phase"><span className="vs-label-before">BEFORE</span><span className="vs-label-after"><i /> AFTER</span></div>
        <div className="vs-art-window"><div className="vs-before"><div className="vs-before-window" style={{ height: study.beforeHeight }}><Screenshot study={study} phase="before" /></div></div><div className="vs-after"><div className="vs-after-art"><Screenshot study={study} phase="after" /></div></div></div>
        <div className="vs-outcome"><span className="vs-eyebrow">A CLEARER EXPERIENCE</span><p>{study.line}</p></div>
      </section>)}
      <section className="vs-closing vs-scene"><div className="vs-closing-copy"><p className="vs-eyebrow">YOUR NEXT CHAPTER STARTS HERE.</p><h2><img src={logo} alt="Ventora Digital" className="vs-closing-logo" /></h2><p className="vs-values">CLARITY • TRUST • CONVERSION</p><div className="vs-rule" /><p className="vs-promise">Better websites build<br />stronger businesses.</p><p className="vs-cta">DM “AUDIT” <span>↗</span></p><p className="vs-services">Website Design • Funnels • Homepage Strategy</p></div></section>
      <div className="vs-footer"><span>DESIGNED FOR A CLEARER JOURNEY.</span><span className="vs-footer-brand"><img src={logo} alt="Ventora Digital" /></span></div>
      {error && <p className="vs-error" role="alert">The showreel images could not load. Please reload to start the film.</p>}
    </div>
  </main>
}
