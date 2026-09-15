import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './PropertyAdvisor.css'

gsap.registerPlugin(ScrollTrigger)
const areas = [
  { name: 'Iskandar Puteri', tag: 'A broader perspective', text: 'Start with the life you want to build. Compare neighbourhood character, everyday amenities and the journey home.', x: 23, y: 55 },
  { name: 'Eco Botanic', tag: 'Room to put down roots', text: 'Look beyond the facade. Explore landed layouts, garden space and how a neighbourhood feels at different times of day.', x: 18, y: 36 },
  { name: 'Bukit Indah', tag: 'The everyday, considered', text: 'A shortlist shaped around daily routines. Consider access to shops, schools and the places your family returns to.', x: 41, y: 35 },
  { name: 'Mount Austin', tag: 'Find your own rhythm', text: 'Read the street as closely as the floor plan. Compare quieter pockets, surrounding activity and your actual commute.', x: 76, y: 19 },
  { name: 'Tebrau', tag: 'See the bigger picture', text: 'Explore your options across different home types. Put space, accessibility and your budget into the same conversation.', x: 85, y: 39 },
  { name: 'Danga Bay', tag: 'A different outlook', text: 'For a waterfront-oriented shortlist, examine orientation, building management and the real costs of high-rise living.', x: 57, y: 66 },
]
const areaSequence = [1, 2, 0, 5, 3, 4]
const mapPlan = "108,137 246,133 138,209 342,251 456,72 510,148"
const mapElevation = "120,245 120,140 260,140 260,245 470,245 470,140"
const lanes = [
  ['New launch', 'See beyond the show unit.', 'Compare layouts, developer information, delivery timelines and the full cost of ownership.'],
  ['Subsale', 'Look closer. Know more.', 'Understand the home as it stands, from condition and renovation needs to the surrounding street.'],
  ['Investment', 'Start with the questions.', 'Compare asking prices, recurring costs and rental assumptions. Explore scenarios without promises of returns.'],
  ['Own stay', 'A home that fits your life.', 'Build a shortlist around your family, your routines and the things you are unwilling to compromise on.'],
  ['Rental', 'Your next chapter, simplified.', 'Consider furnishing, tenancy terms and move-in timing alongside the monthly rent.'],
]
const properties = [
  { name: 'Space to slow down.', place: 'ECO BOTANIC / LANDED LIVING', image: 'landed.jpg', type: 'Garden residence', detail: 'Light-filled spaces. A quieter pace. A home with room for what comes next.', facts: ['LANDED', 'FAMILY LIVING', 'GARDEN OUTLOOK'] },
  { name: 'A lighter way to live.', place: 'DANGA BAY / HIGH-RISE LIVING', image: 'residence.jpg', type: 'Urban retreat', detail: 'Open interiors, considered materials and a new perspective on everyday living.', facts: ['CONDOMINIUM', 'OPEN-PLAN LIVING', 'URBAN OUTLOOK'] },
]
const steps = [['Discover', 'Tell me what matters.', 'Your priorities, budget and timeline set the direction.'], ['Shortlist', 'Less noise. Better options.', 'Compare a focused selection against your own criteria.'], ['View', 'Get a feel for the place.', 'Walk the space, explore the area and ask the useful questions.'], ['Decide', 'Put everything in perspective.', 'Review the trade-offs and costs before choosing your next step.'], ['Secure', 'Move forward, clearly.', 'Coordinate the next steps with the relevant property professionals.']]
function Mark({ number, children }) { return <p className="pa-kicker"><span>{number} /</span> {children}</p> }
export default function PropertyAdvisor() {
  const root = useRef(null), dialog = useRef(null)
  const [area, setArea] = useState(1), [lane, setLane] = useState(0), [property, setProperty] = useState(0), [step, setStep] = useState(0), [copied, setCopied] = useState(false)
  const selected = properties[property]
  const enquiry = `Hi Jason, I’m exploring ${lanes[lane][0].toLowerCase()} options around ${areas[area].name}. My budget is ___ and my timeline is ___.`
  const contact = () => { setCopied(false); dialog.current.showModal() }
  useLayoutEffect(() => {
    const previousTitle = document.title
    document.title = 'Jason Lim — Johor Property, Curated with Clarity | Ventora 06'
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.from('.pa-title-line > span', { yPercent: 110, stagger: .12, duration: 1.2, ease: 'power4.out' })
        gsap.from('.pa-hero-photo', { clipPath: 'inset(100% 0 0 0)', duration: 1.3, ease: 'power3.inOut' })
        gsap.utils.toArray('.pa-reveal').forEach(el => gsap.from(el, { y: 45, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } }))
        const mobile = window.matchMedia('(max-width: 800px)').matches
        // Native sticky stages retain their content even before JS or on fast scrolls.
        gsap.timeline({ scrollTrigger: { trigger: '.pa-hero', start: 'top top', end: 'bottom top', scrub: 1.1 } })
          .to('.pa-hero-architecture', { yPercent: 18, scale: 1.08, ease: 'none' }, 0)
          .to('.pa-hero-photo', { yPercent: mobile ? -4 : -13, rotationY: -5, ease: 'none' }, 0)
          .to('.pa-hero-photo img', { scale: 1.08, ease: 'none' }, 0)
          .to('.pa-hero-heading', { yPercent: mobile ? -5 : 12, xPercent: mobile ? 0 : -3, ease: 'none' }, 0)
          .to('.pa-hero-fragment-a', { yPercent: -45, xPercent: 9, ease: 'none' }, 0)
          .to('.pa-hero-fragment-b', { yPercent: -65, xPercent: -12, ease: 'none' }, 0)
        gsap.from('.pa-hero-fragment', { y: 90, opacity: 0, stagger: .15, duration: 1.6, ease: 'power3.out', delay: .25 })
        const routeLine = root.current.querySelector('.pa-map-route')
        const routeLength = routeLine.getTotalLength()
        gsap.set(routeLine, { strokeDasharray: routeLength })
        const planLine = root.current.querySelector('.pa-plan-lines path')
        const planLength = planLine.getTotalLength()
        gsap.set(planLine, { strokeDasharray: planLength })
        let lastArea = -1
        const mapTimeline = gsap.timeline({ scrollTrigger: {
          trigger: '.pa-area', start: 'top top', end: 'bottom bottom', scrub: .7,
          onUpdate: self => {
            const index = Math.min(5, Math.floor(self.progress / .125))
            if (index !== lastArea) { lastArea = index; setArea(areaSequence[index]) }
          },
        } })
        mapTimeline.fromTo('.pa-map-route', { strokeDashoffset: routeLength }, { strokeDashoffset: 0, duration: .72, ease: 'none' }, 0)
          .fromTo('.pa-map-art', { rotateX: 22, rotateZ: -7, scale: .91 }, { rotateX: 0, rotateZ: 0, scale: 1, duration: .72, ease: 'none' }, 0)
          .to('.pa-map-geography', { opacity: .08, duration: .2 }, .77)
          .to('.pa-map-route', { attr: { points: mapElevation }, strokeWidth: 2, duration: .23, ease: 'power2.inOut' }, .77)
          .fromTo('.pa-map-building', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: .23 }, .77)
          .to('.pa-map-marker-label', { opacity: 0, duration: .12 }, .77)
          .fromTo('.pa-map-transition', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .16 }, .84)
        const elevationPoints = [[20,64.47],[20,36.84],[43.33,36.84],[43.33,64.47],[78.33,64.47],[78.33,36.84]]
        areaSequence.forEach((areaIndex, i) => {
          mapTimeline.to(`.pa-map-node-${areaIndex}`, { left: `${elevationPoints[i][0]}%`, top: `${elevationPoints[i][1]}%`, duration: .23, ease: 'power2.inOut' }, .77)
        })
        gsap.timeline({ scrollTrigger: { trigger: '.pa-takeover', start: 'top top', end: 'bottom bottom', scrub: .9 } })
          .fromTo('.pa-plan-lines path', { strokeDashoffset: planLength }, { strokeDashoffset: 0, duration: .25, ease: 'none' }, 0)
          .fromTo('.pa-takeover .pa-section-top', { color: '#555c3d' }, { color: '#ffffff', duration: .2 }, .42)
          .fromTo('.pa-takeover-window', { clipPath: 'inset(28% 35% 28% 35%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .62, ease: 'power2.inOut' }, .12)
          .fromTo('.pa-takeover-image', { scale: 1.55, xPercent: -8 }, { scale: 1, xPercent: 0, duration: .8, ease: 'power2.inOut' }, 0)
          .to('.pa-property-plan', { scale: 1.3, opacity: 0, duration: .35 }, .35)
          .fromTo('.pa-shutter-left', { xPercent: 0 }, { xPercent: -110, duration: .5, ease: 'power2.inOut' }, .15)
          .fromTo('.pa-shutter-right', { xPercent: 0 }, { xPercent: 110, duration: .5, ease: 'power2.inOut' }, .15)
          .fromTo('.pa-property-copy', { y: 85, opacity: 0 }, { y: 0, opacity: 1, duration: .3 }, .48)
          .fromTo('.pa-property-bottom, .pa-property-disclaimer', { opacity: 0 }, { opacity: 1, duration: .15 }, .73)
          .to('.pa-takeover-image', { scale: 1.035, duration: .12 }, .88)
        gsap.to('.pa-progress', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: true } })
      }, root)
      return () => ctx.revert()
    })
    return () => { mm.revert(); document.title = previousTitle }
  }, [])
  return <div className="pa" ref={root}>
    <div className="pa-progress" />
    <header className="pa-nav"><a className="pa-logo" href="#pa-home">JL<span>JASON LIM<small>JOHOR PROPERTY ADVISOR</small></span></a><nav aria-label="Main navigation"><a href="#pa-areas">The locations</a><a href="#pa-selected">The selection</a><button onClick={contact}>Let’s talk <span>↗</span></button></nav></header>
    <main>
      <section className="pa-hero" id="pa-home">
        <div className="pa-edition"><span>VENTORA / MOTION STUDIES</span><span>06 — JOHOR PROPERTY ADVISOR</span></div>
        <div className="pa-hero-architecture" aria-hidden="true"><img src="/property-advisor/landed.jpg" alt=""/><span>RESIDENTIAL STUDY / JOHOR</span></div><div className="pa-hero-heading"><p className="pa-kicker"><i /> LOCAL KNOWLEDGE. A CLEARER PERSPECTIVE.</p><h1><span className="pa-title-line"><span>JOHOR PROPERTY,</span></span><span className="pa-title-line"><span>CURATED WITH</span></span><span className="pa-title-line pa-italic"><span>Clarity.</span></span></h1></div>
        <figure className="pa-hero-photo"><img src="/property-advisor/jason.jpg" alt="Editorial portrait of fictional advisor Jason Lim in an olive suit" fetchPriority="high"/><figcaption><span>YOUR LOCAL PERSPECTIVE</span><span>01° N / JOHOR BAHRU</span></figcaption></figure>
        <div className="pa-hero-fragment pa-hero-fragment-a" aria-hidden="true"><img src="/property-advisor/landed.jpg" alt=""/></div><div className="pa-hero-fragment pa-hero-fragment-b" aria-hidden="true"><img src="/property-advisor/residence.jpg" alt=""/></div><div className="pa-hero-depth-line" aria-hidden="true"><span>01 / A LOCAL PERSPECTIVE</span></div><div className="pa-hero-note"><span className="pa-spark">✳</span><p>Helping buyers, investors and families navigate new launches, subsales and high-potential areas across Johor Bahru.</p><a className="pa-link" href="#pa-selected">VIEW SELECTED PROPERTIES <span>↗</span></a><button className="pa-text-link" onClick={contact}>WHATSAPP NOW ↗</button></div>
        <div className="pa-hero-foot"><span>NEW LAUNCH · SUBSALE · INVESTMENT · OWN STAY</span><a href="#pa-areas">SCROLL TO GET YOUR BEARINGS ↓</a></div>
      </section>
      <section className="pa-area" id="pa-areas"><div className="pa-area-stage pa-section">
        <div className="pa-section-top"><Mark number="02">AREA INTELLIGENCE</Mark><span className="pa-micro">JOHOR BAHRU / ISKANDAR MALAYSIA</span></div>
        <h2>A place for every<br/><em>next chapter.</em></h2>
        <div className="pa-area-grid"><div className="pa-districts">{areaSequence.map(i=>{const a=areas[i];return <button key={a.name} onClick={()=>setArea(i)} aria-pressed={area===i} className={area===i?'is-active':''}><span>0{areaSequence.indexOf(i)+1}</span>{a.name}<b>↗</b></button>})}</div>
          <div className="pa-map"><div className="pa-map-art"><svg viewBox="0 0 600 380" preserveAspectRatio="none" aria-hidden="true"><defs><pattern id="pa-grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="currentColor" strokeWidth=".5"/></pattern></defs><rect width="600" height="380" fill="url(#pa-grid)"/><g className="pa-map-geography"><path className="pa-land" d="M12 25L109 14 160 35 230 18 285 37 362 16 440 38 493 24 582 60 590 230 550 280 490 255 455 300 402 277 359 311 320 294 285 332 235 305 190 320 142 287 93 298 65 260 12 278Z"/><path className="pa-map-contour" d="M35 75L125 55 200 74 275 53 370 67 470 60 553 94 556 221 485 207 431 257 353 265 277 284 214 257 155 265 94 232 40 243Z M65 110L150 91 240 108 315 82 398 110 488 99 520 145 499 182 424 206 355 229 281 239 217 225 146 236 102 200 65 207Z"/><g className="pa-roads"><path d="M30 45L170 80 240 150 370 170 500 240M120 0L180 110 145 260M320 0L300 100 350 240 405 300M500 0L430 100 360 180 210 220 20 200M0 110L150 130 250 80 410 80 600 130M560 0L515 160 580 270"/></g><text x="270" y="185" className="pa-map-region">ISKANDAR</text><text x="289" y="200" className="pa-map-region pa-map-region-small">MALAYSIA</text></g><polyline className="pa-map-route" points={mapPlan}/><g className="pa-map-building"><path d="M85 270H515M120 245V140L175 92H525L470 140V245M120 140H470M260 140V245M285 160H440V245M305 160V245M350 160V245M395 160V245M140 160H240V222H140ZM175 92V115H500M85 285H515M102 110V255M97 110H107M97 255H107"/><text x="325" y="313">ELEVATION / A—01</text></g></svg>{areas.map((a,i)=><div key={a.name} style={{left:`${a.x}%`,top:`${a.y}%`}} className={`pa-map-node pa-map-node-${i} ${area===i?'is-active':''}`}><button className="pa-map-pin" onClick={()=>setArea(i)} aria-label={`Explore ${a.name}`} aria-pressed={area===i}>{String(areaSequence.indexOf(i)+1).padStart(2,'0')}</button><span className="pa-map-marker-label">{a.name}</span></div>)}<span className="pa-water">STRAITS OF JOHOR</span><span className="pa-north">N ↑</span><span className="pa-map-coordinates">01° N / 103° E</span></div><div className="pa-map-transition">FROM A PLACE. <em>To a possibility.</em><span>↓</span></div><div className="pa-map-caption"><span>SCHEMATIC AREA STUDY / NOT TO SCALE</span><span>06 LOCATIONS</span></div><div className="pa-area-note" key={area} aria-live="polite"><span className="pa-micro">FIELD NOTE / 0{areaSequence.indexOf(area)+1}</span><h3>{areas[area].tag}</h3><p>{areas[area].text}</p></div></div>
        </div>
      </div></section>
      <section className="pa-focus pa-section" id="pa-focus"><div className="pa-section-top"><Mark number="03">YOUR PROPERTY, YOUR PURPOSE</Mark><span className="pa-micro">START WITH WHAT MATTERS</span></div><div className="pa-focus-grid"><div><h2 className="pa-reveal">Different plans.<br/><em>One clear direction.</em></h2><div className="pa-lane-note" key={lane} aria-live="polite"><span className="pa-spark">↗</span><h3>{lanes[lane][1]}</h3><p>{lanes[lane][2]}</p><a href="#pa-selected" className="pa-link">EXPLORE THE SELECTION <span>↗</span></a></div></div><div className="pa-lanes">{lanes.map((l,i)=><button key={l[0]} onClick={()=>setLane(i)} aria-pressed={lane===i} className={lane===i?'is-active':''}><small>0{i+1}</small><span>{l[0]}</span><b>↗</b></button>)}</div></div></section>
      <section className="pa-takeover" id="pa-selected"><div className="pa-takeover-stage"><div className="pa-takeover-window"><img className="pa-takeover-image" src={`/property-advisor/${selected.image}`} alt={`${selected.type} — illustrative property photography`}/><div className="pa-takeover-shade"/></div><div className="pa-shutter pa-shutter-left" aria-hidden="true"/><div className="pa-shutter pa-shutter-right" aria-hidden="true"/><div className="pa-property-plan" aria-hidden="true"><span>RESIDENCE STUDY / PLAN A—01</span><svg viewBox="0 0 1200 700"><g className="pa-plan-lines"><path d="M150 550H1050M210 520V220L350 120H1060L930 220V520M210 220H930M350 120V180H975M480 220V520M520 270H865V520M560 270V520M660 270V520M760 270V520M250 270H440V445H250ZM175 185V535M165 185H185M165 535H185M210 585H930M210 575V595M930 575V595"/></g></svg><p>THE ART OF <em>making room.</em></p><small>SCROLL TO EXPLORE THE RESIDENCE ↓</small></div><div className="pa-takeover-content"><div className="pa-section-top"><Mark number="04">THE CONSIDERED SELECTION</Mark><span className="pa-micro">0{property+1} / 02</span></div><div className="pa-property-copy"><div className="pa-property-title" key={property}><p className="pa-kicker">{selected.place}</p><h2>{selected.name.split(' ').slice(0,2).join(' ')}<br/><em>{selected.name.split(' ').slice(2).join(' ')}</em></h2><p>{selected.detail}</p><button className="pa-round-link" onClick={contact}>EXPLORE THIS DIRECTION <span>↗</span></button></div></div><div className="pa-property-bottom"><div>{selected.facts.map(f=><span key={f}>{f}</span>)}</div><div className="pa-property-controls"><button onClick={()=>setProperty((property+1)%2)} aria-label="Previous property">←</button><span>0{property+1} / 02</span><button onClick={()=>setProperty((property+1)%2)} aria-label="Next property">→</button></div></div><p className="pa-property-disclaimer">CONCEPT SELECTION · ILLUSTRATIVE IMAGERY · NOT AN ACTIVE LISTING</p></div></div></section>
      <section className="pa-about pa-section"><div className="pa-section-top"><Mark number="05">A PERSON, NOT A PORTAL</Mark><span className="pa-micro">MEET YOUR ADVISOR</span></div><div className="pa-about-grid"><figure className="pa-about-portrait pa-reveal"><img src="/property-advisor/jason-client-guidance.jpg" loading="lazy" alt="Jason Lim reviewing a floor plan with a buyer during a property viewing"/><figcaption>JASON LIM <span>林 / JOHOR BAHRU</span></figcaption></figure><div><h2 className="pa-reveal">Good property advice<br/>starts with<br/><em>understanding you.</em></h2><p className="pa-about-intro">A beautiful home is only part of the picture. I help bring the location, the numbers and your next chapter into focus.</p><div className="pa-values">{[['Local area understanding','Read the neighbourhood, not just the brochure.'],['Project comparison','See the meaningful differences side by side.'],['Buyer guidance','A considered answer to your next question.'],['Investment clarity','Understand the assumptions behind the numbers.'],['Negotiation support','Keep your priorities at the centre of the conversation.']].map(([title,text],i)=><div className="pa-reveal" key={title}><span>0{i+1}</span><h3>{title}<small>{text}</small></h3><b>↗</b></div>)}</div></div></div></section>
      <section className="pa-journey pa-section"><div className="pa-section-top"><Mark number="06">FROM FIRST THOUGHT TO NEXT CHAPTER</Mark><span className="pa-micro">A LITTLE LESS UNCERTAINTY</span></div><h2 className="pa-reveal">Your next move.<br/><em>Considered, together.</em></h2><div className="pa-steps">{steps.map((s,i)=><button key={s[0]} onClick={()=>setStep(i)} className={step===i?'is-active':''} aria-pressed={step===i}><span>0{i+1}<b>↗</b></span><strong>{s[0]}</strong></button>)}</div><div className="pa-step-note" key={step} aria-live="polite"><span>0{step+1} / {steps[step][0].toUpperCase()}</span><h3>{steps[step][1]}</h3><p>{steps[step][2]}</p></div></section>
      <section className="pa-close pa-section" id="pa-contact"><Mark number="07">THE NEXT CHAPTER IS YOURS</Mark><h2 className="pa-reveal">LET’S FIND<br/>YOUR <em>next move.</em></h2><div className="pa-close-row"><p>Johor property. A local perspective.<br/>A conversation worth having.</p><button onClick={contact}>WHATSAPP ME <span>↗</span></button></div><footer className="pa-footer"><a href="#pa-home">JASON LIM / JOHOR PROPERTY ADVISOR</a><span>FICTIONAL BRAND · VENTORA CONCEPT STUDY 06</span><a href="#pa-home">BACK TO TOP ↑</a></footer></section>
    </main>
    <dialog className="pa-dialog" ref={dialog} onClick={e=>{if(e.target===dialog.current)dialog.current.close()}}><button className="pa-dialog-close" aria-label="Close enquiry" onClick={()=>dialog.current.close()}>×</button><p className="pa-kicker">YOUR NEXT MOVE / DEMO ENQUIRY</p><h2>Let’s start<br/><em>with you.</em></h2><p>Jason Lim is a fictional advisor. This preview prepares your enquiry; no message is sent.</p><label htmlFor="pa-enquiry">YOUR CONVERSATION STARTER</label><textarea id="pa-enquiry" key={enquiry} defaultValue={enquiry}/><button className="pa-copy" onClick={async()=>{try{await navigator.clipboard.writeText(document.getElementById('pa-enquiry').value);setCopied(true)}catch{document.getElementById('pa-enquiry').select();setCopied(false)}}}>{copied?'COPIED ✓':'COPY ENQUIRY ↗'}</button><span role="status">{copied?'Your enquiry is copied.':''}</span></dialog>
  </div>
}
