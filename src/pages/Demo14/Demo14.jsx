import { useEffect, useRef, useState } from 'react'
import { asset, offers, revealBackground, offerMessage, contactLinks } from './content'
import './Demo14.css'
import { createSceneAudio } from './audio'
import HauntedPointer from './HauntedPointer'

function Icon({ type = 'arrow' }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">{type === 'moon' ? <path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z"/> : type === 'key' ? <><circle cx="12" cy="8" r="4"/><path d="m10 12-2 8h8l-2-8"/></> : type === 'sound' ? <><path d="m11 5-6 4H2v6h3l6 4Z M15 8q5 4 0 8 M18 5q8 7 0 14"/></> : <path d="M4 12h15m-6-6 6 6-6 6"/>}</svg>
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
  const [sound, setSound] = useState(false)
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
    const next = !sound
    audio.current?.enable(next)
    setSound(next)
  }
  const lock = useRef(false)
  const timer = useRef(null)
  const heading = useRef(null)
  const messageArea = useRef(null)
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
    <header className="haunt-nav"><button className="haunt-brand" onClick={() => go('hero')} aria-label="Return to the entrance"><img src={asset('ventora-logo-white.png')} alt="Ventora Digital"/></button><button className="haunt-sound" aria-pressed={sound} onClick={toggleSound}><Icon type="sound"/> SOUND {sound ? 'ON' : 'OFF'}</button></header>
    <div id="haunt-content" className="haunt-content">
      {scene === 'hero' && <section className="haunt-stage haunt-entrance">
        <Film src="mansion-hero-loop.mp4" poster={asset('mansion-poster.jpg')} sound={false} background reduced={reduced}/><div className="haunt-shade"/>
        <div className="haunt-hero-copy"><p className="haunt-eyebrow">VENTORA DIGITAL PRESENTS</p><span className="haunt-rule"><Icon type="moon"/></span>{title(<>ENTER IF<br/><em>YOU DARE.</em></>)}<p>Three nightmares. One way to bring<br className="haunt-desktop"/> your business back to life.</p><button className="haunt-text" onClick={() => go('offers')}>VIEW HALLOWEEN OFFERS <span>↗</span></button></div>
        <button className="haunt-button haunt-entrance-button" onClick={() => go(reduced ? 'hall' : 'opening')}><span className="haunt-keyhole"><Icon type="key"/></span><span>ENTER THE MANSION</span></button>
        <video className="haunt-preload" src={asset('mansion-door-opening.mp4')} preload="metadata" muted aria-hidden="true"/>
        <div className="haunt-stage-footer"><span>THE HAUNTED WEBSITE</span><button onClick={() => go('hall')}>SKIP INTRO <span>→</span></button><span>THREE DOORS. A SECOND LIFE.</span></div>
      </section>}
      {scene === 'opening' && <section className="haunt-stage"><Film src="mansion-door-opening.mp4" poster={asset('mansion-poster.jpg')} sound={sound} onDone={() => go('hall')} onNearEnd={() => go('hall')}/><h1 className="haunt-sr" tabIndex={-1} ref={heading}>Entering the mansion</h1><button className="haunt-film-skip" onClick={() => go('hall')}>SKIP INTRO / ENTER THE HALL <Icon/></button></section>}
      {scene === 'hall' && <section className="haunt-hall"><div className="haunt-hall-heading"><p className="haunt-eyebrow">01 / THE THRESHOLD</p>{title(<>CHOOSE YOUR <em>NIGHTMARE.</em></>)}<p>Behind every door lies a problem your business may be facing.</p></div><div className="haunt-hall-art"><img src={asset('three-doors-hall.png')} alt="A candlelit Gothic hall with a left door, a central door above the stairs, and a right door"/>{offers.map((o, i) => <button key={o.name} className={`haunt-door haunt-door-${i} ${previewDoor === i ? 'is-previewed' : ''}`} onClick={() => chooseDoor(i)} aria-label={`Enter ${o.title}: ${o.before}`}><span className="haunt-door-omen" aria-hidden="true"><i/><i/><i/></span><span className="haunt-door-marker" aria-hidden="true"><span className="haunt-keyhole"><Icon type="key"/></span><span className="haunt-door-enter">ENTER</span></span><span className="haunt-door-info"><small>0{i + 1} / {o.chapter}</small><strong>{o.title}</strong><span className="haunt-door-description">{o.before}</span><span className="haunt-door-offer">{o.name} · ${o.price}</span><Icon type="key"/></span></button>)}</div><div className="haunt-door-choices">{offers.map((o, i) => <article key={o.name} className={previewDoor === i ? 'is-previewed' : ''}><button className="haunt-door-select" aria-expanded={previewDoor === i} aria-controls={`door-preview-${i}`} onClick={() => setPreviewDoor(previewDoor === i ? null : i)}><small>0{i + 1} / {['LEFT DOOR', 'CENTER DOOR', 'RIGHT DOOR'][i]}</small><strong>{o.title}</strong><span>{previewDoor === i ? 'CLOSE PREVIEW −' : 'DISCOVER THIS DOOR +'}</span></button>{previewDoor === i && <div className="haunt-door-preview" id={`door-preview-${i}`}><p>{o.before}</p><p>{o.detail}</p><em>{o.name} · ${o.price}</em><button className="haunt-button" onClick={() => go('before', i)}>ENTER {o.chapter}<Icon type="key"/></button></div>}</article>)}</div><div className="haunt-hall-footer"><span>CHOOSE A DOOR. CHANGE THE ENDING.</span><button className="haunt-text" onClick={() => go('offers')}>VIEW HALLOWEEN OFFERS ↗</button></div></section>}
      {['before', 'transformation', 'after'].includes(scene) && <section className="haunt-stage haunt-room">
        {scene === 'transformation' ? <Film key={room.video} src={room.video} poster={asset(`door${selected + 1}-before.png`)} sound={sound} onDone={() => go('after')}/> : <img className="haunt-media" src={asset(`door${selected + 1}-${scene}.png`)} alt={`${room.title.toLowerCase()} — ${scene === 'before' ? 'a haunted business nightmare' : 'a restored, professional digital experience'}`}/>}
        <div className="haunt-room-shade"/>{scene === 'before' && !reduced && <video className="haunt-preload" src={asset(room.video)} preload="metadata" muted aria-hidden="true"/>}
        {scene !== 'transformation' ? <div className="haunt-room-copy"><div className="haunt-room-story"><p className="haunt-eyebrow">0{selected + 1} / {room.chapter} <span>— {scene === 'before' ? 'THE NIGHTMARE' : 'THE SECOND LIFE'}</span></p>{title(scene === 'before' ? room.title : <>THE CURSE<br/><em>IS BROKEN.</em></>)}<p className="haunt-room-lead">{scene === 'before' ? room.before : room.after}</p><p className="haunt-room-detail">{scene === 'before' ? room.detail : `${room.name.toUpperCase()} — $${room.price} USD`}</p></div><div className="haunt-room-actions"><button className={scene === 'before' ? 'haunt-curse-button' : 'haunt-button'} onClick={() => go(scene === 'before' ? reduced ? 'after' : 'transformation' : 'offers')}>{scene === 'before' ? <CurseSeal/> : <Icon type="key"/>}<span>{scene === 'before' ? 'BREAK THE CURSE' : 'DISCOVER YOUR OFFER'}</span>{scene === 'before' ? <small aria-hidden="true">CLICK TO RESTORE</small> : <Icon/>}</button><button className="haunt-text" onClick={() => go('hall')}>← BACK TO THE HALL</button></div></div> : <><h1 className="haunt-sr" ref={heading} tabIndex={-1}>Breaking the curse: {room.name}</h1><button className="haunt-film-skip" onClick={() => go('after')}>SKIP TO THE TRANSFORMATION RESULT <Icon/></button></>}
      </section>}
      {scene === 'offers' && <>
        <section className="haunt-reveal" style={{ '--reveal-bg': `url("${revealBackground}")` }}><div className="haunt-reveal-copy"><p className="haunt-eyebrow">THE CURSE HAS BEEN BROKEN</p><span className="haunt-rule"><Icon type="moon"/></span>{title(<>EVERY WEBSITE DESERVES<br/><em>A SECOND LIFE.</em></>)}<p>We don't just build websites. We bring them back to life.</p><span className="haunt-signature">VENTORA DIGITAL</span><a className="haunt-scroll-cue" href="#haunt-offers"><span>YOUR HALLOWEEN OFFERS AWAIT</span><strong>SCROLL TO EXPLORE</strong><svg viewBox="0 0 24 32" fill="none" aria-hidden="true"><path d="M12 2v25m-7-7 7 7 7-7"/></svg></a></div></section>
        <section className="haunt-offers" id="haunt-offers"><div className="haunt-section-heading"><div><p className="haunt-eyebrow">HALLOWEEN SPECIAL / 2026</p><h2>A new chapter.<br/><em>A different ending.</em></h2></div><div className="haunt-offer-meta"><span>LIMITED PROJECT SLOTS</span><p>OFFER ENDS OCTOBER 31, 2026</p><small>All prices in USD.</small></div></div><div className="haunt-offer-grid">{offers.map((o, i) => <article key={o.name} className={`haunt-card ${selected === i ? 'selected' : ''}`} style={{ '--card-image': `url("${asset(`door${i + 1}-after.png`)}")` }}><div className="haunt-card-top"><span>0{i + 1} / {o.chapter}</span><span>{selected === i ? 'YOUR SELECTION' : 'HALLOWEEN SPECIAL'}</span></div><figure className="haunt-offer-preview"><img src={asset(`door${i + 1}-after.png`)} alt={`${o.name} — restored website concept`} loading="lazy"/><figcaption><span>AFTER / {o.chapter}</span><span>CONCEPT PREVIEW</span></figcaption></figure><h3>{o.name}</h3><p>{o.description}</p><div className="haunt-price"><div className="haunt-price-before"><span>REGULAR PRICE <s>${o.regularPrice.toLocaleString('en-US')} USD</s></span><b>{o.discount}% OFF</b></div><div className="haunt-price-now"><strong>${o.price}</strong><span>USD<br/>HALLOWEEN SPECIAL</span></div></div><ul>{o.items.map(item => <li key={item}>{item}</li>)}</ul><p className="haunt-limit">{o.limit}</p><a href="#haunt-claim" className="haunt-button" onClick={() => setSelected(i)}>CHOOSE {o.chapter}<Icon/></a></article>)}</div><p className="haunt-deposit">50% deposit required to secure an approved booking.</p></section>
        <section className="haunt-claim" id="haunt-claim"><div className="haunt-claim-intro"><p className="haunt-eyebrow">YOUR NEXT CHAPTER STARTS HERE</p><h2>CLAIM YOUR<br/><em>HALLOWEEN OFFER</em></h2><p>Choose your package and send us a message. We'll help you with the next steps.</p><span className="haunt-note">Your details stay in this page until you choose a contact channel and send your message.</span></div><div className="haunt-generator"><fieldset><legend>Package</legend>{offers.map((o, i) => <label className="haunt-radio" key={o.name}><input type="radio" name="package" value={i} checked={selected === i} onChange={() => setSelected(i)}/><span>{o.name}</span><b>${o.price}</b></label>)}</fieldset><div className="haunt-inputs"><label>Name <span>(optional)</span><input autoComplete="name" value={fields.name} onChange={e => setFields({ ...fields, name: e.target.value })} maxLength={150}/></label><label>Website URL <span>(optional)</span><input type="url" autoComplete="url" placeholder="https://yourwebsite.com" value={fields.website} onChange={e => setFields({ ...fields, website: e.target.value })} maxLength={500}/></label></div><label>Project Notes <span>(optional)</span><textarea rows={3} value={fields.notes} onChange={e => setFields({ ...fields, notes: e.target.value })} maxLength={2500}/></label><label className="haunt-message-label">Your offer message<textarea ref={messageArea} className="haunt-message" readOnly value={message} rows={12}/></label><button className="haunt-button" onClick={() => copy()}>COPY MY OFFER MESSAGE<Icon/></button><p className="haunt-notice" role="status">{notice || 'Copy your message, or choose a channel below. You decide when to send.'}</p><div className="haunt-contacts"><a href={links.facebook} target="_blank" rel="noopener noreferrer" onClick={() => { void copy(true) }}>CONTACT VIA FACEBOOK <span>↗</span></a><a href={links.whatsapp} target="_blank" rel="noopener noreferrer">CONTACT VIA WHATSAPP <span>↗</span></a><a href={links.email}>CONTACT VIA EMAIL <span>↗</span></a></div></div></section><footer className="haunt-footer"><span>VENTORA DIGITAL © 2026</span><button onClick={() => go('hall')}>← RETURN TO THE HALL</button><span>GOOD DESIGN HAS A SECOND LIFE.</span></footer>
      </>}
    </div><div className="haunt-transition" aria-hidden="true"/>
  </main>
}
