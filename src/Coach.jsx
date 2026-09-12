import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './Coach.css'

gsap.registerPlugin(ScrollTrigger)

const A = '/assets/coach/'
const stages = [
  { n: '01', name: 'POSITION', line: 'Make the value obvious.', image: `${A}close-portrait.png` },
  { n: '02', name: 'PRESENCE', line: 'Make the perception match.', image: `${A}detail.png` },
  { n: '03', name: 'CONVERT', line: 'Make the next step inevitable.', image: `${A}movement.png` },
]
// Fictional concept metrics — replace with verified client outcomes in production.
const demoMetrics = [['+47%', 'Qualified enquiries'], ['3×', 'Profile-to-call conversion'], ['12 weeks', 'Positioning transformation']]

function Header() {
  return <header className="c-head"><a href="/coach" className="c-logo">ÉLAN<small>PRIVATE PERFORMANCE</small></a><div className="c-head-center">Private advisory<br />By application</div><a className="c-nav" href="#enquire">Enquire <span>↗</span></a></header>
}

function Hero() {
  return <section className="c-hero" id="coach-top">
    <div className="c-hero-light" aria-hidden="true" />
    <div className="c-hero-back" aria-label="Become harder to ignore"><span>BECOME</span><span>HARDER TO</span><span>IGNORE.</span></div>
    <div className="c-hero-photo"><div className="c-hero-photo-inner"><img src={`${A}hero-founder.png`} alt="Founder in an espresso suit, standing in directional architectural light" /></div></div>
    <div className="c-hero-front" aria-hidden="true"><span>HARDER TO</span><span>IGNORE.</span></div>
    <p className="c-hero-copy">Private performance and positioning for ambitious founders, experts and personal brands ready to become impossible to overlook.</p>
    <div className="c-hero-meta"><span>Private Performance / 2026</span><span>Strategy · Presence · Conversion</span></div>
    <div className="c-scroll">Scroll to begin <i>↓</i></div>
  </section>
}

function Manifesto() {
  return <section className="c-manifesto"><div className="c-manifest-sticky">
    <p className="c-label">00 / The new standard</p>
    <div className="c-values" aria-hidden="true"><span>CLARITY.</span><span>PRESENCE.</span><span>AUTHORITY.</span><span>MOMENTUM.</span></div>
    <h2><span>YOUR BRAND SHOULD</span><span>FEEL AS <i>STRONG</i></span><span>AS YOUR OFFER.</span></h2>
    <p className="c-manifest-note">Not louder. More exact.</p>
  </div></section>
}

function Story() {
  return <section className="c-story">
    <p className="c-label">01 / The person behind the brand</p>
    <div className="c-story-image"><img src={`${A}close-portrait.png`} alt="Close portrait in cream silk and espresso tailoring" /></div>
    <div className="c-story-copy"><h2><span>YOU DON'T NEED</span><span>TO BECOME <i>LOUDER.</i></span><span>YOU NEED TO BECOME</span><span>CLEARER.</span></h2><p>Private strategy for people whose work is already strong — but whose positioning, presence and digital expression haven't caught up yet.</p></div>
    <div className="c-story-giant" aria-hidden="true">BECOME CLEARER</div>
    <div className="c-story-index"><span>01 / Position</span><span>02 / Presence</span><span>03 / Conversion</span></div>
  </section>
}

function Method() {
  return <section className="c-method"><div className="c-method-sticky">
    <div className="c-method-top"><p className="c-label">02 / The signature method</p><p>One system.<br />Three decisive shifts.</p></div>
    <div className="c-method-images">{stages.map((s, i) => <figure className={`c-method-image mi-${i}`} key={s.name}><img src={s.image} alt="" /></figure>)}</div>
    <div className="c-stage-number"><span>01</span><span>02</span><span>03</span></div>
    <div className="c-stage-list">{stages.map(s => <article key={s.name}><span>{s.n}</span><h3>{s.name}</h3><p>{s.line}</p></article>)}</div>
    <div className="c-method-rule" />
  </div></section>
}

const frames = [
  { n: '01', lines: ['YOU ARE ALREADY', 'THE EXPERT.'], image: 'movement.png' },
  { n: '02', lines: ['NOW LOOK', 'LIKE ONE.'], image: 'detail.png' },
  { n: '03', lines: ['BUILD A BRAND', 'PEOPLE REMEMBER.'], image: 'hero-founder.png' },
]
function EditorialRail() {
  return <section className="c-rail-section"><div className="c-rail">{frames.map((f, i) => <article className={`c-frame cf-${i}`} key={f.n}><span className="c-frame-no">{f.n} / 03</span><div className="c-frame-image"><img src={`${A}${f.image}`} alt="" /></div><h2>{f.lines.map(x => <span key={x}>{x}</span>)}</h2></article>)}</div></section>
}

function Results() {
  return <section className="c-results"><img src={`${A}detail.png`} alt="" /><p className="c-label">03 / Selected shifts · Concept data</p><h2><span>FROM</span><span>OVERLOOKED</span><i>TO</i><span>REFERRED.</span></h2><div className="c-metrics">{demoMetrics.map(([value, label]) => <div key={value}><strong data-value={value}>{value}</strong><span>{label}</span></div>)}</div></section>
}

function Final() {
  return <section className="c-final" id="enquire"><div className="c-final-photo"><img src={`${A}hero-founder.png`} alt="Founder silhouette in architectural light" /></div><p className="c-label">04 / Private performance</p><h2><span>READY TO BECOME</span><span>HARDER TO <i>IGNORE?</i></span></h2><div className="c-final-bottom"><a href="mailto:private@elan.example">START YOUR NEXT CHAPTER <b>↗</b></a><span>PRIVATE ENQUIRY →</span><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top ↑</button></div></section>
}

function Coach() {
  const root = useRef(null)
  useEffect(() => {
    document.title = 'ÉLAN — Private Performance'
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true })
    const raf = t => lenis.raf(t * 1000)
    gsap.ticker.add(raf); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(raf); lenis.destroy(); document.title = 'Ventora Concept Lab' }
  }, [])
  useLayoutEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const mm = gsap.matchMedia()
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power4.out' } }).from('.c-head', { y: -25, opacity: 0, duration: .8 }).from('.c-hero-back span', { yPercent: 110, duration: 1.15, stagger: .1 }, '-=.4').from('.c-hero-photo', { clipPath: 'polygon(35% 0,65% 0,58% 100%,42% 100%)', scale: .92, duration: 1.4 }, '-=1').from('.c-hero-copy,.c-hero-meta,.c-scroll', { opacity: 0, y: 15, stagger: .08 }, '-=.65')
      gsap.timeline({ scrollTrigger: { trigger: '.c-hero', start: 'top top', end: 'bottom top', scrub: 1 } }).to('.c-hero-back span:nth-child(1)', { xPercent: -10 }, 0).to('.c-hero-back span:nth-child(2)', { xPercent: 8 }, 0).to('.c-hero-front', { xPercent: -7 }, 0).to('.c-hero-photo', { scale: 1.12, clipPath: 'polygon(8% 0,100% 0,90% 100%,0 100%)' }, 0).to('.c-hero-photo img', { yPercent: 8, scale: 1.08 }, 0).to('.c-hero-light', { xPercent: 70 }, 0)
      gsap.timeline({ scrollTrigger: { trigger: '.c-manifesto', start: 'top top', end: 'bottom bottom', scrub: 1 } }).to('.c-manifest-sticky', { backgroundColor: '#3a2118', color: '#f3ede2', duration: .18 }).fromTo('.c-values span:nth-child(1)', { xPercent: -110 }, { xPercent: 0, duration: .18 }, 0).fromTo('.c-values span:nth-child(2)', { xPercent: 110 }, { xPercent: 0, duration: .18 }, .12).fromTo('.c-values span:nth-child(3)', { scale: .25, letterSpacing: '.3em', opacity: 0 }, { scale: 1, letterSpacing: '-.07em', opacity: 1, duration: .2 }, .28).fromTo('.c-values span:nth-child(4)', { xPercent: -110 }, { xPercent: 0, duration: .18 }, .44).to('.c-values', { opacity: 0, scale: 1.2, duration: .16 }, .6).fromTo('.c-manifest-sticky h2', { opacity: 0 }, { opacity: 1, duration: .08 }, .72).from('.c-manifest-sticky h2 span', { yPercent: 110, stagger: .05, duration: .2 }, .73).to('.c-manifest-sticky', { backgroundColor: '#efe8dc', color: '#211711', duration: .14 }, .88)
      gsap.fromTo('.c-story-image', { clipPath: 'inset(100% 0 0)' }, { clipPath: 'inset(0% 0 0)', scrollTrigger: { trigger: '.c-story', start: 'top 78%', end: 'center 48%', scrub: .8 } })
      gsap.fromTo('.c-story-image img', { yPercent: -10, scale: 1.14 }, { yPercent: 10, scale: 1.02, scrollTrigger: { trigger: '.c-story', start: 'top bottom', end: 'bottom top', scrub: 1 } })
      gsap.from('.c-story-copy h2 span', { yPercent: 115, stagger: .08, scrollTrigger: { trigger: '.c-story-copy', start: 'top 75%', end: 'center 50%', scrub: .7 } })
      gsap.to('.c-story-giant', { xPercent: -22, scrollTrigger: { trigger: '.c-story', start: 'top bottom', end: 'bottom top', scrub: 1 } })
      const methodTl = gsap.timeline({ scrollTrigger: { trigger: '.c-method', start: 'top top', end: 'bottom bottom', scrub: .8 } })
      stages.forEach((s, i) => { const t = i / 3; if (i) methodTl.to(`.mi-${i-1}`, { opacity: 0, scale: 1.1, duration: .08 }, t).fromTo(`.mi-${i}`, { opacity: 0, clipPath: 'inset(0 100% 0 0)' }, { opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: .16 }, t); methodTl.to('.c-stage-number', { yPercent: -i * 33.333, duration: .14 }, t).to('.c-stage-list', { y: -i * 100 + 'vh', duration: .18 }, t) })
      mm.add('(min-width: 761px)', () => {
        const rail = document.querySelector('.c-rail'); const distance = () => rail.scrollWidth - innerWidth
        const tween = gsap.to(rail, { x: () => -distance(), ease: 'none', scrollTrigger: { trigger: '.c-rail-section', start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: .8, invalidateOnRefresh: true } })
        gsap.utils.toArray('.c-frame-image img').forEach(img => gsap.fromTo(img, { xPercent: -7, scale: 1.12 }, { xPercent: 7, scale: 1.02, scrollTrigger: { trigger: img.closest('.c-frame'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } }))
      })
      gsap.from('.c-results h2 span,.c-results h2 i', { yPercent: 110, stagger: .08, scrollTrigger: { trigger: '.c-results', start: 'top 65%', end: 'center 45%', scrub: .8 } })
      gsap.from('.c-metrics>div', { x: 70, opacity: 0, stagger: .1, scrollTrigger: { trigger: '.c-metrics', start: 'top 80%' } })
      gsap.from('.c-final h2 span', { yPercent: 110, stagger: .12, scrollTrigger: { trigger: '.c-final', start: 'top 62%', end: 'center 44%', scrub: .8 } }); gsap.from('.c-final-photo', { clipPath: 'inset(0 0 100% 0)', yPercent: 15, scrollTrigger: { trigger: '.c-final', start: 'top 68%', end: 'center 41%', scrub: .8 } }); gsap.from('.c-final-bottom', { '--line-fill': '0%', scrollTrigger: { trigger: '.c-final-bottom', start: 'top 90%', end: 'top 65%', scrub: true } })
    }, root)
    return () => { ctx.revert(); mm.revert() }
  }, [])
  useEffect(() => {
    const el = root.current?.querySelector('.c-hero'); if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const move = e => { const x = e.clientX / innerWidth - .5; const y = e.clientY / innerHeight - .5; gsap.to('.c-hero-photo-inner', { x: x * -8, y: y * -6, duration: 1.5, overwrite: true }); gsap.to('.c-hero-light', { x: x * 18, y: y * 10, duration: 2, overwrite: true }) }
    el.addEventListener('pointermove', move); return () => el.removeEventListener('pointermove', move)
  }, [])
  return <main className="coach" ref={root}><Header /><Hero /><Manifesto /><Story /><Method /><EditorialRail /><Results /><Final /></main>
}

export default Coach
