import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import './Demo13.css'

const tourStages = [
  { at: 0, scene: 'hero', label: 'ARRIVE' },
  { at: 5.2, scene: 'paths', path: 0, label: 'CHOOSE YOUR DIRECTION' },
  { at: 7, scene: 'journey', path: 0, label: 'PERFORMANCE' },
  { at: 12, scene: 'paths', path: 1, label: 'A DIFFERENT POSSIBILITY' },
  { at: 13, scene: 'journey', path: 1, label: 'RECOVERY' },
  { at: 18, scene: 'paths', path: 2, label: 'TAKE THE LONG VIEW' },
  { at: 19, scene: 'journey', path: 2, label: 'LONGEVITY' },
]
const tourDuration = 24

const paths = [
  {
    id: 'performance', number: '01', name: 'Performance', short: 'Build strength. Move with purpose.',
    description: 'A focused approach to strength, mobility, and sustainable performance.',
    cta: 'BUILD YOUR PERFORMANCE PLAN', next: 'Give your ambition a direction.',
    nextCopy: 'Start with what you want to work towards, and the rhythm you can realistically sustain.',
    prompt: 'What would you like to build towards?',
    hint: 'Consider your movement goals, your current routine and the time you want to make for training.',
    placeholder: 'I want to build strength for… My current routine is…',
    areas: [
      ['Strength', 'Build a foundation.', 'Purposeful strength work, shaped around your starting point and the movements that matter to you.'],
      ['Mobility', 'Move with freedom.', 'Explore range, control and confidence in how you move — in training and in everyday life.'],
      ['Performance', 'Make progress repeatable.', 'Bring effort and recovery into a routine you can return to, with room to adapt as your goals evolve.'],
    ],
  },
  {
    id: 'recovery', number: '02', name: 'Recovery', short: 'Restore balance. Return stronger.',
    description: 'Make room for restoration, balance, and a more sustainable rhythm.',
    cta: 'EXPLORE YOUR RECOVERY PATH', next: 'Begin with a little more space.',
    nextCopy: 'Notice what your days ask of you. Then consider where a gentler rhythm could fit.',
    prompt: 'Where would you welcome more room to recover?',
    hint: 'Think about your daily pace, what helps you unwind and the moments you would like to protect for yourself.',
    placeholder: 'My days tend to feel… I would like more space for…',
    areas: [
      ['Rest', 'Permission to pause.', 'Make deliberate space away from the demands of your day. A quieter moment can be a worthwhile starting point.'],
      ['Restore', 'Return to yourself.', 'Explore gentle movement, unhurried transitions and the rituals that help you feel more at ease.'],
      ['Recharge', 'Find your rhythm.', 'Create room for the things that replenish you, in a way that feels realistic alongside the rest of your life.'],
    ],
  },
  {
    id: 'longevity', number: '03', name: 'Longevity', short: 'Invest in how you feel tomorrow.',
    description: 'Invest in movement, resilience, and wellbeing that lasts.',
    cta: 'PLAN FOR LONGEVITY', next: 'Design around the life you want to live.',
    nextCopy: 'Choose a lasting priority, then consider the small practices you would be happy to repeat.',
    prompt: 'What would you like to keep making room for?',
    hint: 'Consider the activities you value, the habits you want to sustain and what makes consistency easier for you.',
    placeholder: 'In the years ahead, I want to keep… A habit I could begin with is…',
    areas: [
      ['Movement', 'A practice, not a phase.', 'Find forms of movement you enjoy enough to return to. Let everyday activity be part of the picture.'],
      ['Resilience', 'Room to adapt.', 'Build flexibility into your routine so it can change with your circumstances, priorities and energy.'],
      ['Sustainable Wellbeing', 'Consistency over intensity.', 'Connect small, considered habits to what matters to you. Think in rhythms you can keep, not rigid finish lines.'],
    ],
  },
]

// A quiet, inertial light field. Native cursors and all hit targets stay intact.
function VitalPointer() {
  const lens = useRef(null)
  useEffect(() => {
    const element = lens.current
    const root = element.closest('.d13')
    const preference = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    let frame = 0
    let surface = null
    let x = 0, y = 0, targetX = 0, targetY = 0
    let visible = false
    const clearSurface = () => {
      if (surface) { surface.removeAttribute('data-light'); surface.style.removeProperty('--light-x'); surface.style.removeProperty('--light-y') }
      surface = null
    }
    const hide = () => {
      visible = false
      element.removeAttribute('data-visible')
      element.removeAttribute('data-pressed')
      cancelAnimationFrame(frame)
      frame = 0
      clearSurface()
    }
    const draw = () => {
      x += (targetX - x) * .16
      y += (targetY - y) * .16
      element.style.transform = `translate3d(${x}px, ${y}px, 0)`
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > .15 ? requestAnimationFrame(draw) : 0
    }
    const move = event => {
      if (!preference.matches || event.pointerType !== 'mouse' || event.target.closest('textarea, input, .d13-tour-controls')) { hide(); return }
      targetX = event.clientX; targetY = event.clientY
      if (!visible) { x = targetX; y = targetY; visible = true; element.dataset.visible = 'true' }
      const next = event.target.closest('.d13-hero, .d13-power-art, .d13-rest-art, .d13-long-art, .d13-rest-opening, .d13-choice')
      if (next !== surface) { clearSurface(); surface = next }
      if (surface) {
        const bounds = surface.getBoundingClientRect()
        surface.dataset.light = 'true'
        surface.style.setProperty('--light-x', `${event.clientX - bounds.left}px`)
        surface.style.setProperty('--light-y', `${event.clientY - bounds.top}px`)
      }
      const interactive = event.target.closest('a, button')
      element.dataset.mode = interactive ? 'action' : next?.matches('.d13-power-art, .d13-rest-art, .d13-long-art') ? 'image' : 'ambient'
      element.querySelector('span').textContent = interactive?.matches('.d13-choice') ? 'EXPLORE' : interactive ? '↗' : 'V / 01'
      if (!frame) frame = requestAnimationFrame(draw)
    }
    const down = () => { if (visible) element.dataset.pressed = 'true' }
    const up = () => element.removeAttribute('data-pressed')
    const keyboard = event => { if (event.key === 'Tab' || event.key === 'Escape') hide() }
    root.addEventListener('pointermove', move, { passive: true })
    root.addEventListener('pointerleave', hide)
    root.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    window.addEventListener('blur', hide)
    window.addEventListener('scroll', hide, { passive: true })
    window.addEventListener('keydown', keyboard)
    document.addEventListener('visibilitychange', hide)
    preference.addEventListener('change', hide)
    return () => {
      hide()
      root.removeEventListener('pointermove', move)
      root.removeEventListener('pointerleave', hide)
      root.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('blur', hide)
      window.removeEventListener('scroll', hide)
      window.removeEventListener('keydown', keyboard)
      document.removeEventListener('visibilitychange', hide)
      preference.removeEventListener('change', hide)
    }
  }, [])
  return <div ref={lens} className="d13-pointer" aria-hidden="true"><div className="d13-pointer-aura" /><div className="d13-pointer-orbit"><i /><span>V / 01</span></div></div>
}

function FocusAreas({ path }) {
  return <ol className="d13-focus-areas" aria-label={`${path.name} focus areas`}>
    {path.areas.map(([name, title, copy], index) => <li key={name}>
      <span className="d13-focus-index">0{index + 1}</span>
      <h3>{name}</h3>
      <div><p className="d13-focus-title">{title}</p><p className="d13-focus-description">{copy}</p></div>
    </li>)}
  </ol>
}

function JourneyComposition({ path, titleRef }) {
  if (path.id === 'performance') return <>
    <div className="d13-power-opening">
      <div className="d13-power-type"><p className="d13-eyebrow">INTENTION INTO ACTION</p>
        <h2 id="d13-journey-title" tabIndex={-1} ref={titleRef}>PUSH BEYOND<br /><span>YOUR LIMITS.</span></h2>
        <p className="d13-journey-description">{path.description}</p>
      </div>
      <div className="d13-power-art" aria-hidden="true"><img className="d13-journey-photo" src="/demo13/performance-editorial.jpg" alt="" width="1536" height="1024" decoding="async" /><span>01</span><small>BUILD. MOVE. REPEAT.</small></div>
      <div className="d13-power-baseline"><span>YOUR STARTING POINT IS YOUR OWN.</span><span>MAKE THE NEXT MOVE COUNT. ↘</span></div>
    </div>
    <div className="d13-focus-section"><p className="d13-eyebrow">THE APPROACH / THREE CONNECTED FOCUSES</p><FocusAreas path={path} /></div>
  </>
  if (path.id === 'recovery') return <>
    <div className="d13-rest-opening"><p className="d13-eyebrow">LESS RUSH. MORE ROOM.</p>
      <h2 id="d13-journey-title" tabIndex={-1} ref={titleRef}>RECOVERY<br /><em>IS PROGRESS.</em></h2>
      <p className="d13-journey-description">{path.description}</p><span className="d13-rest-line" aria-hidden="true" />
    </div>
    <div className="d13-rest-study">
      <div className="d13-rest-art" aria-hidden="true"><span>THE ART OF<br />DOING A LITTLE LESS.</span><img className="d13-journey-photo" src="/demo13/recovery-editorial.jpg" alt="" width="1536" height="1024" decoding="async" /><small>A MOMENT, JUST FOR YOU. / 02</small></div>
      <div className="d13-focus-section"><p className="d13-eyebrow">A GENTLER DIRECTION</p><FocusAreas path={path} /></div>
    </div>
  </>
  return <>
    <div className="d13-long-opening">
      <div className="d13-long-art" aria-hidden="true"><img className="d13-journey-photo" src="/demo13/longevity-editorial.jpg" alt="" width="1536" height="1024" decoding="async" /><span>V / 03</span><small>BUILT AROUND LIVING.</small></div>
      <div className="d13-long-type"><p className="d13-eyebrow">A LONGER PERSPECTIVE</p><h2 id="d13-journey-title" tabIndex={-1} ref={titleRef}>DESIGNED<br />FOR THE<br /><em>LONG GAME.</em></h2><p className="d13-journey-description">{path.description}</p><p className="d13-long-note">Not a finish line.<br />A way to keep going.</p></div>
    </div>
    <div className="d13-focus-section"><div className="d13-long-focus-heading"><p className="d13-eyebrow">FOUNDATIONS / FOR THE EVERYDAY</p><p>Small practices.<br />A wider perspective.</p></div><FocusAreas path={path} /></div>
  </>
}

export default function Demo13() {
  const [selected, setSelected] = useState(0)
  const [view, setView] = useState('paths')
  const [focused, setFocused] = useState(0)
  const [navigation, setNavigation] = useState(null)
  const [notes, setNotes] = useState({})
  const [playing, setPlaying] = useState(false)
  const [filmEnded, setFilmEnded] = useState(false)
  const [entry, setEntry] = useState(null)
  const [tourStatus, setTourStatus] = useState('idle')
  const [tourLabel, setTourLabel] = useState('ARRIVE')
  const [tourRemaining, setTourRemaining] = useState(tourDuration)
  const filmProgress = useRef(null)
  const hero = useRef(null)
  const launchTour = useRef(null)
  const tourPause = useRef(null)
  const tourProgress = useRef(null)
  const tourElapsed = useRef(0)
  const tourStage = useRef(-1)
  const tourAction = useRef(null)
  const film = useRef(null)
  const tabs = useRef([])
  const selector = useRef(null)
  const journey = useRef(null)
  const journeyTitle = useRef(null)
  const inquiry = useRef(null)
  const inquiryTitle = useRef(null)
  const cta = useRef(null)
  const path = paths[selected]

  useEffect(() => {
    const previous = document.title
    document.title = 'VITAL / 01 — A more considered wellbeing'
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      if (media.matches) film.current?.pause()
      else if (!film.current?.ended) film.current?.play().catch(() => {})
    }
    sync()
    media.addEventListener('change', sync)
    return () => { document.title = previous; media.removeEventListener('change', sync) }
  }, [])

  // Focus moves once, immediately after the destination is rendered. Native scrolling
  // remains interruptible; no timers, scroll locking, or delayed focus steals.
  useLayoutEffect(() => {
    if (!navigation) return
    const targets = {
      journey: [journeyTitle.current, journey.current],
      paths: [tabs.current[selected], selector.current],
      inquiry: [inquiryTitle.current, inquiry.current],
      cta: [cta.current, cta.current],
      hero: [launchTour.current, hero.current],
    }
    const [focusTarget, scrollTarget] = targets[navigation.target]
    if (navigation.focus !== false) focusTarget?.focus({ preventScroll: true })
    scrollTarget?.scrollIntoView({
      behavior: navigation.instant || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: navigation.target === 'cta' ? 'center' : 'start',
    })
  }, [navigation, selected])

  useEffect(() => {
    if (!entry) return undefined
    const timer = window.setTimeout(() => setEntry(null), 900)
    return () => window.clearTimeout(timer)
  }, [entry])

  const tourOpen = tourStatus !== 'idle'
  useLayoutEffect(() => {
    if (tourOpen) tourPause.current?.focus({ preventScroll: true })
  }, [tourOpen])

  // The tour is opt-in. Its clock pauses with the tab and stops on any manual
  // navigation. A single cancellable frame loop owns the entire sequence.
  useEffect(() => {
    if (tourStatus !== 'playing') return undefined
    let frame
    let previous = null
    const tick = now => {
      if (document.hidden) previous = null
      else {
        if (previous !== null) tourElapsed.current += (now - previous) / 1000
        previous = now
        const elapsed = Math.min(tourElapsed.current, tourDuration)
        const currentStage = tourStages.findLastIndex(stage => elapsed >= stage.at)
        if (currentStage !== tourStage.current) {
          tourStage.current = currentStage
          tourAction.current(tourStages[currentStage])
        }
        tourProgress.current?.style.setProperty('--d13-tour-progress', elapsed / tourDuration)
        setTourRemaining(Math.ceil(tourDuration - elapsed))
        if (elapsed >= tourDuration) { setTourStatus('finished'); return }
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [tourStatus])

  function replayFilm() {
    const video = film.current
    video.currentTime = 0
    setFilmEnded(false)
    video.play().catch(() => {})
  }
  function startTour() {
    tourElapsed.current = 0
    tourStage.current = -1
    setTourRemaining(tourDuration)
    setTourStatus('playing')
  }
  function stopTour(restoreFocus = false) {
    setTourStatus('idle')
    setEntry(null)
    if (restoreFocus) {
      if (tourStage.current <= 0) launchTour.current?.focus({ preventScroll: true })
      else if (view === 'paths') tabs.current[selected]?.focus({ preventScroll: true })
      else journeyTitle.current?.focus({ preventScroll: true })
    }
  }
  function interruptTour(event) {
    if (!tourOpen || event.target.closest('.d13-tour-controls, .d13-tour-launch')) return
    if (event.type === 'keydown' && ['Tab', 'Shift', 'Control', 'Meta', 'Alt'].includes(event.key)) return
    stopTour()
  }
  function select(index, fromTour = false) {
    setSelected(index)
    setFocused(index)
    setView('journey')
    setNavigation({ target: 'journey', focus: !fromTour })
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setEntry({ path: paths[index], key: performance.now() })
    }
  }
  function backToPaths() {
    setView('paths')
    setFocused(selected)
    setNavigation({ target: 'paths' })
  }
  function closeInquiry() {
    setView('journey')
    setNavigation({ target: 'cta' })
  }
  function onKey(event, index) {
    let next
    if (['ArrowDown', 'ArrowRight'].includes(event.key)) next = (index + 1) % paths.length
    if (['ArrowUp', 'ArrowLeft'].includes(event.key)) next = (index + paths.length - 1) % paths.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = paths.length - 1
    if (next !== undefined) {
      event.preventDefault()
      // Manual tab activation: arrows explore; Enter/Space opens the journey.
      setFocused(next)
      tabs.current[next]?.focus()
    }
  }

  useLayoutEffect(() => {
    tourAction.current = stage => {
      setTourLabel(stage.label)
      if (stage.scene === 'hero') {
        setView('paths')
        setEntry(null)
        setNavigation({ target: 'hero', focus: false, instant: true })
        replayFilm()
      } else if (stage.scene === 'paths') {
        setSelected(stage.path)
        setFocused(stage.path)
        setView('paths')
        setEntry(null)
        setNavigation({ target: 'paths', focus: false })
      } else select(stage.path, true)
    }
  })

  return <main className="d13" data-path={path.id} onWheelCapture={interruptTour} onTouchStartCapture={interruptTour} onPointerDownCapture={interruptTour} onKeyDownCapture={interruptTour}>
    <VitalPointer />
    <a className="d13-skip" href="#d13-journeys">Skip to your journey</a>
    <section className="d13-hero" id="d13-top" ref={hero} aria-labelledby="d13-title">
      <video ref={film} className="d13-film" src="/demo13/wellness-hero.mp4" muted playsInline preload="auto" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => { setFilmEnded(true); setPlaying(false) }} onTimeUpdate={() => { const video = film.current; filmProgress.current?.style.setProperty('--d13-film-progress', video.duration ? video.currentTime / video.duration : 0) }} aria-label="Wellness film in an architectural setting" />
      <div className="d13-shade" />
      <header className="d13-header"><a className="d13-brand" href="#d13-top" aria-label="VITAL / 01 home">VITAL <span>/ 01</span></a><span className="d13-header-note">A MORE CONSIDERED WELLBEING</span><a className="d13-nav" href="#d13-journeys">Find your path <span aria-hidden="true">↗</span></a></header>
      <div className="d13-hero-copy"><p className="d13-eyebrow"><span className="d13-dot" /> HUMAN POTENTIAL. CONSIDERED.</p><h1 id="d13-title">THE FUTURE OF<br />FEELING <em>BETTER.</em></h1><div className="d13-hero-bottom"><p>A more considered approach to performance,<br className="d13-desktop-break" /> recovery and living well.</p><div className="d13-hero-actions"><a className="d13-round-link" href="#d13-journeys"><span>Discover your direction</span><i aria-hidden="true">↓</i></a><button className="d13-tour-launch" ref={launchTour} onClick={startTour}><span aria-hidden="true">▷</span> PLAY THE EXPERIENCE <small>24 SEC</small></button></div></div></div>
      <div className="d13-film-footer"><div className="d13-film-progress" ref={filmProgress} aria-hidden="true" /><span>PERFORMANCE / RECOVERY / LONGEVITY</span><button onClick={() => { if (playing) film.current.pause(); else if (filmEnded) replayFilm(); else film.current.play().catch(() => {}) }} aria-label={playing ? 'Pause background film' : filmEnded ? 'Replay background film' : 'Play background film'}><span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span> {playing ? 'PAUSE FILM' : filmEnded ? 'REPLAY FILM' : 'PLAY FILM'}</button></div>
    </section>

    <section className="d13-journeys" id="d13-journeys" ref={selector} aria-labelledby="d13-question">
      <div className="d13-section-meta"><span className="d13-eyebrow">01 — YOUR DIRECTION</span><span className="d13-eyebrow">WELLBEING IS PERSONAL.</span></div>
      <div className="d13-intro"><h2 id="d13-question">WHAT BRINGS<br /><em>YOU HERE?</em></h2><p>Different goals deserve <br />different journeys.<span>Choose what matters to you.</span></p></div>
      <div className="d13-selector" role="tablist" aria-label="Choose your wellness path" aria-orientation="vertical">{paths.map((item, index) => <button className="d13-choice" key={item.id} id={`d13-tab-${item.id}`} role="tab" aria-selected={selected === index} aria-controls="d13-experience" tabIndex={focused === index ? 0 : -1} onFocus={() => setFocused(index)} ref={el => { tabs.current[index] = el }} onClick={() => select(index)} onKeyDown={event => onKey(event, index)}><span className="d13-number">{item.number} /</span><span className="d13-choice-name">{item.name}</span><span className="d13-choice-copy">{item.short}</span><span className="d13-choice-arrow" aria-hidden="true">{selected === index ? '↘' : '↗'}</span></button>)}</div>
    </section>

    <section id="d13-experience" className={`d13-experience d13-experience-${path.id}`} role="tabpanel" aria-labelledby={`d13-tab-${path.id}`} hidden={view === 'paths'} ref={journey}>
      {view !== 'paths' && <div key={path.id} className="d13-experience-content">
        <div className="d13-journey-bar"><button className="d13-back" onClick={backToPaths}><span aria-hidden="true">←</span> BACK TO PATHS</button><span className="d13-eyebrow">{path.number} / {path.name.toUpperCase()}</span></div>
        <JourneyComposition path={path} titleRef={journeyTitle} />
        <div className="d13-next-step"><div><p className="d13-eyebrow">YOUR NEXT STEP / A PERSONAL STARTING POINT</p><h3>{path.next}</h3><p>{path.nextCopy}</p></div>
          <button className="d13-journey-cta" ref={cta} aria-expanded={view === 'inquiry'} aria-controls="d13-inquiry" onClick={() => { setView('inquiry'); setNavigation({ target: 'inquiry' }) }}>{path.cta}<span aria-hidden="true">↗</span></button>
        </div>
        <section id="d13-inquiry" className="d13-inquiry" hidden={view !== 'inquiry'} ref={inquiry} aria-labelledby="d13-inquiry-title" onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); closeInquiry() } }}>
          <div className="d13-inquiry-intro"><p className="d13-eyebrow">{path.name.toUpperCase()} / YOUR STARTING POINT</p><h3 id="d13-inquiry-title" tabIndex={-1} ref={inquiryTitle}>{path.prompt}</h3><p>{path.hint}</p></div>
          <div className="d13-inquiry-notes"><label htmlFor="d13-notes">A few thoughts, in your own words <span>(optional)</span></label><textarea id="d13-notes" rows={4} maxLength={600} value={notes[path.id] || ''} onChange={event => setNotes(previous => ({ ...previous, [path.id]: event.target.value }))} placeholder={path.placeholder} aria-describedby="d13-inquiry-notice" /><p id="d13-inquiry-notice">This is a prototype reflection space. Nothing is sent or booked. Notes stay only on this page and clear when you reload.</p><button className="d13-back" onClick={closeInquiry}><span aria-hidden="true">←</span> RETURN TO {path.name.toUpperCase()}</button></div>
        </section>
        <div className="d13-journey-return"><span className="d13-eyebrow">A DIFFERENT GOAL IN MIND?</span><button className="d13-back" onClick={backToPaths}>BACK TO PATHS <span aria-hidden="true">↑</span></button></div>
      </div>}
    </section>
    {entry && <div key={entry.key} className={`d13-path-entry d13-entry-${entry.path.id}`} aria-hidden="true"><span>{entry.path.number}</span><p>{entry.path.name}</p><small>YOUR DIRECTION. YOUR EXPERIENCE.</small></div>}
    {tourOpen && <div className="d13-tour-controls" aria-label="Experience playback" role="region" ref={tourProgress}>
      <div className="d13-tour-track" aria-hidden="true"><i /></div>
      <div className="d13-tour-caption"><span>{tourStatus === 'finished' ? 'YOUR NEXT MOVE IS YOURS.' : tourLabel}</span><small>{tourStatus === 'finished' ? 'EXPLORE AT YOUR PACE' : `${String(tourRemaining).padStart(2, '0')} SEC`}</small></div>
      <button ref={tourPause} onClick={() => { if (tourStatus === 'finished') startTour(); else { setTourStatus(tourStatus === 'playing' ? 'paused' : 'playing'); if (tourStatus === 'playing') film.current?.pause(); else if (!film.current?.ended) film.current?.play().catch(() => {}) } }} aria-label={tourStatus === 'finished' ? 'Replay experience' : tourStatus === 'playing' ? 'Pause experience' : 'Resume experience'}>{tourStatus === 'finished' ? 'REPLAY ↺' : tourStatus === 'playing' ? 'PAUSE Ⅱ' : 'RESUME ▷'}</button>
      {tourStatus !== 'finished' && <button onClick={startTour} aria-label="Restart experience">↺</button>}
      <button onClick={() => stopTour(true)} aria-label="Exit experience playback">EXIT ×</button>
    </div>}
  </main>
}
