import { useEffect, useRef, useState } from 'react'
import './Demo11.css'
import HeroRotation from './HeroRotation'


function ExplodedInteraction() {
  const video = useRef(null)
  const filmRegion = useRef(null)
  const scrollTrack = useRef(null)
  const editorialText = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [manualPlayback, setManualPlayback] = useState(false)
  const [mobileDebug, setMobileDebug] = useState('initializing…')

  useEffect(() => {
    const film = video.current
    const region = filmRegion.current
    const track = scrollTrack.current
    // Text follows decoded frames only; it never drives playback or layout.
    const syncEditorialText = () => {
      if (film.seeking || film.readyState < 2 || !Number.isFinite(film.duration)) return
      const progress = film.currentTime / Math.max(0.001, film.duration - 0.08)
      // The final phrase enters only near full disassembly and remains
      // visible on the final frame during the short end hold.
      const windows = [[0.25, 0.45], [0.82, 1.08]]
      Array.from(editorialText.current.children).forEach((phrase, index) => {
        const [start, end] = windows[index]
        const ramp = Math.max(0, Math.min(1, (progress - start) / 0.04, (end - progress) / 0.04))
        const opacity = ramp * ramp * (3 - 2 * ramp)
        phrase.style.setProperty('--d11-phrase-opacity', opacity)
        phrase.style.setProperty('--d11-phrase-offset', `${(1 - opacity) * 8}px`)
        phrase.setAttribute('aria-hidden', opacity === 0 ? 'true' : 'false')
      })
    }
    const compact = window.matchMedia('(max-width: 760px), (max-width: 1024px) and (pointer: coarse)')
    const fallback = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarse = window.matchMedia('(pointer: coarse)')
    const updateMobileDebug = (reason = 'update') => {
      setMobileDebug(
        `reason:${reason} | width:${window.innerWidth} | compact:${compact.matches} | coarse:${coarse.matches} | reduced:${fallback.matches} | manual:${manual} | seekFailed:${seekFailed}`
      )
    }
    // Compact touch layouts can scrub; retain the existing wide-screen fallback.
    const needsManual = () => !compact.matches && (fallback.matches || coarse.matches)
    let manual = needsManual()
    let compactViewport = window.innerHeight
    let compactWidth = window.innerWidth
    let frame = 0
    let seekTimer = 0
    let targetTime = 0
    let disposed = false
    let seekFailed = false

    const useManualPlayback = () => {
      manual = true
      film.pause()
      window.clearTimeout(seekTimer)
      cancelAnimationFrame(frame)
      frame = 0
      track.style.removeProperty('height')
      setManualPlayback(true)
      updateMobileDebug('manual-fallback')
    }

    const seek = () => {
      frame = 0
      if (disposed || manual || document.hidden || film.readyState < 2 || film.seeking) return
      if (targetTime === 0 ? film.currentTime === 0 : Math.abs(film.currentTime - targetTime) < 1 / 60) return
      // One exact seek at a time; seeked picks up the latest scroll position.
      // This avoids piling up decoder work during fast or reverse scrolling.
      try {
        film.currentTime = targetTime
        window.clearTimeout(seekTimer)
        seekTimer = window.setTimeout(() => {
          // Mobile Safari can take longer to decode an arbitrary seek.
          // Keep compact layouts in scroll-scrub mode instead of exposing PLAY.
          if (compact.matches) {
            scheduleSeek()
            return
          }
          seekFailed = true
          useManualPlayback()
        }, 4000)
      } catch {
        // Do not expose the manual PLAY fallback on compact/mobile layouts.
        // A transient Safari seek failure should leave the section scroll-driven.
        if (compact.matches) {
          window.clearTimeout(seekTimer)
          return
        }
        seekFailed = true
        useManualPlayback()
      }
    }

    const scheduleSeek = () => {
      if (!frame && !manual && !disposed) frame = requestAnimationFrame(seek)
    }
    const updateProgress = () => {
      // iPhone browser chrome changes height during a gesture. Keep mobile
      // scroll geometry stable until width/orientation changes.
      if (compactWidth !== window.innerWidth) {
        compactWidth = window.innerWidth
        compactViewport = window.innerHeight
      }
      updateMobileDebug('progress')
      const viewport = compact.matches ? compactViewport : window.innerHeight
      const margin = parseFloat(getComputedStyle(region).marginTop) || 0
      const visualHeight = region.offsetHeight
      // Trim the extra viewport travel from 0.6 to 0.2; retain linear seeking.
      const desktopDistance = (visualHeight + viewport * 0.2) * 1.8 * 2.7
      // 2.2 viewports is ~45% less than the previous phone scrub range.
      const distance = compact.matches ? viewport * 1.35 : desktopDistance
      // Real track height (not bottom padding) gives sticky a containing block
      // for the entire scrub. Keep the visual centered while the track scrolls.
      const stickyTop = compact.matches ? 24 : Math.max(0, (viewport - visualHeight) / 2)
      track.style.setProperty('--d11-sticky-top', `${stickyTop}px`)
      if (manual) {
        track.style.removeProperty('height')
        return
      }
      // Keep a brief final-frame viewing moment, reduced from 0.35 viewport.
      const endHold = viewport * (compact.matches ? 0 : 0.2)
      const trackHeight = compact.matches ? visualHeight + distance * 0.55 : margin + visualHeight + distance + endHold
      track.style.height = `${trackHeight}px`
      if (!Number.isFinite(film.duration) || film.duration <= 0) return
      const start = track.getBoundingClientRect().top + margin
      const progress = Math.min(1, Math.max(0, (stickyTop - start) / distance))
      // Linear, position-only mapping: no stage timing or animation after scroll.
      // Stay inside the last decodable frame rather than seeking to the media end.
      targetTime = progress * Math.max(0, film.duration - 0.08)
      scheduleSeek()
    }
    const initializeFirstFrame = () => {
      // Decode the same video at its exact beginning; no poster or media swap.
      film.pause()
      film.currentTime = 0
      updateProgress()
    }
    const onSeeked = () => {
      window.clearTimeout(seekTimer)
      syncEditorialText()
      scheduleSeek()
    }
    const onPreferenceChange = () => {
      film.pause()
      manual = needsManual() || (seekFailed && !compact.matches)
      setManualPlayback(manual)
      if (manual) {
        cancelAnimationFrame(frame)
        frame = 0
        window.clearTimeout(seekTimer)
      }
      updateProgress()
    }
    const onVisibilityChange = () => {
      if (document.hidden) {
        film.pause()
        window.clearTimeout(seekTimer)
      } else updateProgress()
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) film.pause()
    })
    observer.observe(region)
    film.pause()
    setManualPlayback(manual)
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    film.addEventListener('loadedmetadata', initializeFirstFrame)
    film.addEventListener('loadeddata', updateProgress)
    film.addEventListener('canplay', updateProgress)
    film.addEventListener('seeked', onSeeked)
    film.addEventListener('loadeddata', syncEditorialText)
    film.addEventListener('timeupdate', syncEditorialText)
    fallback.addEventListener('change', onPreferenceChange)
    compact.addEventListener('change', onPreferenceChange)
    coarse.addEventListener('change', onPreferenceChange)
    document.addEventListener('visibilitychange', onVisibilityChange)
    if (film.readyState >= 1) initializeFirstFrame()
    else updateProgress()
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      window.clearTimeout(seekTimer)
      observer.disconnect()
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
      film.removeEventListener('loadedmetadata', initializeFirstFrame)
      film.removeEventListener('loadeddata', updateProgress)
      film.removeEventListener('canplay', updateProgress)
      film.removeEventListener('seeked', onSeeked)
      film.removeEventListener('loadeddata', syncEditorialText)
      film.removeEventListener('timeupdate', syncEditorialText)
      fallback.removeEventListener('change', onPreferenceChange)
      compact.removeEventListener('change', onPreferenceChange)
      coarse.removeEventListener('change', onPreferenceChange)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      film.pause()
    }
  }, [])

  const togglePlayback = () => {
    if (!manualPlayback) return
    const film = video.current
    if (film.paused) film.play().catch(() => setPlaying(false))
    else film.pause()
  }

  return (
    <section className="d11-exploded" aria-labelledby="d11-exploded-title">
      <div style={{
        position: 'relative', zIndex: 20, margin: '0 7vw 12px', padding: '8px 10px',
        background: '#fff', color: '#000', fontSize: '11px', lineHeight: 1.45,
        fontFamily: 'monospace', overflowWrap: 'anywhere'
      }}>
        MOBILE DEBUG — {mobileDebug}
      </div>
      <div className="d11-exploded-heading">
        <p className="d11-exploded-index">01 / THE ANATOMY OF H1</p>
        <h2 id="d11-exploded-title">PRECISION,<br /><span>LAYER BY LAYER.</span></h2>
        <p className="d11-exploded-intro">A closer look at what brings it all together.<br />Every surface. Every connection. Every layer.</p>
      </div>
      <div className={`d11-scrub-track${manualPlayback ? ' d11-scrub-track--manual' : ''}`} ref={scrollTrack}>
      <figure className="d11-exploded-film" ref={filmRegion}>
        <div className="d11-exploded-media">
          <video ref={video} muted playsInline preload="auto"
            aria-label="Exploded view of the ORBITA H1 headphones, revealing the individual layers and components"
            onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}>
            <source src="/demo11/demo11-exploded.mp4" type="video/mp4" />
          </video>
          <div className="d11-editorial-overlays" ref={editorialText}>
            <p className="d11-editorial-phrase" aria-hidden="true">DESIGNED FROM<br />THE INSIDE OUT.</p>
            <p className="d11-editorial-phrase" aria-hidden="true">EVERY LAYER<br />HAS A PURPOSE.</p>
          </div>
        </div>
        <figcaption>
          <span>H1 / AN EXPLODED STUDY</span>
          {manualPlayback ? (
            <button type="button" onClick={togglePlayback} aria-label={playing ? 'Pause exploded view' : 'Play exploded view'}>
              {playing ? 'PAUSE' : 'PLAY'} <span aria-hidden="true">{playing ? 'Ⅱ' : '↗'}</span>
            </button>
          ) : <span className="d11-scrub-cue">SCROLL TO EXPLORE <span aria-hidden="true">↕</span></span>}
        </figcaption>
      </figure>
      </div>
    </section>
  )
}

function MaterialCraftsmanship() {
  const section = useRef(null)
  const detail = useRef(null)

  useEffect(() => {
    const surface = section.current
    const image = detail.current
    const motion = window.matchMedia('(prefers-reduced-motion: no-preference) and (pointer: fine)')
    surface.classList.add('d11-craft--ready')
    const reveal = () => {
      if (visible && image.complete && image.naturalWidth > 0) surface.classList.add('d11-craft--visible')
    }
    let visible = false
    let frame = 0
    const update = () => {
      frame = 0
      if (!motion.matches || !visible) return
      const bounds = surface.getBoundingClientRect()
      const progress = Math.min(1, Math.max(0,
        (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)))
      image.style.transform = `translateY(${(progress - 0.5) * -18}px) scale(${1.04 - progress * 0.015})`
    }
    const schedule = () => {
      if (!frame && visible && motion.matches) frame = requestAnimationFrame(update)
    }
    const reset = () => {
      cancelAnimationFrame(frame)
      frame = 0
      image.style.transform = ''
      schedule()
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) { reveal(); schedule() }
      else { cancelAnimationFrame(frame); frame = 0 }
    })
    observer.observe(surface)
    image.addEventListener('load', reveal)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    motion.addEventListener('change', reset)
    return () => {
      observer.disconnect()
      image.removeEventListener('load', reveal)
      surface.classList.remove('d11-craft--ready', 'd11-craft--visible')
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      motion.removeEventListener('change', reset)
    }
  }, [])

  return (
    <section className="d11-craft" ref={section} aria-labelledby="d11-craft-title">

      <div className="d11-craft-image">
        <img ref={detail} src="/demo11/demo11-detail.png"
          alt="Close detail of the H1’s brushed aluminum shell, precision hinge and soft black cushion"
          width="1106" height="1422" loading="lazy" decoding="async" />
      </div>
      <div className="d11-craft-editorial">
        <p className="d11-craft-label">03 / MATERIAL</p>
        <h2 id="d11-craft-title">BUILT TO BE<br /><span>TOUCHED.</span></h2>
        <p className="d11-craft-copy">Brushed metal. Soft-touch leather.<br />Precision in every surface.</p>
      </div>
    </section>
  )
}

export default function Demo11() {
  const viewer = useRef(null)

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'ORBITA H1 — Engineered to be felt'
    return () => { document.title = previousTitle }
  }, [])

  return (
    <main className="d11-page">
      <section className="d11-hero" aria-labelledby="d11-title">
        <div className="d11-masthead">
          <a className="d11-wordmark" href="/demo11" aria-label="Orbita H1 home">ORBITA<span aria-hidden="true">®</span></a>
          <span className="d11-edition">THE H1 EXPERIENCE</span>
          <span className="d11-series">SOUND. IN ITS ELEMENT.</span>
        </div>

        <div className="d11-stage">
          <HeroRotation />
        </div>

        <div className="d11-copy">
          <p className="d11-eyebrow"><span /> ORBITA / H1</p>
          <h1 id="d11-title">ENGINEERED<br /><span>TO BE FELT.</span></h1>
          <p className="d11-description">Precision materials. Immersive sound.<br />Designed around the way you move.</p>
          <button className="d11-explore" type="button" onClick={() => viewer.current.showModal()}>
            EXPLORE H1 <span aria-hidden="true">↗</span>
          </button>
        </div>

        <div className="d11-baseline">
          <span className="d11-category">WIRELESS HEADPHONES <span> / </span> H1</span>
          <span className="d11-scroll">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></span>
          <span className="d11-finish"><i aria-hidden="true" /> CHAMPAGNE / GRAPHITE</span>
        </div>
      </section>

      <ExplodedInteraction />
      <MaterialCraftsmanship />

      <footer className="d11-ending" aria-labelledby="d11-ending-title">
        <p className="d11-ending-name">ORBITA H1</p>
        <h2 id="d11-ending-title">ENGINEERED<br /><span>TO BE FELT.</span></h2>
        <div className="d11-ending-baseline">
          <p>VENTORA CONCEPT LAB — 11</p>
          <a href="/ventora-showreel">EXPLORE NEXT <span aria-hidden="true">↗</span></a>
        </div>
      </footer>

      <dialog className="d11-viewer" ref={viewer} aria-labelledby="d11-viewer-title" onClick={(event) => { if (event.target === event.currentTarget) viewer.current.close() }}>
        <div className="d11-viewer-inner">
          <h2 id="d11-viewer-title">ORBITA / H1 <span>A CLOSER LOOK</span></h2>
          <button className="d11-close" type="button" onClick={() => viewer.current.close()} autoFocus aria-label="Close product view">CLOSE <span aria-hidden="true">×</span></button>
          <img src="/demo11/demo11-hero.png" alt="ORBITA H1 wireless headphones with brushed champagne metal, graphite earcups and cushioned black headband" width="1106" height="1422" />
        </div>
      </dialog>
    </main>
  )
}
