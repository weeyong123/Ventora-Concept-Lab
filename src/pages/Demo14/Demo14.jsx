import { useEffect, useRef, useState } from 'react'
import { asset, offers, revealBackground, offerMessage, contactLinks, discountPercent } from './content'
import './Demo14.css'
import { createSceneAudio } from './audio'
import HauntedPointer from './HauntedPointer'

function Icon({ type = 'arrow' }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{type === 'door' ? <><path d="M5 21V3h14v18M5 3l10 3v15l-10-3ZM11 12h1M3 21h18"/></> : type === 'moon' ? <path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z"/> : type === 'down' ? <path d="M12 4v16M6 14l6 6 6-6"/> : type === 'up' ? <path d="M12 20V4M6 10l6-6 6 6"/> : type === 'back' ? <path d="M20 12H5M11 6l-6 6 6 6"/> : type === 'external' ? <path d="M6 18 18 6M6 6h12v12"/> : type === 'key' ? <><circle cx="12" cy="8" r="4"/><path d="m10 12-2 8h8l-2-8"/></> : type === 'sound' ? <><path d="m11 5-6 4H2v6h3l6 4Z M15 8q5 4 0 8 M18 5q8 7 0 14"/></> : <path d="M4 12h15M13 6l6 6-6 6"/>}</svg>
}
function OfferPrice({ offer }) {
  return <span className="haunt-inline-price"><s aria-label={`Regular price ${offer.regularPrice} US dollars`}>${offer.regularPrice.toLocaleString('en-US')}</s><b aria-label={`Halloween price ${offer.price} US dollars`}>${offer.price}</b><em className="haunt-discount">SAVE {discountPercent(offer)}%</em></span>
}
function SoundGhost() {
  return <svg className="haunt-sound-ghost" viewBox="0 0 64 72" fill="none" aria-hidden="true"><path d="M12 55V29C12 16 20 8 32 8s20 8 20 21v28l-8-5-7 7-8-6-8 6-9-4Z" fill="#f6eee1" stroke="#cbb4df" strokeWidth="1.5"/><ellipse cx="26" cy="29" rx="3" ry="5" fill="#292035"/><ellipse cx="40" cy="29" rx="3" ry="5" fill="#292035"/><path d="M29 40q5 5 9-1" stroke="#594265" strokeWidth="2" strokeLinecap="round"/><path d="m47 17 7-9m-5 0 5-1 1 5" stroke="#e4bb7d" strokeWidth="2" strokeLinecap="round"/><circle cx="20" cy="37" r="3" fill="#d4a3c6" opacity=".6"/><circle cx="45" cy="36" r="3" fill="#d4a3c6" opacity=".6"/></svg>
}
function HalloweenWeb() {
  return <svg className="haunt-corner-web" viewBox="0 0 160 160" fill="none" aria-hidden="true" focusable="false"><path d="M0 0v150M0 0h150M0 0l140 58M0 0l106 106M0 0l58 140M0 36q9-3 14-3 2-9 11-8 0-9 8-11-1-7 3-14M0 72q16-8 28-6 5-16 23-15-2-18 15-23-2-13 6-28M0 108q22-11 42-8 8-25 34-24-1-26 24-34-3-20 8-42M0 144q31-15 56-11 10-34 45-32-2-35 32-45-4-25 11-56"/></svg>
}
function HalloweenBats() {
  return <div className="haunt-bats" aria-hidden="true">{[0, 1, 2].map(i => <svg key={i} viewBox="0 0 100 45" focusable="false"><path d="M50 18 44 9l-2 10C29 16 13 4 2 1c4 12 5 22 3 31 12-7 18-6 24 3 8-6 14-3 21 10 7-13 13-16 21-10 6-9 12-10 24-3-2-9-1-19 3-31-11 3-27 15-40 18L56 9Z"/></svg>)}</div>
}
function RoomEmblem({ index }) {
  return <svg className="haunt-room-emblem" viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">{index === 0 ? <><circle cx="24" cy="25" r="16"/><circle cx="24" cy="25" r="12" opacity=".4"/><path d="M24 14v12l7 4M20 5h8M24 5v4M10 40l3-4m25 4-3-4M11 11l-4 4m30-4 4 4"/><path d="m29 10-4 8 4 4-5 6" className="haunt-emblem-crack"/></> : index === 1 ? <><path d="M10 40V22a14 14 0 0 1 28 0v18l-7-5-7 6-7-6-7 5Z"/><ellipse cx="19" cy="22" rx="2" ry="3" fill="currentColor"/><ellipse cx="29" cy="22" rx="2" ry="3" fill="currentColor"/><path d="M21 30q3-3 6 0M6 9l2 3-2 3-2-3Zm35 22 2 3-2 3-2-3Z"/></> : <><path d="M33 12H7v24h26M7 12l16 13 10-8M7 36l13-13m6 0 7 7"/><path className="haunt-emblem-particles" d="M37 10h5m-6 8h8m-7 9h4m-6 9h7M40 42h4"/></>}</svg>
}
function PumpkinSeal() {
  return <span className="haunt-pumpkin-seal" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="29"/><circle cx="32" cy="32" r="24" strokeDasharray="2 4"/><path d="M32 23c-12-6-20 2-16 13 3 8 10 10 16 7 6 3 13 1 16-7 4-11-4-19-16-13ZM32 23q-3-10 5-10M32 24v19M26 23q-8 9 0 20m12-20q8 9 0 20"/><path d="m22 28 6 5h-7Zm20 0-6 5h7ZM24 36l5 2 3-3 3 3 5-2q-7 10-16 0Z" fill="currentColor" stroke="none"/></svg></span>
}
function CurseSeal() {
  return <span className="haunt-curse-seal" aria-hidden="true"><svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="44"/><circle cx="50" cy="50" r="35" strokeDasharray="35 7 2 7"/><path className="haunt-seal-fracture" d="m55 17-13 24 13 9-13 32M47 34l-13-7m17 33 15 9"/><path d="M50 2v9m0 78v9M2 50h9m78 0h9M18 18l7 7m50 50 7 7M18 82l7-7m50-50 7-7"/><path d="m50 25 22 25-22 25-22-25Z" opacity=".4"/></svg></span>
}
function Film({ src, poster, sound, loop = false, background = false, onDone, onNearEnd, reduced }) {
  const ref = useRef(null)
  const [status, setStatus] = useState('loading')
  useEffect(() => {
    if (status !== 'loading') return
    const timer = setTimeout(() => setStatus('slow'), 7000)
    return () => clearTimeout(timer)
  }, [status])
  useEffect(() => {
    const video = ref.current
    video.volume = 0.65
    if (reduced && background) return
    let active = true
    const start = () => { if (!video.ended) video.play()?.catch(() => { if (active) setStatus('blocked') }) }
    start()
    const visibility = () => { if (document.hidden) video.pause(); else start() }
    document.addEventListener('visibilitychange', visibility)
    return () => { active = false; video.pause(); document.removeEventListener('visibilitychange', visibility) }
  }, [src, reduced, loop, background])
  return <><video ref={ref} className="haunt-media" src={asset(src)} poster={poster} muted={!sound} loop={loop} playsInline preload={reduced && background ? "none" : "auto"} onPlaying={() => setStatus('playing')} onWaiting={() => setStatus('loading')} onError={() => setStatus('error')} onEnded={onDone} onTimeUpdate={e => { const v = e.currentTarget; if (!loop && v.duration - v.currentTime < .38) onNearEnd?.() }} />{!background && !loop && ['slow', 'blocked', 'error'].includes(status) && <div className="haunt-film-status" role="status">{status === 'error' ? 'This film is unavailable. You can continue below.' : status === 'blocked' ? 'Playback is paused. Play the film or continue below.' : status === 'slow' ? 'The film is taking a little longer. You can continue below.' : 'Preparing your experience…'}{status === 'blocked' && <button onClick={() => ref.current.play().catch(() => setStatus('error'))}>PLAY FILM</button>}</div>}</>
}
export default function Demo14() {
  const [scene, setScene] = useState('hero')
  const [selected, setSelected] = useState(0)
  const [completedRooms, setCompletedRooms] = useState([])
  const [sound, setSound] = useState(false)
  const [soundHint, setSoundHint] = useState(true)
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [fading, setFading] = useState(false)
  const [breaking, setBreaking] = useState(false)
  const [previewDoor, setPreviewDoor] = useState(null)
  const [fields, setFields] = useState({ name: '', website: '', notes: '' })
  const [copyResult, setCopyResult] = useState(null)
  const audio = useRef(null)
  useEffect(() => {
    audio.current = createSceneAudio()
    return () => { audio.current.dispose(); audio.current = null }
  }, [])
  useEffect(() => { audio.current?.enter(scene) }, [scene])
  function toggleSound() {
    setSoundHint(false)
    const next = !sound
    audio.current?.enable(next)
    setSound(next)
  }
  const lock = useRef(false)
  const timer = useRef(null)
  const heading = useRef(null)
  const messageArea = useRef(null)
  const allRoomsComplete = completedRooms.length === offers.length
  const room = offers[selected]
  const message = offerMessage(selected, fields)
  const links = contactLinks(selected, message)
  useEffect(() => {
    const oldTitle = document.title
    document.title = 'The Haunted Website — Ventora Digital | Halloween 2026'
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const change = e => setReduced(e.matches)
    query.addEventListener('change', change)
    return () => { document.title = oldTitle; query.removeEventListener('change', change); clearTimeout(timer.current) }
  }, [])
  const notice = copyResult?.message === message ? copyResult.text : ''
  const setNotice = text => setCopyResult({ message, text })
  useEffect(() => {
    // Warm only the next scene's images; do not fetch all five films upfront.
    const paths = scene === 'hero' || scene === 'opening' ? ['three-doors-hall.png'] : scene === 'hall' ? offers.map((_, i) => `door${i + 1}-before.png`) : scene === 'before' || scene === 'transformation' ? [`door${selected + 1}-after.png`, 'final-reveal-bg.png'] : []
    paths.forEach(path => { const img = new Image(); img.src = asset(path); img.decode?.().catch(() => {}) })
    if (scene !== 'hero') heading.current?.focus({ preventScroll: true })
  }, [scene, selected])
  function go(next, index) {
    if (lock.current) return
    lock.current = true
    audio.current?.transition(next)
    const commit = () => {
      setFading(true)
      timer.current = setTimeout(() => {
        if (index !== undefined) setSelected(index)
        if (next === 'after') {
          const completedIndex = index ?? selected
          setCompletedRooms(previous => previous.includes(completedIndex) ? previous : [...previous, completedIndex])
        }
        setScene(next)
        setPreviewDoor(null)
        setBreaking(false)
        window.scrollTo({ top: 0, behavior: 'instant' })
        setFading(false)
        lock.current = false
      }, reduced ? 0 : 320)
    }
    if (scene === 'before' && next === 'transformation' && !reduced) {
      setBreaking(true)
      timer.current = setTimeout(commit, 650)
    } else commit()
  }
  useEffect(() => {
    if (scene !== 'hall' || previewDoor === null) return
    const frame = requestAnimationFrame(() => {
      const card = document.getElementById(`door-choice-${previewDoor}`)
      card?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'center' })
    })
    return () => cancelAnimationFrame(frame)
  }, [previewDoor, scene, reduced])
  function chooseDoor(index) {
    if (window.matchMedia('(max-width: 700px), (hover: none)').matches) setPreviewDoor(index)
    else go('before', index)
  }

  async function copy(facebook = false) {
    try {
      await navigator.clipboard.writeText(message)
      setNotice(facebook ? 'MESSAGE COPIED! Paste it into Facebook and send when you are ready.' : 'MESSAGE COPIED!')
    } catch {
      setNotice('Automatic copy is unavailable. Select and copy the message below, then paste it into your chosen channel.')
      messageArea.current?.focus()
      messageArea.current?.select()
    }
  }
  const title = (text, level = 1) => level === 1 ? <h1 ref={heading} tabIndex={-1}>{text}</h1> : <h2 ref={heading} tabIndex={-1}>{text}</h2>
  return <main className={`haunt haunt-scene-${scene} ${fading ? 'is-fading' : ''} ${breaking ? 'is-breaking' : ''}`}>
    <HauntedPointer cinematic={['opening', 'transformation'].includes(scene)}/>
    <a className="haunt-skip" href="#haunt-content">SKIP TO CONTENT</a>
    <header className="haunt-nav"><button className="haunt-brand" onClick={() => go('hero')} aria-label="Return to the entrance"><img src={asset('ventora-logo-white.png')} alt="Ventora Digital"/></button><div className="haunt-nav-actions"><a className="haunt-main-site" href="https://ventoradigital.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit Ventora Digital main site (opens in a new tab)"><span className="haunt-site-desktop">VISIT MAIN SITE</span><span className="haunt-site-mobile">MAIN SITE</span><Icon type="external"/></a><div className="haunt-sound-control"><button className="haunt-sound" aria-pressed={sound} onClick={toggleSound}><Icon type="sound"/> SOUND {sound ? 'ON' : 'OFF'}</button>{scene === 'hero' && soundHint && !sound && <button className="haunt-sound-hint" onClick={toggleSound} aria-label="Enable sound for the experience"><SoundGhost/><span className="haunt-sound-hint-copy"><small><span className="haunt-sound-hint-desktop">Sound adds to the haunting</span><span className="haunt-sound-hint-mobile">Tap for sound</span><Icon type="up"/></small></span></button>}</div></div>{['hall', 'before', 'after'].includes(scene) && <div className="haunt-progress" aria-label={`${completedRooms.length} of 3 rooms explored`}><span className="haunt-progress-caption">YOUR JOURNEY</span><ol>{offers.map((offer, i) => <li key={offer.chapter} className={completedRooms.includes(i) ? 'is-complete' : scene !== 'hall' && selected === i ? 'is-current' : ''} aria-label={`${offer.chapter}: ${completedRooms.includes(i) ? 'completed' : scene !== 'hall' && selected === i ? 'current room' : 'not yet explored'}`}><span aria-hidden="true">{completedRooms.includes(i) ? '✓' : `0${i + 1}`}</span></li>)}</ol><span>{completedRooms.length}/3</span></div>}</header>
    <div id="haunt-content" className="haunt-content">
      {scene === 'hero' && <section className="haunt-stage haunt-entrance"><HalloweenBats/>
        <Film src="mansion-hero-loop.mp4" poster={asset('mansion-poster.jpg')} sound={false} background reduced={reduced}/><div className="haunt-shade"/>
        <div className="haunt-hero-copy"><p className="haunt-eyebrow">VENTORA DIGITAL PRESENTS</p><span className="haunt-rule"><Icon type="moon"/></span>{title(<>ENTER IF<br/><em>YOU DARE.</em></>)}<p>Three nightmares. One way to bring<br className="haunt-desktop"/> your business back to life.</p></div>
        <button className="haunt-button haunt-entrance-button" onClick={() => go(reduced ? 'hall' : 'opening')}><span className="haunt-keyhole"><Icon type="door"/></span><span className="haunt-enter-label"><span className="haunt-click-label">CLICK TO ENTER</span><span className="haunt-tap-label">TAP TO ENTER</span></span><span className="haunt-invitation-arrow" aria-hidden="true"><Icon type="up"/></span></button>
        <video className="haunt-preload" src={asset('mansion-door-opening.mp4')} preload="metadata" muted aria-hidden="true"/>
        <div className="haunt-stage-footer"><button className="haunt-hero-offers" onClick={() => go('offers')}>VIEW HALLOWEEN OFFERS</button><button onClick={() => go('hall')}>SKIP INTRO <Icon/></button><span>THREE DOORS. A SECOND LIFE.</span></div>
      </section>}
      {scene === 'opening' && <section className="haunt-stage"><Film src="mansion-door-opening.mp4" poster={asset('mansion-poster.jpg')} sound={sound} onDone={() => go('hall')} onNearEnd={() => go('hall')}/><h1 className="haunt-sr" tabIndex={-1} ref={heading}>Entering the mansion</h1><button className="haunt-film-skip" onClick={() => go('hall')}>SKIP INTRO / ENTER THE HALL <Icon/></button></section>}
      {scene === 'hall' && <section className="haunt-hall"><HalloweenWeb/><div className="haunt-hall-heading"><p className="haunt-eyebrow">01 / THE THRESHOLD</p>{title(<>CHOOSE YOUR <em>NIGHTMARE.</em></>)}<p className="haunt-hall-desktop-intro">Behind every door lies a problem your business may be facing.</p><p className="haunt-hall-instructions"><b>1. TAP A DOOR</b><span>Read its story below, then tap <strong>ENTER THIS ROOM</strong>.</span></p></div><div className="haunt-hall-art"><img src={asset('three-doors-hall.png')} alt="A candlelit Gothic hall with a left door, a central door above the stairs, and a right door"/><div className="haunt-hall-atmosphere" aria-hidden="true"><i className="haunt-hall-blue"/><i className="haunt-hall-red"/><i className="haunt-hall-mist"/>{[0, 1].map(i => <svg key={i} className={`haunt-watcher haunt-watcher-${i}`} viewBox="0 0 40 120" fill="currentColor"><path d="M20 4C7 4 6 24 12 32L7 45 1 113Q20 104 39 117L32 45 27 32C34 20 31 4 20 4Z"/><path d="M12 36 3 72l7 3 11-34 9 35 7-4-8-35Z"/></svg>)}</div>{offers.map((o, i) => <button key={o.name} className={`haunt-door haunt-door-${i} ${previewDoor === i ? 'is-previewed' : ''} ${completedRooms.includes(i) ? 'is-explored' : ''}`} onClick={() => chooseDoor(i)} aria-label={`Enter ${o.title}: ${o.before}`}><span className="haunt-door-omen" aria-hidden="true"><i/><i/><i/></span><span className="haunt-door-marker" aria-hidden="true"><span className="haunt-keyhole"><RoomEmblem index={i}/></span><span className="haunt-door-enter"><span className="haunt-door-desktop-label">{completedRooms.includes(i) ? 'REVISIT ✓' : 'ENTER'}</span><span className="haunt-door-mobile-label">{i + 1} · {completedRooms.includes(i) ? '✓' : 'TAP'}</span> <span className="haunt-invitation-arrow" aria-hidden="true"><Icon type="up"/></span></span></span><span className="haunt-door-info"><small>0{i + 1} / {o.chapter}</small><strong>{o.title}</strong><span className="haunt-door-description">{o.before}</span><span className="haunt-door-offer">{o.name} · <OfferPrice offer={o}/></span><Icon type="key"/></span></button>)}</div><div className="haunt-door-choices">{offers.map((o, i) => <article key={o.name} id={`door-choice-${i}`} className={previewDoor === i ? 'is-previewed' : ''}><button className="haunt-door-select" aria-expanded={previewDoor === i} aria-controls={`door-preview-${i}`} onClick={() => setPreviewDoor(previewDoor === i ? null : i)}><small>0{i + 1} / {['LEFT DOOR', 'CENTER DOOR', 'RIGHT DOOR'][i]} · {['THE BROKEN CLOCK', 'THE LOST SPIRIT', 'THE VANISHING LETTER'][i]}</small><strong>{o.title}</strong>{completedRooms.includes(i) && <span className="haunt-completed-label">✓ TRANSFORMATION EXPLORED</span>}<span>{previewDoor === i ? <>SELECTED · YOUR NEXT STEP IS BELOW <Icon type="down"/></> : <>TAP TO SELECT THIS ROOM <Icon type="down"/></>}</span></button>{previewDoor === i && <div className="haunt-door-preview" id={`door-preview-${i}`}><span className="haunt-step-label">2. ENTER YOUR SELECTED ROOM</span><p>{o.before}</p><p>{o.detail}</p><em>{o.name} · <OfferPrice offer={o}/></em><button className="haunt-button" onClick={() => go('before', i)}>ENTER THIS ROOM<Icon type="up"/></button></div>}</article>)}</div><div className="haunt-hall-footer"><span>CHOOSE A DOOR. CHANGE THE ENDING.</span><button className="haunt-text" onClick={() => go('offers')}>VIEW HALLOWEEN OFFERS <Icon type="external"/></button></div></section>}
      {['before', 'transformation', 'after'].includes(scene) && <section className={`haunt-stage haunt-room haunt-room-${selected}`}>
        {scene === 'transformation' ? <Film key={room.video} src={room.video} poster={asset(`door${selected + 1}-before.png`)} sound={sound} onDone={() => go('after')}/> : <img className="haunt-media" src={asset(`door${selected + 1}-${scene}.png`)} alt={`${room.title.toLowerCase()} — ${scene === 'before' ? 'a haunted business nightmare' : 'a restored, professional digital experience'}`}/>}
        <div className="haunt-room-shade"/>{scene === 'before' && !reduced && <video className="haunt-preload" src={asset(room.video)} preload="metadata" muted aria-hidden="true"/>}
        {scene !== 'transformation' ? <div className="haunt-room-copy"><div className="haunt-room-story"><p className="haunt-eyebrow">0{selected + 1} / {room.chapter} <span>— {scene === 'before' ? 'THE NIGHTMARE' : 'THE SECOND LIFE'}</span></p>{title(scene === 'before' ? room.title : <>THE CURSE<br/><em>IS BROKEN.</em></>)}<p className="haunt-room-lead">{scene === 'before' ? room.before : room.after}</p><p className="haunt-room-detail">{scene === 'before' ? room.detail : <>{room.name.toUpperCase()} — <OfferPrice offer={room}/> USD</>}</p></div>{scene === 'after' && <p className="haunt-room-outcome">{room.result}</p>}<div className="haunt-room-actions"><button className={scene === 'before' ? 'haunt-curse-button' : 'haunt-button'} onClick={() => go(scene === 'before' ? reduced ? 'after' : 'transformation' : 'offers')}>{scene === 'before' ? <CurseSeal/> : <Icon type="key"/>}<span>{scene === 'before' ? 'BREAK THE CURSE' : 'VIEW THIS OFFER'}</span>{scene === 'before' ? <span className="haunt-invitation-arrow" aria-hidden="true"><Icon type="up"/></span> : <Icon/>}</button><button className="haunt-text" onClick={() => go('hall')}><Icon type="back"/> {scene === 'after' ? 'EXPLORE OTHER OFFERS' : 'BACK TO THE HALL'}</button></div></div> : <><h1 className="haunt-sr" ref={heading} tabIndex={-1}>Breaking the curse: {room.name}</h1><button className="haunt-film-skip" onClick={() => go('after')}>SKIP TO THE TRANSFORMATION RESULT <Icon/></button></>}
      </section>}
      {scene === 'offers' && <>
        <section className="haunt-reveal" style={{ '--reveal-bg': `url("${revealBackground}")` }}><div className="haunt-reveal-copy"><p className="haunt-eyebrow">{allRoomsComplete ? 'THREE CURSES BROKEN. CHOOSE YOUR NEXT CHAPTER.' : 'YOUR NEXT CHAPTER STARTS HERE'}</p><span className="haunt-rule"><Icon type="moon"/></span>{title(<>EVERY WEBSITE DESERVES<br/><em>A SECOND LIFE.</em></>)}<p>We don't just build websites. We bring them back to life.</p><span className="haunt-signature">VENTORA DIGITAL</span><a className="haunt-scroll-cue" href="#haunt-offers"><span>DISCOVER YOUR HALLOWEEN OFFER</span><strong>SCROLL TO EXPLORE OFFERS</strong><svg viewBox="0 0 24 32" fill="none" aria-hidden="true"><path d="M12 2v25m-7-7 7 7 7-7"/></svg></a></div></section>
        <section className="haunt-offers" id="haunt-offers"><HalloweenWeb/><div className="haunt-section-heading"><div><p className="haunt-eyebrow"><span className="haunt-pumpkin" aria-hidden="true">🎃</span> HALLOWEEN SPECIAL / 2026</p><h2>A new chapter.<br/><em>A different ending.</em></h2></div><div className="haunt-offer-meta"><span>SCOPE & AVAILABILITY CONFIRMED BEFORE BOOKING</span><p><span className="haunt-pumpkin" aria-hidden="true">🎃</span> OFFER ENDS NOVEMBER 2, 2026</p><small>All prices in USD.</small></div></div><div className="haunt-offer-grid">{offers.map((o, i) => <article key={o.name} className={`haunt-card ${i === 1 ? 'haunt-card-featured' : ''} ${selected === i ? 'selected' : ''}`} style={{ '--card-image': `url("${asset(`door${i + 1}-after.png`)}")` }}><div className="haunt-card-top"><span><RoomEmblem index={i}/> 0{i + 1} / {o.chapter}</span><span>{selected === i ? 'YOUR SELECTION' : 'HALLOWEEN SPECIAL'}</span></div><figure className="haunt-offer-preview"><img src={asset(`door${i + 1}-after.png`)} alt={`${o.name} — restored website concept`} loading="lazy"/><PumpkinSeal/><figcaption><span>AFTER / {o.chapter}</span><span>CONCEPT PREVIEW</span></figcaption></figure><p className="haunt-featured-label" aria-hidden={i !== 1 ? true : undefined}>{i === 1 ? 'BEST FOR GROWING BUSINESSES' : ''}</p><h3>{o.name}</h3><p>{o.description}</p><div className="haunt-price"><div className="haunt-price-before"><span>REGULAR PRICE <s>${o.regularPrice.toLocaleString('en-US')} USD</s></span><b className="haunt-discount">SAVE {discountPercent(o)}%</b></div><div className="haunt-price-now"><strong>${o.price}</strong><span>USD · ONE-TIME PROJECT FEE<br/>HALLOWEEN SPECIAL</span></div></div><small className="haunt-included-label">WHAT’S INCLUDED</small><ul>{o.items.map(item => <li key={item}>{item}</li>)}</ul><div className="haunt-offer-result"><small>THE RESULT</small><p>{o.result}</p></div><p className="haunt-limit">{o.limit}</p><a href="#haunt-claim" className="haunt-button" onClick={() => setSelected(i)}>CLAIM THIS OFFER<Icon/></a></article>)}</div><p className="haunt-deposit">50% deposit after scope approval · 50% upon completion and approval, before final handover or launch.</p></section>
        <section className="haunt-trust"><p className="haunt-eyebrow">BEYOND THE TEMPLATE</p><h2>A better first impression.</h2><div><p><strong>Custom Design</strong>Built around your brand</p><p><strong>Mobile Ready</strong>Designed for every screen</p><p><strong>Clear Direction</strong>Focused on next steps</p></div><p>Every project is designed around your business, your audience and your goals — to communicate more clearly.</p><a className="haunt-text" href="https://ventoradigital.com/" target="_blank" rel="noopener noreferrer">EXPLORE VENTORA DIGITAL<Icon type="external"/></a></section><section className="haunt-terms"><details><summary>Halloween Offer Terms</summary><ul><li>Promotion valid through November 2, 2026. All prices are in USD.</li><li>Each package includes custom design, responsive development, standard deployment and two rounds of revisions within the agreed scope.</li><li>Clients provide final website copy, images and brand assets. Additional pages, features and major changes of direction are quoted separately.</li><li>Domain registration, hosting subscriptions, paid integrations, third-party services and ongoing maintenance are not included.</li><li>E-commerce, advanced booking systems and CRM automation are quoted separately.</li><li>A 50% deposit is required after project scope and availability are confirmed. The remaining 50% is due upon completion and approval, before final handover or launch.</li><li>Project timelines are agreed individually. November 2 is the promotional booking deadline, not the delivery date.</li><li>Offers cannot be combined with other discounts.</li></ul></details></section><section className="haunt-claim" id="haunt-claim"><div className="haunt-claim-intro"><p className="haunt-eyebrow">YOUR NEXT CHAPTER STARTS HERE</p><h2>CLAIM YOUR<br/><em>HALLOWEEN OFFER</em></h2><p>Choose an offer and send an enquiry. We confirm scope, availability and timing together; after agreement and a 50% deposit, your project joins the agreed schedule.</p><span className="haunt-note">Your details stay in this page until you choose a contact channel and send your message.</span></div><div className="haunt-generator"><p className="haunt-selected-guidance" role="status"><strong>{room.name} selected.</strong> Personalize your message below, then choose WhatsApp, Facebook or Email to contact us.</p><fieldset><legend>Package</legend>{offers.map((o, i) => <label className="haunt-radio" key={o.name}><input type="radio" name="package" value={i} checked={selected === i} onChange={() => setSelected(i)}/><span>{o.name}</span><OfferPrice offer={o}/></label>)}</fieldset><div className="haunt-inputs"><label>Name <span>(optional)</span><input autoComplete="name" value={fields.name} onChange={e => setFields({ ...fields, name: e.target.value })} maxLength={150}/></label><label>Website URL <span>(optional)</span><input type="url" autoComplete="url" placeholder="https://yourwebsite.com" value={fields.website} onChange={e => setFields({ ...fields, website: e.target.value })} maxLength={500}/></label></div><label>Project Notes <span>(optional)</span><textarea rows={3} value={fields.notes} onChange={e => setFields({ ...fields, notes: e.target.value })} maxLength={2500}/></label><label className="haunt-message-label">Your offer message<textarea ref={messageArea} className="haunt-message" readOnly value={message} rows={12}/></label><button className="haunt-button" onClick={() => copy()}>COPY MY OFFER MESSAGE<Icon/></button><p className="haunt-notice" role="status">{notice || 'Copy your message, or choose a channel below. You decide when to send.'}</p><div className="haunt-contacts"><a href={links.facebook} target="_blank" rel="noopener noreferrer" onClick={() => { void copy(true) }}>CONTACT VIA FACEBOOK <Icon type="external"/></a><a href={links.whatsapp} target="_blank" rel="noopener noreferrer">CONTACT VIA WHATSAPP <Icon type="external"/></a><a href={links.email}>CONTACT VIA EMAIL <Icon type="external"/></a></div></div></section><footer className="haunt-footer"><span>VENTORA DIGITAL © 2026</span><button onClick={() => go('hall')}><Icon type="back"/> RETURN TO THE HALL</button><span>GOOD DESIGN HAS A SECOND LIFE.</span></footer>
      </>}
    </div><div className="haunt-transition" aria-hidden="true"/>
  </main>
}
