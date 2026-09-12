import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './LeadstouConcept.css'

gsap.registerPlugin(ScrollTrigger)

const signals = [
  { label: 'HOT', count: 3, className: 'hot' },
  { label: 'OVERDUE', count: 2, className: 'overdue' },
  { label: 'RETURNING', count: 1, className: 'returning' },
  { label: 'WAITING', count: 6, className: 'waiting' },
  { label: 'UPCOMING', count: 4, className: 'upcoming' },
]

const dailyLeads = [
  { status: 'OVERDUE', name: 'Sarah Mitchell', action: 'Follow up now', tone: 'alert' },
  { status: 'HOT', name: 'David Chen', action: 'Asked about pricing', tone: 'warm' },
  { status: 'RETURNING', name: 'Maya Brooks', action: 'Intent increased', tone: 'blue', changed: true },
  { status: 'WAITING', name: 'Jordan Lee', action: 'Waiting for reply', tone: 'muted' },
  { status: 'UPCOMING', name: 'Alex Rivera', action: 'Follow-up tomorrow', tone: 'lime' },
]

function BrandMark() {
  return <a className="lt-brand" href="#lt-top" aria-label="LeadsTou concept home"><span className="lt-brand-dot" />LEADSTOU</a>
}

function SceneLabel({ number, children }) {
  return <div className="scene-label"><span>{number}</span><p>{children}</p></div>
}

function SignalField() {
  return <div className="signal-field" aria-label="Lead status overview">
    <div className="signal-orbit orbit-a" />
    <div className="signal-orbit orbit-b" />
    {signals.map((signal, index) => <div className={`signal signal-${index + 1} ${signal.className}`} key={signal.label}>
      <i /><div><span>{signal.label}</span><strong>{signal.count.toString().padStart(2, '0')}</strong></div>
    </div>)}
  </div>
}

function IntroScene() {
  return <section className="lt-scene intro-scene" id="lt-top">
    <div className="scene-sticky">
      <SignalField />
      <div className="intro-question"><p>DAILY PRIORITY ENGINE</p><h1>WHO NEEDS<br />YOU <em>TODAY?</em></h1><span>16 active signals · sorted by intent</span></div>
      <div className="returning-focus"><span className="focus-pulse" /><small>RETURNING / 01</small><strong>SARAH<br />MITCHELL</strong><p>New buying signal detected</p></div>
      <div className="scroll-note">SCROLL TO RESOLVE <span>↓</span></div>
    </div>
  </section>
}

function ChangeScene() {
  return <section className="lt-scene change-scene">
    <div className="scene-sticky change-sticky">
      <SceneLabel number="02">RETURNING LEAD DETECTED</SceneLabel>
      <div className="lead-identity"><span>LEAD / 00842</span><h2>SARAH<br />MITCHELL</h2><p><i /> RETURNING LEAD</p></div>
      <div className="state-viz">
        <div className="state state-before"><span>BEFORE</span><strong>WARM</strong><p>General interest</p><p>No timeline</p></div>
        <div className="state-line"><i /><i /><i /><b>STATE CHANGE</b></div>
        <div className="state state-now"><span>NOW</span><strong>HOT</strong><div className="evidence-stack"><small>BUYING EVIDENCE</small><p><i />Asked about availability</p><p><i />Timeline: <b>This month</b></p></div></div>
      </div>
      <blockquote>“Can we get this started <em>this month?</em>”</blockquote>
      <div className="change-metrics">
        <span>INTENT <b>↑</b></span><span>URGENCY <b>↑</b></span><span>TIMELINE <b>ADDED</b></span><span>OBJECTION <b>↓</b></span>
      </div>
    </div>
  </section>
}

function DecisionScene() {
  return <section className="lt-scene decision-scene">
    <div className="scene-sticky decision-sticky">
      <SceneLabel number="03">AI PRIORITY DECISION</SceneLabel>
      <div className="noise-field" aria-hidden="true">{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</div>
      <div className="decision-rings" aria-hidden="true"><i /><i /><i /></div>
      <div className="decision-core"><span>ANALYSIS COMPLETE</span><small>BUYING SIGNAL</small><h2>DETECTED</h2><div className="confidence"><i style={{ '--confidence': '.92' }} /><strong>92%</strong><span>CONFIDENCE</span></div></div>
      <div className="decision-facts"><p>LEAD TEMPERATURE <b>HOT</b></p><p>PRIORITY <b>HIGH</b></p></div>
      <div className="next-action"><span>NEXT ACTION</span><strong>FOLLOW UP NOW</strong><button type="button" onClick={() => document.querySelector('.workflow-scene')?.scrollIntoView({ behavior: 'smooth' })}>PREPARE MESSAGE <b>→</b></button></div>
    </div>
  </section>
}

function WorkflowScene() {
  const [draft, setDraft] = useState('Hey Sarah — just checking in since you mentioned wanting to get started this month. I have availability this week if you’d like to talk through the next step.')
  const [status, setStatus] = useState('DRAFT READY')
  return <section className="lt-scene workflow-scene">
    <div className="scene-sticky workflow-sticky">
      <SceneLabel number="04">ACTION WORKFLOW</SceneLabel>
      <div className="workflow-line">
        {['DETECTED', 'PRIORITIZED', 'DRAFT READY', 'FOLLOW UP', 'DONE'].map((step, index) => <div className={`workflow-step step-${index + 1}`} key={step}><i /><span>{step}</span></div>)}
        <div className="moving-lead"><span>SM</span></div>
      </div>
      <div className="draft-panel">
        <div className="draft-head"><span>AI DRAFT / SARAH MITCHELL</span><b>{status}</b></div>
        <textarea aria-label="Editable follow-up draft" value={draft} onChange={(event) => setDraft(event.target.value)} />
        <div className="draft-meta"><span>28 WORDS</span><span>TONE / WARM + DIRECT</span><span>EDITABLE</span></div>
        <div className="draft-actions"><button type="button">OPEN CONVERSATION</button><button type="button" onClick={() => setStatus('DONE')}>DONE</button><button type="button" onClick={() => setStatus('RESCHEDULED')}>RESCHEDULE</button></div>
      </div>
    </div>
  </section>
}

function DailyScene() {
  return <section className="daily-scene">
    <SceneLabel number="05">DAILY COMMAND VIEW</SceneLabel>
    <header className="daily-head"><div><span>SATURDAY · 12 SEP</span><h2>WHO NEEDS<br />YOU TODAY?</h2></div><div className="day-summary"><strong>05</strong><span>PRIORITY<br />LEADS</span></div></header>
    <div className="lead-list">
      <div className="list-head"><span>PRIORITY</span><span>LEAD</span><span>SIGNAL / NEXT ACTION</span><span>STATUS</span></div>
      {dailyLeads.map((lead, index) => <article className="lead-row" key={lead.name}>
        <span className={`status-dot ${lead.tone}`}><i />{lead.status}</span>
        <h3>{lead.name}</h3>
        <p>{lead.action}{lead.changed && <small>WHAT CHANGED ↗</small>}</p>
        <button type="button" aria-label={`Open ${lead.name}`}>{index === 0 ? 'ACT NOW' : 'OPEN'} <span>→</span></button>
      </article>)}
    </div>
    <div className="daily-foot"><span>UPDATED JUST NOW</span><p>16 signals reviewed<br />5 need attention</p><button type="button" onClick={() => document.querySelector('.lead-list')?.scrollIntoView({ behavior: 'smooth' })}>REVIEW ALL LEADS ↗</button></div>
  </section>
}

function WorkspaceTransition() {
  return <section className="workspace-transition" aria-label="Intelligence resolving into workspace">
    <div className="transition-sticky">
      <div className="analysis-shell">
        <div className="analysis-reticle"><i /><i /><i /></div>
        <span>92% CONFIDENCE</span>
        <strong>FOLLOW UP NOW</strong>
        <small>PRIORITY / HIGH</small>
      </div>
      <div className="workspace-plane">
        <header><span>INTELLIGENCE RESOLVED</span><b>05 PRIORITY LEADS</b></header>
        <div><h2>WHO NEEDS YOU TODAY?</h2><span>WORKSPACE READY</span></div>
        <footer>{['OVERDUE', 'HOT', 'RETURNING', 'WAITING', 'UPCOMING'].map((item) => <i key={item}>{item}</i>)}</footer>
      </div>
    </div>
  </section>
}

function BrandReveal() {
  return <footer className="lt-final"><div className="final-grid" /><span className="final-kicker">LEAD INTELLIGENCE / BUILT FOR ACTION</span><h2>NEVER LOSE TRACK<br />OF A <em>WARM LEAD</em> AGAIN.</h2><p>Know who needs you.<br />Know what changed.<br />Know what to do next.</p><a href="#lt-top">SEE WHO NEEDS YOU TODAY <span>→</span></a><div className="final-brand"><span>LEADSTOU</span><small>FOLLOW-UP, CLEARLY.</small></div></footer>
}

export default function LeadstouConcept() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const previousTitle = document.title
    document.title = 'LeadsTou — Who Needs You Today?'
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => { document.title = previousTitle }
    const ctx = gsap.context(() => {
      gsap.from('.lt-nav', { y: -20, opacity: 0, duration: .8, ease: 'power3.out' })
      gsap.from('.intro-question > *', { y: 36, opacity: 0, duration: 1, stagger: .1, ease: 'power3.out' })
      gsap.from('.signal', { scale: .5, opacity: 0, duration: .8, stagger: .08, ease: 'back.out(1.5)' })

      gsap.timeline({ scrollTrigger: { trigger: '.intro-scene', start: 'top top', end: 'bottom bottom', scrub: 1 } })
        .to('.signal:not(.returning)', { opacity: .12, scale: .72, filter: 'blur(3px)', stagger: .03 }, 0)
        .to('.intro-question', { opacity: .08, scale: .88 }, 0)
        .to('.signal.returning', { x: 0, y: 0, scale: 1.35 }, 0)
        .to('.returning-focus', { opacity: 1, scale: 1 }, .25)

      gsap.timeline({ scrollTrigger: { trigger: '.change-scene', start: 'top top', end: 'bottom bottom', scrub: 1 } })
        .from('.lead-identity', { xPercent: -15, opacity: 0 })
        .from('.state-before', { opacity: 0, x: -50 }, .08)
        .from('.state-line i', { scaleX: 0, stagger: .08, transformOrigin: 'left' }, .14)
        .to('.state-before', { opacity: .32, scale: .88, filter: 'blur(1.5px)' }, .4)
        .from('.state-now', { opacity: 0, x: 60, scale: .85 }, .38)
        .from('.change-metrics span', { y: 28, opacity: 0, stagger: .07 }, .52)
        .from('.change-sticky blockquote', { opacity: 0, y: 25 }, .64)

      gsap.timeline({ scrollTrigger: { trigger: '.decision-scene', start: 'top top', end: 'bottom bottom', scrub: 1 } })
        .from('.noise-field i', { x: () => gsap.utils.random(-450, 450), y: () => gsap.utils.random(-280, 280), opacity: .8, stagger: .01 })
        .from('.decision-rings i', { scale: .25, opacity: 0, stagger: .08 }, .18)
        .from('.decision-core > *', { opacity: 0, y: 18, stagger: .07 }, .34)
        .from('.decision-facts p', { opacity: 0, x: -30, stagger: .1 }, .5)
        .from('.next-action', { opacity: 0, y: 50, scale: .94 }, .68)

      gsap.timeline({ scrollTrigger: { trigger: '.workflow-scene', start: 'top top', end: 'bottom bottom', scrub: 1 } })
        .from('.workflow-step', { opacity: .2, stagger: .1 }, 0)
        .to('.moving-lead', { left: '50%', ease: 'power1.inOut' }, .12)
        .from('.draft-panel', { opacity: 0, y: 45, scale: .96 }, .4)
        .to('.moving-lead', { left: '74%', ease: 'power1.inOut' }, .7)

      gsap.timeline({ scrollTrigger: { trigger: '.workspace-transition', start: 'top top', end: 'bottom bottom', scrub: 1 } })
        .to('.analysis-shell', { scale: .56, opacity: .12, filter: 'blur(5px)', duration: .55, ease: 'power2.in' })
        .to('.transition-sticky', { backgroundColor: '#eef0ec', duration: .55, ease: 'none' }, .35)
        .fromTo('.workspace-plane', { opacity: 0, scale: .78, rotateX: 7, y: 90 }, { opacity: 1, scale: 1, rotateX: 0, y: 0, duration: .55, ease: 'power2.out' }, .42)
        .to('.analysis-shell', { opacity: 0, duration: .2 }, .7)

      gsap.from('.lead-row', { opacity: 0, y: 35, stagger: .08, scrollTrigger: { trigger: '.lead-list', start: 'top 76%' } })
      gsap.from('.lt-final h2, .lt-final > p, .lt-final > a', { opacity: 0, y: 50, stagger: .12, scrollTrigger: { trigger: '.lt-final', start: 'top 62%' } })
    }, root)
    return () => { ctx.revert(); document.title = previousTitle }
  }, [])

  return <main className="leadstou-concept" ref={root}>
    <nav className="lt-nav"><BrandMark /><span>LIVE PRIORITIES</span><p><i /> SYSTEM ACTIVE</p></nav>
    <IntroScene /><ChangeScene /><DecisionScene /><WorkflowScene /><WorkspaceTransition /><DailyScene /><BrandReveal />
  </main>
}
