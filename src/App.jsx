import { useEffect, useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  { number: '01', title: 'Flux', type: 'Spatial identity', image: '/assets/chrome-ribbon.png', format: 'wide' },
  { number: '02', title: 'Monolith', type: 'Digital flagship', image: '/assets/monolith.png', format: 'tall' },
  { number: '03', title: 'Mercury', type: 'Moving image', image: '/assets/mercury-orb.png', format: 'square' },
  { number: '04', title: 'Red Void', type: 'Spatial film', image: '/assets/red-void.png', format: 'cinema' },
]

function MagneticLink({ children, href = '#' }) {
  return <motion.a href={href} whileHover={{ x: 7 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} onClick={(event) => href === '#' && event.preventDefault()}>{children}<span aria-hidden="true">↗</span></motion.a>
}

function Header() {
  return <header className="site-header"><a className="brand" href="#top" aria-label="NOEMA home">NØ</a><p>Independent creative practice<br />Kuala Lumpur · 2026</p><a className="menu-link" href="#contact">Let’s talk <i aria-hidden="true" /></a></header>
}

function Hero() {
  return <section className="hero" id="top"><div className="hero-orbit orbit-one" aria-hidden="true" /><div className="hero-orbit orbit-two" aria-hidden="true" /><p className="hero-kicker">Selected experiments<br />in form and motion</p><h1 className="hero-title hero-title-back" aria-label="Matter in motion"><span className="title-line line-one">MATTER</span><span className="title-line line-two"><em>IN</em> MOTION</span></h1><div className="hero-art"><div className="hero-parallax"><img src="/assets/hero-knot.png" alt="Coiled liquid-chrome sculpture intersected by a red glass plane" /></div></div><div className="hero-word-front" aria-hidden="true">MOTION</div><div className="hero-index"><span>NOEMA®</span><span>VOL. 04</span></div><div className="scroll-cue"><span>Scroll to enter</span><b aria-hidden="true">↓</b></div></section>
}

function Intro() {
  return <section className="intro section-light"><div className="intro-ghost" aria-hidden="true"><div /><div /></div><img className="intro-object" src="/assets/mercury-orb.png" alt="" /><p className="eyebrow">/ Practice</p><div className="intro-copy"><p>We build <span>visual systems</span></p><p>that refuse to sit still.</p></div><div className="intro-meta"><span>Strategy</span><span>Identity</span><span>Digital</span><span>Motion</span></div></section>
}

function Feature() {
  return <section className="feature"><div className="feature-sticky"><div className="feature-media"><img src="/assets/chrome-ribbon.png" alt="Abstract chrome sculpture intersecting a red plane" /><div className="feature-shade" /></div><div className="feature-copy"><p><span>01</span> Featured study</p><h2>CHROME<br /><i>FLUX</i></h2><div className="feature-bottom"><p>A study in tension,<br />reflection and velocity.</p><p>2026 / CGI</p></div></div></div></section>
}

function WorkRail() {
  return <section className="work"><div className="work-head"><p className="eyebrow">/ Selected work</p><p>Drag your eyes<br />across the frame</p></div><div className="rail-wrap"><div className="rail">{projects.map((project) => <article className={`project project-${project.format}`} key={project.title}><div className="project-image"><img src={project.image} alt={`${project.title} abstract artwork`} /><span>{project.number}</span></div><div className="project-caption"><h3>{project.title}</h3><p>{project.type}<br />2026</p></div></article>)}</div></div></section>
}

function FullscreenBridge() {
  return <section className="bridge"><div className="bridge-sticky"><div className="bridge-type" aria-hidden="true">ENTER<br /><i>THE VOID</i></div><div className="bridge-frame"><img src="/assets/red-void.png" alt="A translucent red volume suspended in a dark architectural chamber" /></div><p className="bridge-label">04 / RED VOID — SPATIAL FILM</p></div></section>
}

function Manifesto() {
  const text = 'DESIGN SHOULD MOVE BEFORE IT IS UNDERSTOOD'
  return <section className="manifesto"><p className="eyebrow">/ Principle 04</p><h2>{text.split(' ').map((word, index) => <span className="manifest-word" key={`${word}-${index}`}>{word}&nbsp;</span>)}</h2><div className="manifesto-foot"><span>Clarity through tension.</span><span>No decoration without consequence.</span></div></section>
}

function Footer() {
  return <footer id="contact"><div className="footer-orbit" aria-hidden="true"><i /></div><p className="eyebrow">/ Available for select collaborations</p><h2>MAKE<br /><i>CONTACT</i></h2><div className="footer-row"><MagneticLink href="mailto:studio@noema.example">studio@noema.example</MagneticLink><p>© 2026 NØEMA<br />Kuala Lumpur</p><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top ↑</button></div></footer>
}

function App() {
  const root = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    const update = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    lenis.on('scroll', ScrollTrigger.update)
    return () => { gsap.ticker.remove(update); lenis.destroy() }
  }, [])

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power4.out' } }).from('.site-header', { y: -30, opacity: 0, duration: 1 }).from('.title-line', { yPercent: 115, rotate: 2, duration: 1.35, stagger: 0.12 }, '-=.7').from('.hero-kicker, .hero-index, .scroll-cue', { opacity: 0, y: 20, duration: .8, stagger: .08 }, '-=.7')
      gsap.to('.hero-art', { yPercent: 16, rotate: 2.5, scale: 1.05, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } })
      gsap.to('.hero-word-front', { xPercent: 4, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } })
      gsap.to('.orbit-one', { rotate: 140, xPercent: 18, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } })
      gsap.to('.orbit-two', { rotate: -100, yPercent: -30, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } })
      gsap.from('.intro-copy p', { yPercent: 110, rotate: 1.5, stagger: .12, scrollTrigger: { trigger: '.intro', start: 'top 72%', end: 'center 55%', scrub: .7 } })
      gsap.to('.intro-object', { yPercent: -34, xPercent: -8, rotate: -10, scale: 1.08, scrollTrigger: { trigger: '.intro', start: 'top bottom', end: 'bottom top', scrub: 1 } })
      gsap.to('.intro-ghost', { rotate: 24, xPercent: -5, scrollTrigger: { trigger: '.intro', start: 'top bottom', end: 'bottom top', scrub: 1.2 } })
      gsap.timeline({ scrollTrigger: { trigger: '.feature', start: 'top top', end: 'bottom bottom', scrub: 1 } }).fromTo('.feature-media', { clipPath: 'inset(12% 32% 12% 32% round 2px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut' }).fromTo('.feature-media img', { scale: 1.3 }, { scale: 1, ease: 'power2.out' }, 0).from('.feature-copy', { opacity: 0, y: 90 }, .25).to('.feature-shade', { opacity: .48 }, .55).to('.feature-copy h2', { xPercent: -3 }, .55)
      const rail = document.querySelector('.rail')
      const wrap = document.querySelector('.rail-wrap')
      const railTween = gsap.to(rail, { x: () => -(rail.scrollWidth - window.innerWidth + 120), ease: 'none', scrollTrigger: { trigger: wrap, start: 'top top', end: () => `+=${rail.scrollWidth * .72}`, pin: true, scrub: .8, invalidateOnRefresh: true } })
      gsap.utils.toArray('.project').forEach((project) => {
        const image = project.querySelector('.project-image img')
        gsap.timeline({ scrollTrigger: { trigger: project, containerAnimation: railTween, start: 'left 92%', end: 'right 8%', scrub: .7 } }).fromTo(project, { scale: .88, opacity: .48 }, { scale: 1, opacity: 1, duration: .42, ease: 'power2.out' }).to(project, { scale: .91, opacity: .58, duration: .58, ease: 'power2.in' })
        gsap.fromTo(project.querySelector('.project-image'), { clipPath: 'inset(8% 14% 8% 14%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power3.out', scrollTrigger: { trigger: project, containerAnimation: railTween, start: 'left 95%', end: 'center 55%', scrub: .65 } })
        gsap.fromTo(image, { xPercent: -8, scale: 1.18 }, { xPercent: 8, scale: 1.03, ease: 'none', scrollTrigger: { trigger: project, containerAnimation: railTween, start: 'left right', end: 'right left', scrub: true } })
      })
      gsap.timeline({ scrollTrigger: { trigger: '.bridge', start: 'top top', end: 'bottom bottom', scrub: .75 } }).fromTo('.bridge-frame', { clipPath: 'inset(16% 24% 16% 24%)', scale: .82 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: .48, ease: 'power3.inOut' }).fromTo('.bridge-frame img', { scale: 1.3 }, { scale: 1, duration: .58, ease: 'power2.out' }, 0).to('.bridge-type', { opacity: 0, scale: 1.1, filter: 'blur(10px)', duration: .3 }, .28).to('.bridge-label', { color: '#ff3c18', duration: .12 }, .55).to('.bridge-frame img', { scale: 1.025, duration: .42, ease: 'none' }, .58)
      gsap.from('.manifest-word', { opacity: .08, y: 50, rotateX: -60, stagger: .08, transformOrigin: '50% 100%', scrollTrigger: { trigger: '.manifesto h2', start: 'top 76%', end: 'bottom 40%', scrub: .8 } })
      gsap.from('footer h2', { xPercent: -16, letterSpacing: '0.12em', scrollTrigger: { trigger: 'footer', start: 'top bottom', end: 'center center', scrub: 1 } })
    }, root)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const hero = root.current?.querySelector('.hero')
    const move = (event) => {
      const x = event.clientX / window.innerWidth - .5
      const y = event.clientY / window.innerHeight - .5
      gsap.to('.hero-orbit', { x: x * 16, y: y * 12, duration: 1.5, ease: 'power3.out', overwrite: 'auto' })
      gsap.to('.hero-parallax', { x: x * -7, y: y * -5, duration: 1.8, ease: 'power3.out', overwrite: 'auto' })
    }
    hero?.addEventListener('pointermove', move, { passive: true })
    return () => hero?.removeEventListener('pointermove', move)
  }, [])

  return <main ref={root}><Header /><Hero /><Intro /><Feature /><WorkRail /><FullscreenBridge /><Manifesto /><Footer /></main>
}

export default App
