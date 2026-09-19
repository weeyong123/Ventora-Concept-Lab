import { useEffect, useRef } from 'react'
import './Demo9.css'
import useDemo9Pointer from './useDemo9Pointer'

const ASSETS = '/demo9/demo09-'
// Intro / threshold shortened 35%; the 750vh film mapping stays unchanged.
// A concise 175vh closing hold, 30% shorter than the previous ending.
const FILM_START = 1.625
const FILM_DISTANCE = 7.5
const HOLD_DISTANCE = 1.75
const FILM_END = FILM_START + FILM_DISTANCE
const clamp = (value) => Math.max(0, Math.min(1, value))
const ease = (value) => { const t = clamp(value); return t * t * (3 - 2 * t) }
const windowOpacity = (time, start, end) => ease((time - start) / .24) * ease((end - time) / .24)

export default function Demo9() {
  const root = useRef(null)
  const video = useRef(null)
  useDemo9Pointer(root, FILM_START)

  useEffect(() => {
    const page = root.current
    const media = video.current
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const intro = page.querySelector('.d9-intro')
    const portal = page.querySelector('.d9-portal')
    const start = page.querySelector('.d9-start')
    const end = page.querySelector('.d9-end')
    const final = page.querySelector('.d9-final')
    const closingParts = [...final.children]
    const actions = final.querySelector('.d9-actions')
    const moments = [...page.querySelectorAll('.d9-moment')]
    const words = [...page.querySelectorAll('.d9-values span')]
    const lines = [...page.querySelectorAll('.d9-intro h1 > span')]
    const status = page.querySelector('.d9-position')
    let frame = 0
    let desiredTime = 0
    let decoded = false
    let decodedTime = 0
    let failed = false
    let disposed = false
    const oldTitle = document.title
    document.title = 'Enter the world — Ventora / 09'

    // Coalesce scroll events into one paint. Only seek again once the decoder is
    // free; a fast wheel gesture always resolves to its latest absolute target.
    // No play(), autoplay, interpolation clock, or time-driven animation.
    const requestRender = () => {
      if (!frame && !disposed) frame = requestAnimationFrame(render)
    }
    const seek = () => {
      if (motion.matches || failed || !Number.isFinite(media.duration) || media.seeking) return
      const target = Math.min(desiredTime, Math.max(0, media.duration - .001))
      if (Math.abs(media.currentTime - target) > .012) media.currentTime = target
    }
    function render() {
      frame = 0
      const reduced = motion.matches
      const distance = Math.max(0, -page.getBoundingClientRect().top / window.innerHeight)
      const progress = clamp((distance - FILM_START) / FILM_DISTANCE)
      desiredTime = progress * (Number.isFinite(media.duration) ? media.duration : 10)
      page.dataset.reduced = String(reduced)
      page.style.setProperty('--d9-progress', clamp(distance / (FILM_START + FILM_DISTANCE + HOLD_DISTANCE)))
      if (reduced) {
        intro.style.opacity = ''
        intro.inert = false
        final.style.opacity = ''
        final.inert = false
        actions.inert = false
        closingParts.forEach((part) => { part.style.opacity = ''; part.style.transform = '' })
        media.pause()
        return
      }
      const departure = ease(distance / .75)
      const approach = clamp((distance - .36) / (FILM_START - .36))
      const opening = ease(approach)
      const depth = 1 - ease((distance - .2) / (FILM_START - .2))
      intro.style.opacity = 1 - departure
      intro.inert = departure > .98
      lines.forEach((line, index) => {
        line.style.transform = `translate3d(${(index - 1) * departure * 95}px, ${(index - 1) * departure * 35}px, ${departure * (index === 1 ? 100 : -70)}px)`
        line.style.letterSpacing = `${-.065 + departure * .055}em`
      })
      // The aperture recedes independently of the very small image-plane motion.
      // Perspective and the bevel both resolve exactly to zero at the film seam.
      const side = (1 - opening) * 48.7
      const top = (1 - ease(Math.min(1, approach * 1.12))) * 27
      const bevel = (1 - opening) * .8
      portal.style.clipPath = `polygon(${side}% ${top}%, ${100 - side}% ${top + bevel}%, ${100 - side}% ${100 - top - bevel}%, ${side}% ${100 - top}%)`
      portal.style.opacity = ease((distance - .14) / .325)
      portal.style.setProperty('--d9-edge', (1 - opening) * .3)
      start.style.transform = `perspective(1400px) translateZ(${-depth * 35}px) rotateY(${depth * .8}deg) scale(${1 + depth * .065})`
      start.style.filter = `blur(${depth * 2.5}px)`
      // Identical object-fit geometry for both stills and the video. Blend only
      // at the boundary, and never expose an undecoded video frame.
      const time = decoded && !failed ? decodedTime : 0
      start.style.opacity = 1 - (decoded && !failed ? ease(time / .16) : 0)
      const endBlend = failed ? ease((distance - FILM_END) / .25) : ease((time - (media.duration - .085)) / .08)
      end.style.opacity = Number.isFinite(endBlend) ? endBlend : 0
      const filmVisible = distance >= FILM_START && distance < FILM_END
      // Borrow a little of the existing quiet space for reading, without
      // extending the scroll track or overlapping adjacent statements.
      const ranges = [[1.5, 3.4], [3.5, 5.9], [6, 7.35], [7.6, 8.82], [8.86, 10.04]]
      let textPresence = 0
      moments.forEach((element, index) => {
        const opacity = filmVisible ? windowOpacity(time, ...ranges[index]) : 0
        textPresence = Math.max(textPresence, opacity)
        element.style.opacity = opacity
        element.style.transform = `translateY(${(1 - opacity) * 14}px)`
        element.setAttribute('aria-hidden', opacity < .1 ? 'true' : 'false')
      })
      words.forEach((word, index) => {
        const reveal = ease((time - 8.86 - index * .32) / .23)
        word.style.opacity = reveal
        word.style.transform = `translateY(${(1 - reveal) * 9}px)`
        word.setAttribute('aria-hidden', reveal < .1 ? 'true' : 'false')
      })
      const hold = distance - FILM_END
      const closingReady = failed || endBlend > .99 ? 1 : 0
      const arrival = ease((hold - .08) / .36) * closingReady
      const supporting = ease((hold - .38) / .3) * closingReady
      const invitation = ease((hold - .7) / .3) * closingReady
      final.style.opacity = 1
      // Scroll-led closing cadence: statement, rationale, then invitation.
      // Every part settles before the last 75vh of the seated-frame hold.
      closingParts.forEach((part, index) => {
        const reveal = index < 2 ? arrival : index < 4 ? supporting : invitation
        part.style.opacity = reveal
        part.style.transform = `translateY(${(1 - reveal) * (index < 2 ? 12 : 8)}px)`
      })
      final.inert = arrival < .1
      actions.inert = invitation < .95
      page.style.setProperty('--d9-shade', Math.max(textPresence, arrival))
      status.textContent = distance < .45 ? 'SCROLL TO ENTER' : distance < FILM_START ? '01 / THE THRESHOLD' : distance < FILM_END ? '02 / ENTER THE WORLD' : '03 / PRESENCE'
      seek()
    }
    const ready = () => { decoded = true; decodedTime = media.currentTime; requestRender() }
    const error = () => { failed = true; page.dataset.mediaError = 'true'; requestRender() }
    const pause = () => media.pause()
    media.addEventListener('loadeddata', ready)
    media.addEventListener('loadedmetadata', requestRender)
    media.addEventListener('seeked', ready)
    media.addEventListener('error', error)
    media.addEventListener('play', pause)
    window.addEventListener('scroll', requestRender, { passive: true })
    window.addEventListener('resize', requestRender)
    motion.addEventListener('change', requestRender)
    if (media.readyState >= 2) { decoded = true; decodedTime = media.currentTime }
    requestRender()
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      media.pause()
      media.removeEventListener('loadeddata', ready)
      media.removeEventListener('loadedmetadata', requestRender)
      media.removeEventListener('seeked', ready)
      media.removeEventListener('error', error)
      media.removeEventListener('play', pause)
      window.removeEventListener('scroll', requestRender)
      window.removeEventListener('resize', requestRender)
      motion.removeEventListener('change', requestRender)
      document.title = oldTitle
    }
  }, [])

  const explore = () => window.scrollTo({ top: root.current.offsetTop + window.innerHeight * FILM_START, behavior: 'instant' })
  const about = (event) => {
    event.preventDefault()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.current.querySelector('.d9-final').scrollIntoView()
      return
    }
    window.scrollTo({ top: root.current.offsetTop + window.innerHeight * (FILM_END + 1.1), behavior: 'instant' })
  }

  return <main className="d9-film" style={{ '--d9-height': `${(1 + FILM_END + HOLD_DISTANCE) * 100}vh` }} ref={root} aria-label="Ventora — Enter the world">
    <div className="d9-stage">
      <div className="d9-portal" aria-hidden="true">
        <video ref={video} className="d9-video" src={`${ASSETS}main.mp4`} poster={`${ASSETS}start.png`} preload="auto" muted playsInline disablePictureInPicture tabIndex={-1} />
        <img className="d9-start" src={`${ASSETS}start.png`} alt="" fetchPriority="high" />
        <img className="d9-end" src={`${ASSETS}end.png`} alt="" />
      </div>
      <div className="d9-local-shade" aria-hidden="true" />
      <header className="d9-nav">
        <a className="d9-brand" href="/">VENTORA<span>®</span></a>
        <span className="d9-edition">09 / ENTER THE WORLD</span>
        <nav aria-label="Main navigation"><a href="/">WORK</a><a href="#d9-presence" onClick={about}>ABOUT</a><a href="/#contact">CONTACT</a></nav>
      </header>
      <section className="d9-intro">
        <p className="d9-eyebrow">VENTORA / MOTION STUDIES 09</p>
        <h1 aria-label="Ideas need a world to live in."><span>IDEAS NEED</span><span>A <em>WORLD</em></span><span>TO LIVE IN.</span></h1>
        <div className="d9-intro-foot"><span>ENTER THE WORLD</span><button onClick={explore}>EXPLORE <span aria-hidden="true">↓</span></button><span>A STUDY IN PRESENCE</span></div>
      </section>
      <div className="d9-moments">
        <section className="d9-moment"><p className="d9-eyebrow">01 / ARRIVAL</p><h2>ENTER<br /><em>THE WORLD.</em></h2><p>Where ideas become experiences.</p></section>
        <section className="d9-moment"><p className="d9-eyebrow">02 / INTENTION</p><h2>DESIGN.<br />DIRECTION.<br /><em>PRESENCE.</em></h2><p>Websites / Funnels /<br />Brand Experiences</p></section>
        <section className="d9-moment"><h2>NOT JUST<br />TO <em>LOOK GOOD.</em></h2></section>
        <section className="d9-moment"><h2>BUILT TO MOVE<br /><em>PEOPLE</em><br />FORWARD.</h2></section>
        <section className="d9-moment d9-values"><p className="d9-eyebrow">03 / IMPACT</p><h2><span>CLARITY.</span><span>TRUST.</span><span><em>CONVERSION.</em></span></h2></section>
      </div>
      <section className="d9-final" id="d9-presence" aria-label="Make your presence felt">
        <p className="d9-eyebrow">THE NEXT CHAPTER IS YOURS</p>
        <h2>MAKE YOUR<br /><em>PRESENCE</em><br />FELT.</h2>
        <p className="d9-signature">Ventora Digital</p>
        <p className="d9-description">A presence that earns attention, inspires trust, and moves people to act.</p>
        <div className="d9-actions"><a href="/"><span className="d9-cta-label">VIEW THE WORK</span><span aria-hidden="true">→</span></a><a href="/#contact"><span className="d9-cta-label">START A PROJECT</span><span aria-hidden="true">→</span></a></div>
      </section>
      <p className="d9-media-error" role="status">The film couldn’t load. Continue scrolling to the final frame.</p>
      <footer className="d9-footer"><span>VENTORA DIGITAL</span><span className="d9-position">SCROLL TO ENTER</span><span>MOTION STUDY / 2026</span></footer>
      <div className="d9-progress" aria-hidden="true" />
    </div>
    <div className="d9-cursor" aria-hidden="true"><i /><b /></div>
  </main>
}
