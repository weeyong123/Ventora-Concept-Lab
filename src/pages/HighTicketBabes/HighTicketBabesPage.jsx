import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './HighTicketBabesPage.css'
import { possibilities, curriculum, fit } from './highTicketBabesContent.js'

gsap.registerPlugin(ScrollTrigger)

export default function HighTicketBabesPage() {
  const root = useRef(null)
  const dialog = useRef(null)

  useLayoutEffect(() => {
    const previousTitle = document.title
    const description = document.querySelector('meta[name="description"]')
    const previousDescription = description?.content
    document.title = 'High Ticket Babes — A life on your terms'
    if (description) description.content = 'High Ticket Babes with Lauren Nicole Wingate. Marketing, sales and systems for a business designed around your life.'
    const media = gsap.matchMedia()
    const ctx = gsap.context(() => {
      media.add({ desktop: '(min-width: 801px)', mobile: '(max-width: 800px)', reduce: '(prefers-reduced-motion: reduce)' }, ({ conditions }) => {
        const hero = root.current.querySelector('.htb-hero')
        hero.inert = false
        if (conditions.reduce) return
        const opening = gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('.htb-eyebrow', { y: 12, opacity: 0, duration: .5 })
          .from('.htb-title-line > span', { yPercent: 110, duration: .95, stagger: .12 }, .12)
          .from('.htb-hero-photo', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.15 }, .28)
          .from('.htb-hero-photo img', { scale: 1.1, duration: 1.5 }, .28)
          .from('.htb-intro', { y: 16, opacity: 0, duration: .6 }, .8)
          .from('.htb-apply', { y: 12, opacity: 0, duration: .5 }, 1)
          .from('.htb-red-rule', { scaleX: 0, transformOrigin: 'left', duration: .7 }, 1.1)
        // End the opening if the reader scrolls immediately. Scroll transforms use
        // outer wrappers so they never compete with the opening's inner elements.
        const finishOpening = () => { if (window.scrollY > 8) opening.progress(1) }
        window.addEventListener('scroll', finishOpening, { passive: true })
        if (conditions.desktop) {
          const story = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
            trigger: '.htb-stage', start: 'top top', end: () => `+=${window.innerHeight * 13.8}`,
            pin: true, scrub: true, invalidateOnRefresh: true, anticipatePin: 1,
            onUpdate: self => { hero.inert = self.progress > .14 },
          } })
          // One continuous chapter: each short hold adds a new piece of the offer.
          story.to('.htb-hero-support', { y: -25, opacity: 0, duration: .2 }, .05)
            .to('.htb-hero-heading', { y: -35, opacity: 0, duration: .28 }, .15)
            .to('.htb-hero-visual', { scale: .96, yPercent: -2, duration: 2.6 }, 0)
            .to('.htb-hero', { backgroundColor: '#ded7d1', duration: 2.5 }, .15)
            .to('.htb-hero', { backgroundColor: '#242023', duration: .48, ease: 'power1.inOut' }, 2.72)
            .fromTo('.htb-ready', { autoAlpha: 0 }, { autoAlpha: 1, duration: .15 }, .4)
          possibilities.forEach((_, index) => {
            const at = .45 + index * .72
            story.fromTo(`.htb-possibility-${index}`, { autoAlpha: 0 }, { autoAlpha: 1, duration: .12 }, at)
              .fromTo(`.htb-possibility-${index} h3 > span > span`, { yPercent: 110 }, { yPercent: 0, stagger: .05, duration: .2 }, at)
              .to(`.htb-possibility-${index}`, { autoAlpha: 0, y: -20, duration: .14 }, at + .59)
          })
          story.to('.htb-ready', { autoAlpha: 0, duration: .12 }, 2.65)
            .fromTo('.htb-chapter', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .65 }, 2.55)
            .to('.htb-hero-meta', { opacity: 0, duration: .15 }, 2.8)
            .fromTo('.htb-dress', { clipPath: 'inset(18% 0% 82% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .6 }, 2.85)
            .fromTo('.htb-dress img', { scale: 1.12 }, { scale: 1, duration: 1.1 }, 2.85)
            .fromTo('.htb-chapter-label', { opacity: 0 }, { opacity: 1, duration: .2 }, 3.1)
            .fromTo('.htb-purpose-line > span', { yPercent: 115 }, { yPercent: 0, duration: .22, stagger: .1 }, 3.12)
            .fromTo('.htb-chapter-caption', { opacity: 0 }, { opacity: 1, duration: .15 }, 3.45)
            .to('.htb-purpose', { y: -30, autoAlpha: 0, duration: .2 }, 3.95)
            .fromTo('.htb-founder', { y: 35, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .25 }, 4.12)
            .fromTo('.htb-founder-body .htb-story-copy:first-child', { autoAlpha: 0 }, { autoAlpha: 1, duration: .2 }, 4.9)
            .to('.htb-founder-body .htb-story-copy:first-child', { autoAlpha: 0, duration: .15 }, 5.7)
            .fromTo('.htb-founder-body .htb-story-copy:last-child', { autoAlpha: 0 }, { autoAlpha: 1, duration: .2 }, 5.85)
            .to('.htb-founder', { y: -25, autoAlpha: 0, duration: .2 }, 6.75)
            .fromTo('.htb-proof', { autoAlpha: 0 }, { autoAlpha: 1, duration: .18 }, 6.95)
            .fromTo('.htb-proof-number', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: .25, stagger: .3 }, 6.95)
            .to('.htb-proof', { autoAlpha: 0, y: -20, duration: .2 }, 8.45)
            .to('.htb-dress', { xPercent: 12, scale: .96, duration: .5 }, 8.5)
            .to('.htb-dress img', { opacity: .58, duration: .5 }, 8.5)
            .fromTo('.htb-masterclass', { autoAlpha: 0 }, { autoAlpha: 1, duration: .25 }, 8.7)
          curriculum.forEach((_, index) => {
            const at = 9.55 + index * 1.65
            story.fromTo(`.htb-module-${index}`, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .2 }, at)
              .to('.htb-module-progress span', { scaleX: (index + 1) / curriculum.length, duration: .35 }, at)
              .to(`.htb-module-${index}`, { autoAlpha: 0, y: -15, duration: .15 }, at + 1.48)
          })
          story.to('.htb-masterclass', { autoAlpha: 0, duration: .15 }, 16.15)
            .fromTo('.htb-fit', { autoAlpha: 0 }, { autoAlpha: 1, duration: .15 }, 16.35)
          ;['yes', 'no'].forEach((type, index) => {
            const at = 16.45 + index * 2.9
            story.fromTo(`.htb-fit-${type}`, { autoAlpha: 0 }, { autoAlpha: 1, duration: .2 }, at)
              .to('.htb-dress img', { opacity: type === 'yes' ? .68 : .42, duration: .4, ease: 'power1.inOut' }, at)
            ;[0, 1].forEach(group => {
              story.fromTo(`.htb-fit-${type} .htb-fit-group-${group}`, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .2 }, at + group * 1.4)
                .to(`.htb-fit-${type} .htb-fit-group-${group}`, { autoAlpha: 0, duration: .15 }, at + group * 1.4 + 1.22)
            })
            story.to(`.htb-fit-${type}`, { autoAlpha: 0, duration: .15 }, at + 2.75)
          })
          story.to('.htb-fit', { autoAlpha: 0, duration: .2 }, 22.15)
            .to('.htb-dress', { xPercent: 0, scale: 1, duration: .6 }, 22.25)
            .to('.htb-dress img', { opacity: 1, duration: .6 }, 22.25)
            .fromTo('.htb-freedom', { autoAlpha: 0 }, { autoAlpha: 1, duration: .2 }, 22.4)
            .fromTo('.htb-freedom-line > span', { yPercent: 115 }, { yPercent: 0, duration: .28, stagger: .32 }, 22.45)
            .fromTo('.htb-freedom-note', { opacity: 0 }, { opacity: 1, duration: .2 }, 24)
            .to('.htb-progress-fill', { scaleX: 1, duration: 24.7 }, 0)
        } else {
          // Short native sticky sequence on mobile; the rest stays in document flow.
          const ready = gsap.timeline({ scrollTrigger: { trigger: '.htb-ready', start: 'top top', end: 'bottom bottom', scrub: true } })
          possibilities.forEach((_, index) => {
            if (index) ready.fromTo(`.htb-possibility-${index}`, { autoAlpha: 0 }, { autoAlpha: 1, duration: .2 }, index)
            if (index < possibilities.length - 1) ready.to(`.htb-possibility-${index}`, { autoAlpha: 0, y: -20, duration: .2 }, index + .85)
          })
          gsap.from('.htb-chapter', { clipPath: 'inset(6% 0% 0% 0%)', scrollTrigger: { trigger: '.htb-chapter', start: 'top bottom', end: 'top 15%', scrub: true } })
          gsap.from('.htb-purpose-line > span', { yPercent: 110, stagger: .12, scrollTrigger: { trigger: '.htb-purpose', start: 'top 90%', end: 'top 35%', scrub: true } })
          gsap.from('.htb-dress img', { scale: 1.06, scrollTrigger: { trigger: '.htb-dress', start: 'top bottom', end: 'bottom top', scrub: true } })
          gsap.utils.toArray('.htb-module, .htb-proof-number, .htb-fit-group, .htb-founder .htb-story-copy').forEach(element => {
            gsap.from(element, { clipPath: 'inset(0% 0% 100% 0%)', scrollTrigger: { trigger: element, start: 'top 98%', end: 'top 78%', scrub: true } })
          })
          gsap.from('.htb-freedom-line > span', { yPercent: 110, stagger: .15, scrollTrigger: { trigger: '.htb-freedom', start: 'top 90%', end: 'center 65%', scrub: true } })
        }
        return () => { window.removeEventListener('scroll', finishOpening); hero.inert = false }
      })
    }, root)
    return () => {
      media.revert()
      ctx.revert()
      document.title = previousTitle
      if (description) description.content = previousDescription
    }
  }, [])

  const showConceptNotice = () => dialog.current?.showModal()

  return <main className="htb" ref={root}>
    <div className="htb-stage">
      <section className="htb-hero" aria-labelledby="htb-heading">
        <div className="htb-hero-opening">
        <nav className="htb-nav" aria-label="High Ticket Babes">
          <a className="htb-wordmark" href="/highticketbabes" aria-label="High Ticket Babes home">HIGH TICKET<span>BABES<span className="htb-brand-star" aria-hidden="true">✳</span></span></a>
          <div className="htb-nav-links"><span>ABOUT</span><span>MASTERCLASS</span></div>
          <button className="htb-nav-apply" onClick={showConceptNotice}>EXPLORE <span aria-hidden="true">↗</span></button>
        </nav>
        <div className="htb-hero-visual"><figure className="htb-hero-photo"><img src="/highticketbabes/lauren-black-portrait.png" alt="Editorial portrait of Lauren Nicole Wingate in black" width="1254" height="1254" fetchPriority="high" /></figure></div>
        <div className="htb-hero-heading">
          <p className="htb-eyebrow">HIGH-LEVEL MARKETING <b>•</b> SALES SKILLS <b>•</b> ONLINE</p>
          <h1 id="htb-heading"><span className="htb-title-line"><span>BUILD A BUSINESS</span></span><span className="htb-title-line"><span>THAT GIVES YOU</span></span><span className="htb-title-line htb-life"><span>YOUR <em>LIFE BACK.</em></span></span></h1>
          <span className="htb-red-rule" aria-hidden="true" />
        </div>
        <div className="htb-hero-support"><p className="htb-intro">Learn high-level marketing and sales skills online. Build an online business through guided training in high-ticket affiliate marketing.</p><button className="htb-apply" onClick={showConceptNotice}>EXPLORE THE MASTERCLASS <span aria-hidden="true">↗</span></button></div>
        <div className="htb-hero-meta"><p>WITH LAUREN NICOLE WINGATE</p><p className="htb-scroll">SCROLL TO REWRITE YOUR STORY <span aria-hidden="true">↓</span></p></div>
        <span className="htb-photo-label">THE BUSINESS IS YOURS. SO IS THE LIFE.</span>
        </div>
        <div className="htb-ready"><div className="htb-ready-sticky">
          <p className="htb-small-label">ARE YOU READY TO…</p>
          <div className="htb-possibilities">{possibilities.map((item, index) => <article className={`htb-possibility htb-possibility-${index}`} key={item.title[0]}>
            <p className="htb-moment-index">0{index + 1} <span>/ 03</span></p>
            <h3>{item.title.map((line, i) => <span key={line}><span>{i ? <em>{line}</em> : line}</span></span>)}</h3>
            <p className="htb-possibility-copy">{item.copy}</p>
          </article>)}</div>
        </div></div>
      </section>

      <section className="htb-chapter" aria-labelledby="htb-transformation-heading">
        <div className="htb-dress"><img src="/highticketbabes/lauren-red-dress.png" alt="Lauren wearing a red dress beneath a chandelier in a dark, elegant interior" width="1024" height="1536" loading="eager" decoding="async" /></div>
        <p className="htb-chapter-label"><span>02 / THE TRANSFORMATION</span><span>HIGH TICKET BABES</span></p>
        <div className="htb-purpose"><h2 id="htb-transformation-heading"><span className="htb-purpose-line"><span>FROM</span></span><span className="htb-purpose-line"><span>PAYCHECK</span></span><span className="htb-purpose-line"><span>TO <em>PURPOSE.</em></span></span></h2><p className="htb-chapter-caption"><span aria-hidden="true">↗</span> A business that changes how you live.</p></div>
        <div className="htb-founder"><p className="htb-small-label">INVITED BY YOUR HOST / LAUREN NICOLE WINGATE</p><h3>This was never<br />just about<br /><em>making money.</em></h3><p className="htb-story-lead">A mother of two. Burnt out. Barely surviving paycheck to paycheck.</p><div className="htb-founder-body"><p className="htb-story-copy">Lauren was tired of dead-end jobs and glass ceilings. She wanted a better life for herself and her boys — beyond the limits of her bank account, sick days and someone else’s schedule.</p><p className="htb-story-copy">She came to online business seeking freedom of time, finances and location, and the space to pursue her dreams.</p></div></div>
        <div className="htb-proof"><p className="htb-small-label">RESULTS REPORTED ON LAUREN’S WEBSITE</p><p className="htb-proof-context">After learning the tools taught in the Masterclass, Lauren describes what she and her community have achieved:</p><div className="htb-proof-result"><h3 className="htb-proof-number">Multiple<br /><em>six figures.</em></h3><p>IN SALES VOLUME</p></div><div className="htb-proof-result"><h3 className="htb-proof-number">Consistent<br /><em>five-figure</em></h3><p>COMMISSION MONTHS ONLINE</p></div><a className="htb-source" href="https://www.highticketbabes.biz/" target="_blank" rel="noreferrer">As described on High Ticket Babes <span aria-hidden="true">↗</span></a></div>
        <div className="htb-masterclass"><h3 className="htb-panel-title"><span>WHAT YOU WILL LEARN</span><small>INSIDE THE</small> Masterclass</h3><div className="htb-module-progress" aria-hidden="true"><span /></div><div className="htb-modules">{curriculum.map((item, index) => <article className={`htb-module htb-module-${index}`} key={item.number}><div className="htb-module-meta"><span className="htb-module-number">{item.number}</span><p>{item.category}</p></div><h4>{item.title[0]}<br /><em>{item.title[1]}</em></h4><p className="htb-module-copy">{item.copy}</p><p className="htb-module-detail">{item.detail}</p></article>)}</div></div>
        <div className="htb-fit"><p className="htb-small-label">IS THIS A GOOD FIT FOR YOU?</p>{['yes', 'no'].map(type => <div className={`htb-fit-panel htb-fit-${type}`} key={type}><div className="htb-fit-heading"><h3>{type === 'yes' ? 'YES.' : 'NO.'}</h3><p>This masterclass is<br /><strong>{type === 'yes' ? 'for you if…' : 'not for you if…'}</strong></p></div><div className="htb-fit-groups">{[fit[type].slice(0, 3), fit[type].slice(3)].map((points, index) => <ul className={`htb-fit-group htb-fit-group-${index}`} key={index}>{points.map(point => <li key={point}>{point}</li>)}</ul>)}</div></div>)}</div>
        <div className="htb-freedom"><p className="htb-small-label">A LIFE ON YOUR TERMS</p><h3>{['TIME.', 'MONEY.', 'CHOICE.'].map(word => <span className="htb-freedom-line" key={word}><span><small>FREEDOM OF</small><em>{word}</em></span></span>)}</h3><p className="htb-freedom-note">Your ambition. Your business. Your life.</p></div>
        <div className="htb-chapter-bottom"><span>LAUREN NICOLE WINGATE</span><span>LIVE ON YOUR TERMS.</span></div>
        <div className="htb-progress" aria-hidden="true"><span className="htb-progress-fill" /></div>
      </section>
    </div>
    <dialog className="htb-dialog" ref={dialog} onClick={event => { if (event.target === event.currentTarget) dialog.current.close() }} aria-labelledby="htb-dialog-heading">
      <p className="htb-small-label">HIGH TICKET BABES / CONCEPT PREVIEW</p><h2 id="htb-dialog-heading">Your next chapter.</h2><p>You’re viewing a design concept of Lauren’s Masterclass. Explore her current website for the live offer.</p><a className="htb-live-link" href="https://www.highticketbabes.biz/" target="_blank" rel="noreferrer">VISIT HIGH TICKET BABES ↗</a><form method="dialog"><button autoFocus>BACK TO THE CONCEPT <span aria-hidden="true">↗</span></button></form>
    </dialog>
  </main>
}
