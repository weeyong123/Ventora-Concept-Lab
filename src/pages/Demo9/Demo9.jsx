import { useEffect, useRef } from 'react'
import './Demo9.css'
import useDemo9Pointer from './useDemo9Pointer'
import { createVideoSeekGate } from './videoSeekGate'
import { masterProgress, scrollProgress, smoothProgress, FILM_START, FILM_DISTANCE, HOLD_DISTANCE, FILM_END, TIMELINE_DISTANCE } from './filmProgress'
import { createMobilePlayback } from './mobilePlayback'
import { createRecordingPlayback } from './recordingPlayback'

const ASSETS = '/demo9/demo09-'
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
    const touch = window.matchMedia('(pointer: coarse)')
    const stage = page.querySelector('.d9-stage')
    const progressBar = page.querySelector('.d9-progress')
    const shade = page.querySelector('.d9-local-shade')
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
    // Cache geometry outside the scroll hot path and skip unchanged DOM writes.
    let viewportHeight = stage.clientHeight || window.innerHeight
    let pageTop = window.scrollY + page.getBoundingClientRect().top
    let viewportWidth = window.innerWidth
    let viewportTouch = touch.matches
    const styles = new WeakMap()
    const style = (element, key, value) => {
      let previous = styles.get(element)
      if (!previous) { previous = {}; styles.set(element, previous) }
      const next = String(value)
      if (previous[key] === next) return
      previous[key] = next
      if (key.startsWith('--')) element.style.setProperty(key, next)
      else element.style[key] = next
    }
    const inert = (element, value) => { if (element.inert !== value) element.inert = value }
    const aria = (element, value) => { if (element.getAttribute('aria-hidden') !== value) element.setAttribute('aria-hidden', value) }
    const gate = createVideoSeekGate()
    let seekTimer = 0
    let settleTimer = 0
    let settled = true
    let lastPortalDistance = -1
    let frame = 0
    let inputProgress = clamp((window.scrollY - pageTop) / (viewportHeight * TIMELINE_DISTANCE))
    let lastRenderTime = 0
    let interpolating = false
    let desiredTime = 0
    let decoded = false
    let decodedTime = 0
    let failed = false
    let disposed = false
    const oldTitle = document.title
    document.title = 'Enter the world — Ventora / 09'

    // Coalesce scroll events into one paint. Only seek again once the decoder is
    // free; a fast wheel gesture always resolves to its latest absolute target.
    // One rAF input smoother feeds every visual track; video never plays itself.
    const requestRender = () => {
      if (!frame && !disposed) frame = requestAnimationFrame(render)
    }
    const mobilePlayback = createMobilePlayback(media, requestRender)
    const unlockMobile = () => {
      if (touch.matches && !motion.matches && !document.hidden) mobilePlayback.unlock()
    }
    const seek = (now) => {
      clearTimeout(seekTimer)
      if (motion.matches || failed || document.hidden) return
      if (touch.matches) { mobilePlayback.update(desiredTime); return }
      const plan = gate.plan({ target: desiredTime, duration: media.duration,
        currentTime: media.currentTime, seeking: media.seeking, readyState: media.readyState,
        now, touch: touch.matches, settled: settled && !interpolating })
      if (!plan) return
      if (plan.wait > 0) {
        seekTimer = window.setTimeout(requestRender, plan.wait)
        return
      }
      media.currentTime = plan.time
      gate.didWrite(now)
    }
    function render(now) {
      frame = 0
      if (document.hidden) return
      const reduced = motion.matches
      const targetProgress = clamp((window.scrollY - pageTop) / (viewportHeight * TIMELINE_DISTANCE))
      inputProgress = smoothProgress(inputProgress, targetProgress, lastRenderTime ? now - lastRenderTime : 16, touch.matches || reduced)
      lastRenderTime = now
      interpolating = inputProgress !== targetProgress
      const master = masterProgress(inputProgress)
      const distance = master * TIMELINE_DISTANCE
      const progress = clamp((distance - FILM_START) / FILM_DISTANCE)
      if (interpolating && !reduced) requestRender()
      desiredTime = progress * (Number.isFinite(media.duration) ? media.duration : 10)
      if (page.dataset.reduced !== String(reduced)) page.dataset.reduced = String(reduced)
      style(progressBar, 'transform', `scaleX(${master})`)
      if (reduced) {
        lastPortalDistance = -1
        style(intro, 'opacity', '')
        inert(intro, false)
        style(final, 'opacity', '')
        inert(final, false)
        inert(actions, false)
        closingParts.forEach((part) => { style(part, 'opacity', ''); style(part, 'transform', '') })
        media.pause()
        return
      }
      const portalDistance = Math.min(distance, FILM_START)
      if (portalDistance !== lastPortalDistance) {
        lastPortalDistance = portalDistance
        const departure = ease(distance / .75)
        const approach = clamp((distance - .36) / (FILM_START - .36))
        const opening = ease(approach)
        const depth = 1 - ease((distance - .2) / (FILM_START - .2))
        style(intro, 'opacity', 1 - departure)
        inert(intro, departure > .98)
        lines.forEach((line, index) => {
          style(line, 'transform', `translate3d(${(index - 1) * departure * 95}px, ${(index - 1) * departure * 35}px, ${departure * (index === 1 ? 100 : -70)}px) scaleX(${1 + departure * .08})`)
        })
        // The aperture recedes independently of the very small image-plane motion.
        // Perspective and the bevel both resolve exactly to zero at the film seam.
        const side = (1 - opening) * 48.7
        const top = (1 - ease(Math.min(1, approach * 1.12))) * 27
        const bevel = (1 - opening) * .8
        style(portal, 'clipPath', opening === 1 ? 'none' : `polygon(${side}% ${top}%, ${100 - side}% ${top + bevel}%, ${100 - side}% ${100 - top - bevel}%, ${side}% ${100 - top}%)`)
        style(portal, 'opacity', ease((distance - .14) / .325))
        style(portal, '--d9-edge', (1 - opening) * .3)
        style(start, 'transform', `perspective(1400px) translateZ(${-depth * 35}px) rotateY(${depth * .8}deg) scale(${1 + depth * .065})`)
        // Finish sharpening while the aperture is still small, and release the
        // filter entirely before the image covers the viewport.
        style(start, 'filter', opening < .65 ? `blur(${depth * 2.5 * (1 - ease(opening / .65))}px)` : 'none')
        style(portal, 'willChange', distance < FILM_START ? 'clip-path' : 'auto')
        lines.forEach((line) => style(line, 'willChange', departure < 1 ? 'transform, opacity' : 'auto'))
      }
      // Identical object-fit geometry for both stills and the video. Blend only
      // at the boundary, and never expose an undecoded video frame.
      const visibleTime = decoded && !failed ? (touch.matches ? media.currentTime : decodedTime) : 0
      const time = touch.matches ? visibleTime : desiredTime
      style(start, 'opacity', 1 - (decoded && !failed ? ease(visibleTime / .16) : 0))
      style(start, 'visibility', visibleTime >= .16 && !failed ? 'hidden' : 'visible')
      const endBlend = failed ? ease((distance - FILM_END) / .25) : ease((visibleTime - (media.duration - .085)) / .08)
      style(end, 'opacity', Number.isFinite(endBlend) ? endBlend : 0)
      const filmVisible = distance >= FILM_START && (touch.matches ? visibleTime < media.duration - .025 : distance < FILM_END)
      // Borrow a little of the existing quiet space for reading, without
      // extending the scroll track or overlapping adjacent statements.
      const ranges = [[1.5, 3.4], [3.5, 5.9], [6, 7.35], [7.6, 8.82], [8.86, 10.04]]
      let textPresence = 0
      moments.forEach((element, index) => {
        const opacity = filmVisible ? windowOpacity(time, ...ranges[index]) : 0
        textPresence = Math.max(textPresence, opacity)
        style(element, 'opacity', opacity)
        style(element, 'transform', `translateY(${(1 - opacity) * 14}px)`)
        aria(element, opacity < .1 ? 'true' : 'false')
      })
      words.forEach((word, index) => {
        const reveal = ease((time - 8.86 - index * .32) / .23)
        style(word, 'opacity', reveal)
        style(word, 'transform', `translateY(${(1 - reveal) * 9}px)`)
        aria(word, reveal < .1 ? 'true' : 'false')
      })
      const hold = distance - FILM_END
      const closingReady = failed || endBlend > .99 ? 1 : 0
      const arrival = ease((hold - .08) / .36) * closingReady
      const supporting = ease((hold - .38) / .3) * closingReady
      const invitation = ease((hold - .7) / .3) * closingReady
      style(final, 'opacity', 1)
      // Scroll-led closing cadence: statement, rationale, then invitation.
      // Every part settles before the last 35vh of the seated-frame hold.
      closingParts.forEach((part, index) => {
        const reveal = index < 2 ? arrival : index < 4 ? supporting : invitation
        style(part, 'opacity', reveal)
        style(part, 'transform', `translateY(${(1 - reveal) * (index < 2 ? 12 : 8)}px)`)
      })
      inert(final, arrival < .1)
      inert(actions, invitation < .95)
      style(shade, 'opacity', Math.max(textPresence, arrival))
      const statusText = distance < .45 ? 'SCROLL TO ENTER' : distance < FILM_START ? '01 / THE THRESHOLD' : distance < FILM_END ? '02 / ENTER THE WORLD' : '03 / PRESENCE'
      if (status.textContent !== statusText) status.textContent = statusText
      seek(now)
    }
    const finishScroll = () => {
      clearTimeout(settleTimer)
      settled = true
      requestRender()
    }
    const scroll = () => {
      settled = false
      clearTimeout(settleTimer)
      settleTimer = window.setTimeout(finishScroll, 140)
      requestRender()
    }
    const resize = () => {
      // On touch, 100svh is stable as Safari's address bar opens/closes.
      if (!touch.matches || viewportTouch !== touch.matches || viewportWidth !== window.innerWidth) {
        viewportWidth = window.innerWidth
        viewportTouch = touch.matches
        viewportHeight = stage.clientHeight || window.innerHeight
        pageTop = window.scrollY + page.getBoundingClientRect().top
      }
      requestRender()
    }
    const preferenceChanged = () => {
      viewportHeight = stage.clientHeight || window.innerHeight
      pageTop = window.scrollY + page.getBoundingClientRect().top
      lastPortalDistance = -1
      clearTimeout(seekTimer)
      lastRenderTime = 0
      requestRender()
    }
    const visibility = () => {
      clearTimeout(seekTimer)
      clearTimeout(settleTimer)
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; media.pause() }
      else { settled = true; lastRenderTime = 0; resize() }
    }
    const ready = () => { decoded = true; decodedTime = media.currentTime; requestRender() }
    const error = () => { failed = true; page.dataset.mediaError = 'true'; requestRender() }
    const pause = () => { if (!touch.matches || motion.matches) media.pause() }
    // Opt-in presentation advances actual scroll position, never wheel events
    // or video playback. Geometry is shared with the existing cached renderer.
    let recording = null
    const recordMode = new URLSearchParams(window.location.search).get('record') === '1'
    if (recordMode) {
      recording = createRecordingPlayback({
        requestFrame: (callback) => requestAnimationFrame(callback),
        cancelFrame: (id) => cancelAnimationFrame(id),
        read: () => (window.scrollY - pageTop) / viewportHeight,
        write: (distance) => {
          window.scrollTo({ top: pageTop + distance * viewportHeight, behavior: 'instant' })
          requestRender()
        },
        // Recording supplies input only; all five holds belong to the master.
        speed: () => .36,
        end: FILM_END + HOLD_DISTANCE,
        stateChanged: (state) => { page.dataset.recording = state },
      })
      page.dataset.recording = 'ready'
    }
    const recordWheel = (event) => {
      if (!recording || ['manual', 'finished'].includes(recording.state)) return
      event.preventDefault()
      if (recording.state === 'ready') recording.start()
    }
    const recordClick = (event) => {
      if (event.target.closest('a, button, input, textarea, select')) return
      if (recording?.state === 'ready') recording.start()
    }
    const recordKey = (event) => {
      if (!recording || event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.target.closest('input, textarea, select, [contenteditable="true"]')) return
      if (event.code === 'Escape') { recording.exit(); return }
      if (event.code === 'KeyR') { event.preventDefault(); recording.restart(); return }
      if (event.code === 'Space' && recording.state !== 'manual') { event.preventDefault(); recording.toggle() }
    }
    const recordScroll = () => { if (recording?.state === 'ready') recording.start() }
    const recordVisibility = () => { if (document.hidden) recording?.pause() }
    if (recording) {
      window.addEventListener('wheel', recordWheel, { passive: false })
      page.addEventListener('click', recordClick)
      window.addEventListener('keydown', recordKey)
      window.addEventListener('scroll', recordScroll, { passive: true })
      document.addEventListener('visibilitychange', recordVisibility)
    }
    page.addEventListener('touchstart', unlockMobile, { passive: true })
    page.addEventListener('pointerdown', unlockMobile, { passive: true })
    page.addEventListener('click', unlockMobile)
    window.addEventListener('scroll', unlockMobile, { passive: true })
    media.addEventListener('timeupdate', ready)
    media.addEventListener('playing', ready)
    media.addEventListener('loadeddata', ready)
    media.addEventListener('loadedmetadata', requestRender)
    media.addEventListener('seeked', ready)
    media.addEventListener('error', error)
    media.addEventListener('play', pause)
    window.addEventListener('scroll', scroll, { passive: true })
    window.addEventListener('scrollend', finishScroll)
    document.addEventListener('visibilitychange', visibility)
    touch.addEventListener('change', resize)
    window.addEventListener('resize', resize)
    motion.addEventListener('change', preferenceChanged)
    if (media.readyState >= 2) { decoded = true; decodedTime = media.currentTime }
    requestRender()
    return () => {
      mobilePlayback.dispose()
      page.removeEventListener('touchstart', unlockMobile)
      page.removeEventListener('pointerdown', unlockMobile)
      page.removeEventListener('click', unlockMobile)
      window.removeEventListener('scroll', unlockMobile)
      media.removeEventListener('timeupdate', ready)
      media.removeEventListener('playing', ready)
      recording?.dispose()
      delete page.dataset.recording
      window.removeEventListener('wheel', recordWheel)
      page.removeEventListener('click', recordClick)
      window.removeEventListener('keydown', recordKey)
      window.removeEventListener('scroll', recordScroll)
      document.removeEventListener('visibilitychange', recordVisibility)
      disposed = true
      cancelAnimationFrame(frame)
      clearTimeout(seekTimer)
      clearTimeout(settleTimer)
      media.pause()
      media.removeEventListener('loadeddata', ready)
      media.removeEventListener('loadedmetadata', requestRender)
      media.removeEventListener('seeked', ready)
      media.removeEventListener('error', error)
      media.removeEventListener('play', pause)
      window.removeEventListener('scroll', scroll)
      window.removeEventListener('scrollend', finishScroll)
      document.removeEventListener('visibilitychange', visibility)
      touch.removeEventListener('change', resize)
      window.removeEventListener('resize', resize)
      motion.removeEventListener('change', preferenceChanged)
      document.title = oldTitle
    }
  }, [])

  const explore = () => window.scrollTo({ top: root.current.offsetTop + root.current.querySelector('.d9-stage').clientHeight * TIMELINE_DISTANCE * scrollProgress(FILM_START / TIMELINE_DISTANCE), behavior: 'instant' })
  const about = (event) => {
    event.preventDefault()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.current.querySelector('.d9-final').scrollIntoView()
      return
    }
    window.scrollTo({ top: root.current.offsetTop + root.current.querySelector('.d9-stage').clientHeight * TIMELINE_DISTANCE * scrollProgress((FILM_END + 1.1) / TIMELINE_DISTANCE), behavior: 'instant' })
  }

  return <main className="d9-film" style={{ '--d9-length': (1 + FILM_END + HOLD_DISTANCE) * 100 }} ref={root} aria-label="Ventora — Enter the world">
    <div className="d9-stage">
      <div className="d9-portal" aria-hidden="true">
        <video ref={video} className="d9-video" src={`${ASSETS}main-scrub.mp4`} poster={`${ASSETS}start.png`} preload="auto" muted playsInline disablePictureInPicture tabIndex={-1} />
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
