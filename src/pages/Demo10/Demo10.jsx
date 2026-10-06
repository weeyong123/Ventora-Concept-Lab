import { useEffect, useRef } from 'react'
import './Demo10.css'
import Material from './Material.jsx'
import CampaignEnding from './CampaignEnding.jsx'

const FREEZE_TIME = 6
const clamp = (value) => Math.min(1, Math.max(0, value))
const ramp = (value, start, end) => clamp((value - start) / (end - start))
const ease = (value) => value * value * (3 - 2 * value)
const FREEZE_PROGRESS = .64
const SLOWDOWN_PROGRESS = .46
// Integrate a velocity that tapers to zero: the film slows with scroll distance,
// never with elapsed time. The same curve retraces exactly when scrolling back.
const filmPosition = (progress) => {
  const tail = FREEZE_PROGRESS - SLOWDOWN_PROGRESS
  const distance = SLOWDOWN_PROGRESS + tail / 2
  if (progress <= SLOWDOWN_PROGRESS) return clamp(progress / distance)
  const t = ramp(progress, SLOWDOWN_PROGRESS, FREEZE_PROGRESS)
  return (SLOWDOWN_PROGRESS + tail * (t - t * t / 2)) / distance
}
const CAPTIONS = [
  { key: 'shape', timing: [.245, .28, .365, .415] },
  { key: 'movement', timing: [.43, .465, .565, .62] },
]

// Native scroll is the clock: no playback, inertia, or time-based animation.
function useEditorialFilm() {
  const root = useRef(null)
  const video = useRef(null)
  useEffect(() => {
    const page = root.current
    const film = video.current
    const mobile = matchMedia('(max-width:700px)')
    const stage = page.querySelector('.etat-stage')
    const captions = CAPTIONS.map(caption => ({ ...caption, element: page.querySelector(`.etat-narrative-${caption.key}`) }))
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    let raf = 0
    let target = 0
    let progress = 0
    let disposed = false
    let failed = false
    let frozen = false
    let watchdog = 0

    const paint = () => {
      const reduced = preference.matches
      // A fast scroll must finish decoding the selected frame before reframing it.
      const canReframe = frozen || failed || reduced
      const spread = reduced ? 1 : canReframe ? ease(ramp(progress, FREEZE_PROGRESS, .91)) : 0
      const type = reduced ? 0 : 1 - ramp(progress, .015, .24)
      page.style.setProperty('--etat-spread', spread)
      page.style.setProperty('--etat-hero-opacity', type)
      page.style.setProperty('--etat-hero-shift', `${(1 - type) * -65}px`)
      for (const { element, timing: [start, entered, leaving, end] } of captions) {
        const arrival = ease(ramp(progress, start, entered))
        const departure = ease(ramp(progress, leaving, end))
        const visible = reduced ? 0 : arrival * (1 - departure)
        element.style.setProperty('--etat-caption-in', arrival)
        element.style.setProperty('--etat-caption-out', departure)
        element.style.setProperty('--etat-caption-visible', visible)
        element.setAttribute('aria-hidden', visible < .05)
      }
      // The page furniture, chapter, headline and detail resolve separately as
      // the same paused film contracts into the magazine's image aperture.
      page.style.setProperty('--etat-edition-resolve', ramp(spread, .12, .38))
      page.style.setProperty('--etat-chapter-resolve', ease(ramp(spread, .2, .52)))
      page.style.setProperty('--etat-title-resolve', ease(ramp(spread, .36, .8)))
      page.style.setProperty('--etat-detail-opacity', ease(ramp(spread, .65, 1)))
      page.style.setProperty('--etat-caption-resolve', ramp(spread, .72, 1))
      page.dataset.phase = reduced || spread === 1 ? 'editorial' : progress >= FREEZE_PROGRESS ? 'freeze' : 'film'
      page.querySelector('.etat-editorial').setAttribute('aria-hidden', spread < .5)
      page.querySelector('.etat-hero-type').setAttribute('aria-hidden', type < .1)
    }

    const seek = () => {
      raf = 0
      if (disposed || preference.matches || failed || document.hidden || film.readyState < 2 || film.seeking) return
      if (Math.abs(film.currentTime - target) <= .012) return
      // Serialize decoder work. seeked always picks up the newest scroll target,
      // including direction changes that arrive while an earlier seek is pending.
      film.currentTime = target
      clearTimeout(watchdog)
      watchdog = setTimeout(() => {
        if (disposed) return
        if (!film.seeking) schedule()
        else { failed = true; page.dataset.mediaError = 'true'; paint() }
      }, 5000)
    }
    const schedule = () => { if (!raf && !disposed) raf = requestAnimationFrame(seek) }
    const update = () => {
      // Mobile browser chrome can resize the visual viewport during a swipe.
      // The svh stage remains stable, so use its height for the mobile scroll clock.
      const viewport = mobile.matches ? stage.clientHeight : innerHeight
      progress = clamp(-page.getBoundingClientRect().top / Math.max(1, page.offsetHeight - viewport))
      target = filmPosition(progress) * Math.min(FREEZE_TIME, Number.isFinite(film.duration) ? film.duration - .05 : FREEZE_TIME)
      frozen = target >= FREEZE_TIME - .02 && !film.seeking && film.readyState >= 2 && Math.abs(film.currentTime - FREEZE_TIME) < .025
      page.dataset.progress = progress.toFixed(4)
      paint()
      schedule()
    }
    const decoded = () => {
      clearTimeout(watchdog)
      if (!film.seeking) {
        frozen = Math.abs(film.currentTime - FREEZE_TIME) < .025
      }
      paint()
      schedule()
    }
    const ready = () => { film.pause(); update(); decoded() }
    const error = () => { failed = true; page.dataset.mediaError = 'true'; paint() }
    const changed = () => {
      film.pause()
      page.dataset.reduced = String(preference.matches)
      if (!preference.matches && !film.getAttribute('src')) {
        film.src = '/demo10/etat/etat-film.mp4'
        film.load()
      }
      update()
    }
    const visibility = () => { if (!document.hidden) update() }
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    document.addEventListener('visibilitychange', visibility)
    preference.addEventListener('change', changed)
    film.addEventListener('loadedmetadata', ready)
    film.addEventListener('loadeddata', ready)
    film.addEventListener('canplay', ready)
    film.addEventListener('seeked', decoded)
    film.addEventListener('error', error)
    const observer = new ResizeObserver(update)
    observer.observe(page)
    changed()
    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      clearTimeout(watchdog)
      observer.disconnect()
      film.pause()
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      document.removeEventListener('visibilitychange', visibility)
      preference.removeEventListener('change', changed)
      film.removeEventListener('loadedmetadata', ready)
      film.removeEventListener('loadeddata', ready)
      film.removeEventListener('canplay', ready)
      film.removeEventListener('seeked', decoded)
      film.removeEventListener('error', error)
    }
  }, [])
  return { root, video }
}

export default function Demo10() {
  const { root, video } = useEditorialFilm()
  useEffect(() => {
    const title = document.title
    document.title = 'ÉTAT / 01 — Form is a decision'
    return () => { document.title = title }
  }, [])

  return (
    <main className="etat-document">
    <div className="etat-page" ref={root}>
      <div className="etat-stage">
        <div className="etat-film-frame">
          <img className="etat-static" src="/demo10/etat/etat-freeze.jpg" alt="A sculptural black coat in motion against sunlit concrete" />
          <video ref={video} className="etat-film" muted playsInline preload="auto" disablePictureInPicture poster="/demo10/etat/etat-opening.jpg" aria-label="ÉTAT fashion film, controlled by scrolling" />
        </div>
        <div className="etat-hero-type">
          <p className="etat-name">ÉTAT / 01</p>
          <p className="etat-collection">COLLECTION 01 — 2026</p>
          <h1>FORM IS<br /><span>A DECISION.</span></h1>
          <p className="etat-scroll">SCROLL TO UNFOLD <span aria-hidden="true">↓</span></p>
          <p className="etat-note">A STUDY IN FORM<br />AND RESTRAINT</p>
        </div>
        <div className="etat-narrative" aria-label="Film narrative">
          <p className="etat-narrative-shape" aria-hidden="true"><span>SHAPE DEFINES</span><span>THE PRESENCE.</span></p>
          <p className="etat-narrative-movement" aria-hidden="true"><span>MOVEMENT</span><span>REVEALS IT.</span></p>
        </div>
        <section className="etat-editorial" aria-labelledby="etat-editorial-title" aria-hidden="true">
          <div className="etat-edition"><span>ÉTAT / 01</span><span>COLLECTION 01 — 2026</span></div>
          <p className="etat-number" aria-hidden="true">01</p>
          <p className="etat-silhouette">THE SILHOUETTE</p>
          <h2 id="etat-editorial-title">STRUCTURE<br /><em>WITHOUT</em><br />EXCESS.</h2>
          <figure className="etat-detail">
            <div><img src="/demo10/etat/etat-freeze.jpg" alt="Detail of the same frame: folded black fabric and the coat’s sculpted waist" /></div>
            <figcaption>01.1 / A CLOSER STUDY</figcaption>
          </figure>
          <p className="etat-caption">A line held in motion.<br />A silhouette, resolved.</p>
          <p className="etat-image-caption">FIG. 01 &nbsp; / &nbsp; FORM IN STILLNESS</p>
          <p className="etat-folio"><span>ÉTAT — STUDIES IN FORM</span><span>001</span></p>
        </section>
      </div>
    </div>
    <Material />
    <CampaignEnding />
    </main>
  )
}
