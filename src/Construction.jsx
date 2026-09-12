import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './Construction.css'

gsap.registerPlugin(ScrollTrigger)

const A = '/assets/construction/'
const projects = [
  { no: '01', title: 'RIDGE HOUSE', location: 'Austin, TX', year: '2026', type: 'Residential', area: '4,800 SQ FT', image: `${A}ridge-house.png` },
  { no: '02', title: 'FRAME 07', location: 'Portland, OR', year: '2025', type: 'Civic / Cultural', area: '38,200 SQ FT', image: `${A}frame-07.png` },
  { no: '03', title: 'CONCRETE COURTYARD', location: 'Marfa, TX', year: '2026', type: 'Residential', area: '6,100 SQ FT', image: `${A}courtyard.png` },
]
const metrics = [
  { value: '18', label: 'YEARS' },
  { value: '42', label: 'PROJECTS' },
  { value: '7', label: 'CITIES' },
  { value: '5', suffix: 'M', label: 'SQ FT' },
]
const gallery = [
  ['01 / RESIDENTIAL', 'gallery-01.png'], ['02 / COMMERCIAL', 'gallery-02.png'], ['03 / INTERIOR', 'gallery-03.png'], ['04 / MATERIAL', 'gallery-04.png'], ['05 / DETAIL', 'gallery-05.png'],
]
const stages = [
  ['01', 'DEFINE', 'Scope, priorities and constraints.'], ['02', 'DESIGN', 'Structure, material and experience.'], ['03', 'BUILD', 'Precision in execution.'], ['04', 'DELIVER', 'A finished space built to last.'],
]

function TechnicalGrid() { return <div className="c-grid" aria-hidden="true">{Array.from({ length: 7 }, (_, i) => <i key={i} />)}</div> }

function Header() { return <header className="c-header"><a href="#c-top" className="c-mark">M<span>—</span></a><p>MONUMENT<br />BUILD / ARCHITECTURE</p><nav><a href="#projects">PROJECTS</a><a href="#process">PROCESS</a><a href="#contact">CONTACT</a></nav></header> }

function Hero() { return <section className="c-hero" id="c-top"><TechnicalGrid /><div className="c-hero-media"><img src={`${A}hero.png`} alt="Monumental concrete residence cantilevered over a rocky slope" /></div><div className="c-hero-meta c-mono"><span>34.0522° N</span><span>118.2437° W</span><span>EST. 2008</span></div><h1 aria-label="Monument">{'MONUMENT'.split('').map((l, i) => <span key={i}>{l}</span>)}</h1><p className="c-hero-tag">WE BUILD<br />WHAT OUTLASTS US.</p><p className="c-scroll c-mono">SCROLL TO ENTER <b>↓</b></p></section> }

function Philosophy() { return <section className="c-philosophy"><TechnicalGrid /><div className="c-ph-copy"><p className="c-section-label c-mono">02 / POSITION</p><h2><span className="ph-a">BUILT FOR</span><span className="ph-b">THE NEXT</span><span className="ph-c">50 YEARS.</span></h2><p>Architecture, construction and built environments designed<br />for longevity, precision and presence.</p></div><div className="c-material"><img src={`${A}material.png`} alt="Concrete, blackened steel and oak architectural joint" /><span className="c-mono">MAT—04 / BOARD FORMED CONCRETE</span></div><div className="c-coords c-mono">GRID C.04<br />DIM 8200 × 4600<br />TOL ± 2MM</div></section> }

function ProjectShowcase() { return <section className="c-projects" id="projects"><div className="c-project-sticky"><p className="c-section-label c-mono">03 / SELECTED WORKS</p><div className="c-project-images">{projects.map((p, i) => <div className={`c-project-image pi-${i}`} key={p.title}><img src={p.image} alt={`${p.title} architectural project`} /></div>)}</div><div className="c-project-copy">{projects.map((p, i) => <article className={`c-project-info pinfo-${i}`} key={p.title}><strong>{p.no}</strong><h2>{p.title}</h2><dl><div><dt>LOCATION</dt><dd>{p.location}</dd></div><div><dt>YEAR</dt><dd>{p.year}</dd></div><div><dt>TYPE</dt><dd>{p.type}</dd></div><div><dt>AREA</dt><dd>{p.area}</dd></div></dl></article>)}</div><div className="c-project-progress"><i /><span className="c-mono">01 — 03</span></div></div></section> }

function Scale() { return <section className="c-scale"><p className="c-section-label c-mono">04 / PRACTICE AT SCALE</p><div className="c-scale-image"><img src={`${A}gallery-04.png`} alt="Weathered steel facade detail" /></div><div className="c-metrics">{metrics.map(({ value, suffix, label }) => <div key={label}><strong><i>{value}</i>{suffix && <small>{suffix}</small>}</strong><span>{label}</span></div>)}</div><p className="c-scale-note c-mono">FICTIONAL PRACTICE METRICS / DEMONSTRATION ONLY</p></section> }

function Gallery() { return <section className="c-gallery"><div className="c-gallery-sticky"><div className="c-gallery-title"><span className="c-mono">05 / FIELD NOTES</span><h2>BUILT<br />STUDIES</h2></div><div className="c-gallery-rail">{gallery.map(([label, file], i) => <figure className={`g-${i + 1}`} key={label}><div><img src={`${A}${file}`} alt={`${label} architectural study`} /></div><figcaption className="c-mono">{label}</figcaption></figure>)}</div></div></section> }

function Process() { return <section className="c-process" id="process"><div className="c-process-head"><p className="c-section-label c-mono">06 / METHOD</p><h2>ONE LINE.<br />FOUR PHASES.</h2></div><div className="c-process-line"><i /></div><div className="c-stages">{stages.map(([n, title, copy]) => <article key={title}><span className="c-mono">{n}</span><h3>{title}</h3><p>{copy}</p><b /></article>)}</div></section> }

function Bridge() { return <section className="c-bridge"><div className="c-bridge-sticky"><h2 aria-hidden="true">FORM<br />FOLLOWS<br />RESOLVE.</h2><div className="c-bridge-frame"><img src={`${A}bridge.png`} alt="Monumental concrete colonnade opening to a bright landscape" /></div><p className="c-mono">07 / THRESHOLD — 38M AXIS</p></div></section> }

function Footer() { return <footer className="c-footer" id="contact"><TechnicalGrid /><p className="c-section-label c-mono">08 / START A CONVERSATION</p><h2>BUILD SOMETHING<br /><span>THAT STAYS.</span></h2><div className="c-footer-bottom"><p>Design and construction for brands, spaces and businesses<br />that want to be remembered for what they built.</p><div><a href="mailto:studio@monument.example">START A PROJECT <b>↗</b></a><a href="#process">VIEW CAPABILITIES →</a></div></div><div className="c-footer-rule c-mono"><span>MONUMENT® / 2026</span><span>34.0522° N — 118.2437° W</span><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>TOP ↑</button></div></footer> }

export default function Construction() {
  const root = useRef(null)
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'MONUMENT — Build / Architecture'
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return () => { document.title = previousTitle }
    const lenis = new Lenis({ duration: 1.35, smoothWheel: true })
    const tick = t => lenis.raf(t * 1000)
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0); lenis.on('scroll', ScrollTrigger.update)
    return () => { document.title = previousTitle; gsap.ticker.remove(tick); lenis.destroy() }
  }, [])
  useLayoutEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } }).from('.c-header', { y: -35, opacity: 0, duration: 1 }).from('.c-hero-media', { clipPath: 'inset(12% 0 0 0)', scale: 1.1, duration: 1.4 }, '-=.7').from('.c-hero h1 span', { yPercent: 110, stagger: .045, duration: 1.1 }, '-=1').from('.c-hero-tag,.c-hero-meta,.c-scroll', { opacity: 0, duration: .7, stagger: .1 }, '-=.5')
      const heroTl = gsap.timeline({ scrollTrigger: { trigger: '.c-hero', start: 'top top', end: 'bottom top', scrub: 1.1 } })
      heroTl.to('.c-hero-media', { inset: '13vh 6vw -22vh 39vw', scale: .98 }, 0).to('.c-hero-media img', { scale: 1.04 }, 0).to('.c-hero h1 span', { x: i => (i - 3.5) * 12 }, 0).to('.c-hero .c-grid', { opacity: .34 }, 0).to('.c-hero-meta', { y: -50 }, 0).to('.c-hero-tag', { y: 70 }, 0)
      gsap.from('.c-material', { xPercent: 28, clipPath: 'inset(0 0 0 58%)', scrollTrigger: { trigger: '.c-philosophy', start: 'top 94%', end: '42% center', scrub: .85 } })
      gsap.fromTo('.c-material img', { yPercent: -4, scale: 1.07 }, { yPercent: 4, scale: 1.02, ease: 'none', scrollTrigger: { trigger: '.c-philosophy', start: 'top bottom', end: 'bottom top', scrub: 1.1 } })
      gsap.fromTo('.c-philosophy .c-grid', { xPercent: -1.5, opacity: .04 }, { xPercent: 1.5, opacity: .16, ease: 'none', scrollTrigger: { trigger: '.c-philosophy', start: 'top 88%', end: 'bottom 30%', scrub: 1 } })
      gsap.from('.ph-a', { yPercent: 64, scrollTrigger: { trigger: '.c-philosophy', start: 'top 82%', end: '48% center', scrub: .75 } }); gsap.from('.ph-b', { clipPath: 'inset(0 0 52% 0)', scrollTrigger: { trigger: '.c-philosophy', start: 'top 82%', end: '45% center', scrub: .72 } }); gsap.from('.ph-c', { xPercent: -20, scrollTrigger: { trigger: '.c-philosophy', start: 'top 78%', end: '52% center', scrub: .78 } })
      const ptl = gsap.timeline({ scrollTrigger: { trigger: '.c-projects', start: 'top top', end: 'bottom bottom', scrub: .7 } })
      ptl.to('.pi-0', { clipPath: 'inset(0 100% 0 0)', scale: .94, duration: 1 }, 1).fromTo('.pi-1', { clipPath: 'inset(0 0 0 100%)', scale: 1.08 }, { clipPath: 'inset(0 0 0 0)', scale: 1, duration: 1 }, 1).to('.pinfo-0', { opacity: 0, y: -35, duration: .25 }, 1).to('.pinfo-1', { opacity: 1, y: 0, duration: .35 }, 1.3).to('.pi-1', { clipPath: 'inset(0 100% 0 0)', scale: .94, duration: 1 }, 2.2).fromTo('.pi-2', { clipPath: 'inset(0 0 0 100%)', scale: 1.08 }, { clipPath: 'inset(0)', scale: 1, duration: 1 }, 2.2).to('.pinfo-1', { opacity: 0, y: -35, duration: .25 }, 2.2).to('.pinfo-2', { opacity: 1, y: 0, duration: .35 }, 2.5).to('.c-project-progress i', { scaleX: 1, duration: 3.2 }, 0)
      gsap.from('.c-metrics strong i', { textContent: 0, snap: { textContent: 1 }, stagger: .12, duration: 1.35, scrollTrigger: { trigger: '.c-scale', start: 'top 72%', toggleActions: 'play none none reverse' } })
      const rail = document.querySelector('.c-gallery-rail'); const galleryTween = gsap.to(rail, { x: () => -(rail.scrollWidth - innerWidth + innerWidth * .08), ease: 'none', scrollTrigger: { trigger: '.c-gallery', start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true } })
      gsap.to('.c-gallery-title', { xPercent: -15, scrollTrigger: { trigger: '.c-gallery', start: 'top top', end: 'bottom bottom', scrub: 1 } }); gsap.utils.toArray('.c-gallery figure img').forEach(img => gsap.fromTo(img, { xPercent: -6, scale: 1.12 }, { xPercent: 6, scale: 1.02, ease: 'none', scrollTrigger: { trigger: img.closest('figure'), containerAnimation: galleryTween, start: 'left right', end: 'right left', scrub: true } }))
      gsap.utils.toArray('.c-stages article').forEach((el) => gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 65%', end: 'bottom 40%', scrub: .5 } }).to(el, { opacity: 1 }).to(el.querySelector('b'), { scaleX: 1 }, 0).to(el.querySelector('h3'), { x: 18 }, 0))
      gsap.to('.c-process-line i', { scaleX: 1, scrollTrigger: { trigger: '.c-process', start: 'top 65%', end: 'bottom 65%', scrub: 1 } })
      gsap.timeline({ scrollTrigger: { trigger: '.c-bridge', start: 'top top', end: 'bottom bottom', scrub: 1 } }).fromTo('.c-bridge-frame', { inset: '18vh 31vw' }, { inset: 0, duration: .7 }).fromTo('.c-bridge-frame img', { scale: 1.24 }, { scale: 1.03, duration: 1 }, 0).to('.c-bridge h2,.c-bridge-sticky>p', { opacity: 0, duration: .25 }, .35)
      gsap.from('.c-footer h2 span', { xPercent: 16, scrollTrigger: { trigger: '.c-footer', start: 'top 80%', end: 'center center', scrub: 1 } })
    }, root)
    return () => ctx.revert()
  }, [])
  return <main className="construction" ref={root}><Header /><Hero /><Philosophy /><ProjectShowcase /><Scale /><Gallery /><Process /><Bridge /><Footer /></main>
}
