import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './Saas.css'

gsap.registerPlugin(ScrollTrigger)

const signals = [
  { label: 'LEAD INTENT', value: '+32%', x: 16, y: 22, z: 1, hot: true },
  { label: 'PIPELINE RISK', value: '06', x: 72, y: 19, z: 3 },
  { label: 'RESPONSE DELAY', value: '04:12', x: 81, y: 61, z: 2 },
  { label: 'BUYING SIGNAL', value: 'ACTIVE', x: 28, y: 68, z: 2, hot: true },
  { label: 'FOLLOW-UP DUE', value: '12', x: 56, y: 78, z: 1 },
  { label: 'OPPORTUNITY SHIFT', value: '+18%', x: 48, y: 35, z: 4 },
]

const stages = ['DETECT', 'PRIORITIZE', 'ROUTE', 'ACT', 'LEARN']

function SystemChrome() {
  return <>
    <header className="nova-chrome">
      <a href="#nova-top" className="nova-mark" aria-label="Nova Systems home"><i /> NOVA</a>
      <div className="nova-status"><span /> SYSTEM ONLINE <b>08:42:16</b></div>
      <button type="button" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>REQUEST ACCESS <span>↗</span></button>
    </header>
    <div className="edge-index" aria-hidden="true"><span>01</span><i /><span className="edge-current">SYSTEM BOOT</span></div>
    <div className="coordinates" aria-hidden="true">03°08' N<br />101°41' E</div>
  </>
}

function Network() {
  return <div className="network" aria-hidden="true">
    <svg viewBox="0 0 1440 900" preserveAspectRatio="none">
      <g className="network-lines">
        <path d="M75 642L280 517L405 620L586 312L718 451L918 231L1112 415L1360 300" />
        <path d="M100 218L331 340L586 312L781 154L918 231L1044 588L1290 690" />
        <path d="M280 517L331 340L718 451L1044 588L1112 415" />
      </g>
      {[{x:75,y:642},{x:100,y:218},{x:280,y:517},{x:331,y:340},{x:405,y:620},{x:586,y:312},{x:718,y:451},{x:781,y:154},{x:918,y:231},{x:1044,y:588},{x:1112,y:415},{x:1290,y:690},{x:1360,y:300}].map((node, index) => <g className={`network-node node-${index}`} key={`${node.x}-${node.y}`} transform={`translate(${node.x} ${node.y})`}><circle r="3" /><circle className="node-pulse" r="15" /></g>)}
      <line className="scanner" x1="0" x2="1440" y1="450" y2="450" />
    </svg>
  </div>
}

function BootScene({ booted }) {
  return <section className={`nova-scene boot-scene ${booted ? 'is-booted' : ''}`} aria-label="System boot">
    <div className="boot-lockup"><p>NOVA SYSTEMS</p><span>INITIALIZING SIGNAL LAYER</span><div className="boot-progress"><i /></div><small>CONNECTING <b>•••</b></small></div>
    <div className="boot-readout readout-a">NODE SYNC <b>074 / 074</b><br />LATENCY <b>12 MS</b></div>
    <div className="boot-readout readout-b">SIGNAL LAYER / ACTIVE<br />FIELD RESOLUTION / 98.4%</div>
    <h1><span>SEE THE SIGNAL.</span><span>MOVE BEFORE THE <em>NOISE.</em></span></h1>
    <p className="boot-sub">AI operations for teams that need to understand,<br />prioritize and act in real time.</p>
    <div className="scroll-enter"><i /> SCROLL TO ENTER SYSTEM</div>
  </section>
}

function SignalScene() {
  return <section className="nova-scene signal-scene" aria-label="Signal field">
    <div className="scene-caption"><span>02 / SIGNAL FIELD</span><p>LIVE EVENT LAYER<br />AUTONOMOUS MONITORING</p></div>
    <p className="field-depth">ENTERING<br /><b>SIGNAL FIELD</b></p>
    <div className="signal-field">
      {signals.map((signal, index) => <article className={`signal signal-${index} depth-${signal.z} ${signal.hot ? 'is-hot' : ''}`} style={{ '--x': `${signal.x}%`, '--y': `${signal.y}%` }} key={signal.label}>
        <i /><div><span>{signal.label}</span><strong>{signal.value}</strong></div><small>0{index + 1} / LIVE</small>
      </article>)}
    </div>
    <div className="signal-focus"><span>PRIORITY EVENT ISOLATED</span><strong>HIGH INTENT<br />LEAD</strong><small>+ 4 CORRELATED SIGNALS</small></div>
  </section>
}

function DecisionCore() {
  return <section className="nova-scene decision-scene" aria-label="AI decision core">
    <div className="scene-caption"><span>03 / DECISION CORE</span><p>REASONING ENGINE<br />MODEL / NOVA-R1</p></div>
    <div className="decision-system">
      <svg className="decision-links" viewBox="0 0 900 900" aria-hidden="true"><path d="M450 55L450 214M116 260L275 349M784 260L625 349M84 613L270 538M816 613L630 538M450 685L450 846" /></svg>
      <div className="core-orbit orbit-outer"><span>INTENT 0.97</span><span>URGENCY 0.89</span><span>FIT 0.94</span></div>
      <div className="core-orbit orbit-mid"><i /><i /><i /><i /></div>
      <div className="core-noise" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div>
      <div className="core-center"><span>CONFIDENCE</span><strong>94<sup>%</sup></strong><small>DECISION LOCKED</small></div>
      <div className="decision-fragment fragment-a"><span>PRIORITY SIGNAL</span><b>HIGH INTENT LEAD</b></div>
      <div className="decision-fragment fragment-b"><span>NEXT ACTION</span><b>FOLLOW UP NOW</b></div>
      <div className="decision-fragment fragment-c"><span>OWNER</span><b>MAYA / ENTERPRISE</b></div>
      <div className="decision-fragment fragment-d"><span>CHANNEL</span><b>PERSONALIZED EMAIL</b></div>
    </div>
    <div className="decision-verdict"><span>SYSTEM RECOMMENDATION</span><h2>FOLLOW UP <em>NOW</em></h2><p>HIGHEST PROBABILITY ACTION / ASSIGNED TO MAYA</p></div>
  </section>
}

function ActionScene() {
  return <section className="nova-scene action-scene" aria-label="Action sequence">
    <div className="scene-caption"><span>04 / ACTION SEQUENCE</span><p>WORKFLOW / LIVE<br />ELAPSED / 00:04.82</p></div>
    <div className="action-plane">
      <div className="action-line"><i className="line-fill" /><b className="data-packet"><span>01</span></b></div>
      {stages.map((stage, index) => <div className={`action-stage action-stage-${index + 1}`} key={stage}><i /><span>0{index + 1}</span><strong>{stage}</strong><small>{['SIGNAL CAPTURED', 'SCORE / 94', 'MAYA / SALES', 'FOLLOW-UP SENT', 'MODEL UPDATED'][index]}</small></div>)}
    </div>
    <div className="action-result"><span>ACTION COMPLETE</span><strong>04.82s</strong><small>SIGNAL → OUTCOME</small></div>
  </section>
}

function Sparkline() {
  return <svg viewBox="0 0 300 80" preserveAspectRatio="none" aria-hidden="true"><path className="spark-base" d="M0 68H300" /><path className="spark" d="M0 61L30 57L58 63L87 44L115 49L145 32L176 38L205 18L236 27L268 10L300 16" /></svg>
}

function ProductScene() {
  return <section className="nova-scene product-scene" aria-label="Nova product console">
    <div className="scene-caption"><span>05 / OPERATING CONSOLE</span><p>WORKSPACE / NORTHSTAR<br />ENV / PRODUCTION</p></div>
    <div className="console">
      <div className="console-top"><b><i /> NOVA / OPS</b><span>COMMAND CENTER</span><small>FRI 12 SEP &nbsp; 08:42</small></div>
      <aside><strong>N</strong><i className="active" /><i /><i /><i /><span>⌁</span></aside>
      <div className="console-heading"><span>GOOD MORNING, MAYA</span><h2>Operational overview</h2><p><i /> 12 signals require attention</p></div>
      <div className="metric metric-signals"><span>PRIORITY SIGNALS</span><strong>12</strong><small>↑ 24% THIS WEEK</small><div className="mini-bars"><i/><i/><i/><i/><i/><i/></div></div>
      <div className="metric metric-response"><span>AVG. RESPONSE</span><strong>4.8<sup>m</sup></strong><small>↓ 1.2m VS LAST WEEK</small><Sparkline /></div>
      <div className="ai-summary"><header><span><i /> NOVA AI SUMMARY</span><small>GENERATED NOW</small></header><h3>Enterprise intent is rising.</h3><p>Four high-fit accounts showed correlated buying activity in the last 24 hours. Prioritize Meridian Labs before 10:00.</p><button type="button">VIEW RECOMMENDED ACTION <span>→</span></button><div className="confidence"><i /><span>CONFIDENCE</span><b>94%</b></div></div>
      <div className="action-queue"><header><span>ACTION QUEUE</span><small>12 OPEN</small></header>{['Meridian Labs','Nexon Group','Arc Systems'].map((name, index) => <div className={`queue-row ${index === 0 ? 'queue-hot' : ''}`} key={name}><i>{index + 1}</i><div><strong>{name}</strong><span>{['FOLLOW UP NOW','REVIEW PIPELINE RISK','ROUTE TO ENTERPRISE'][index]}</span></div><b>{['94','87','81'][index]}</b><button type="button">→</button></div>)}</div>
      <div className="team-load"><header><span>TEAM LOAD</span><small>LIVE</small></header>{['MAYA','JON','ELI'].map((name, index) => <div key={name}><span>{name}</span><i><b style={{width: `${[78,55,34][index]}%`}} /></i><small>{[8,5,3][index]} ACTIVE</small></div>)}</div>
      <div className="workflow"><span>WORKFLOW STATUS</span><strong>87%</strong><small>26 / 30 AUTOMATIONS HEALTHY</small><i><b /></i></div>
    </div>
    <div className="product-callout"><i /><span>ONE SYSTEM.<br /><b>EVERY DECISION IN MOTION.</b></span></div>
  </section>
}

function FinalScene() {
  return <section className="nova-scene final-scene" aria-label="Nova Systems call to action">
    <div className="collapse-point"><i /><i /><i /></div>
    <p className="final-line"><span>LESS NOISE.</span><span>MORE <em>ACTION.</em></span></p>
    <div className="final-brand"><small>NOVA SYSTEMS / AI OPERATIONS</small><h2>NOVA<br />SYSTEMS</h2><div><a href="mailto:access@novasystems.example">ENTER THE SYSTEM <span>→</span></a><a href="mailto:access@novasystems.example">REQUEST ACCESS</a></div></div>
    <div className="final-status"><i /> ALL SYSTEMS OPERATIONAL <span>© 2026 / KL</span></div>
  </section>
}

export default function Saas() {
  const root = useRef(null)
  const [booted, setBooted] = useState(false)

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'NOVA Systems — AI Operations'
    const timer = window.setTimeout(() => setBooted(true), 850)
    return () => { window.clearTimeout(timer); document.title = previousTitle }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true })
    const update = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(update)
    lenis.on('scroll', ScrollTrigger.update)
    return () => { gsap.ticker.remove(update); lenis.destroy() }
  }, [])

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: '.nova-scroll', start: 'top top', end: 'bottom bottom', scrub: 0.7, invalidateOnRefresh: true },
      })
      timeline
        .to('.boot-scene h1', { scale: 2.5, z: 600, opacity: 0, filter: 'blur(14px)', duration: 1 }, 0)
        .to('.boot-sub, .scroll-enter, .boot-readout', { opacity: 0, duration: .35 }, 0)
        .to('.network', { scale: 2.15, opacity: .28, duration: 1 }, 0)
        .to('.boot-scene', { opacity: 0, duration: .28 }, .46)
        .to('.signal-scene', { opacity: 1, pointerEvents: 'auto', duration: .18 }, .55)
        .fromTo('.field-depth', { scale: .5, opacity: 0, filter: 'blur(15px)' }, { scale: 1.15, opacity: .14, filter: 'blur(0px)', duration: .55 }, .52)
        .fromTo('.signal', { scale: .15, opacity: 0, z: -800 }, { scale: 1, opacity: 1, z: 0, stagger: .055, duration: .55 }, .58)
        .to('.signal-0, .signal-4', { z: 280, scale: 1.34, xPercent: 18, duration: .52 }, .88)
        .to('.signal-1, .signal-5', { z: -220, xPercent: -5, duration: .9 }, .83)
        .to('.signal-2', { z: 520, scale: 1.62, xPercent: -35, yPercent: 12, duration: .68 }, 1.03)
        .to('.signal-3', { z: 110, xPercent: 10, duration: .82 }, .9)
        .to('.signal-field', { scale: 1.7, z: 450, duration: .75 }, 1.12)
        .to('.signal:not(.signal-0)', { opacity: .08, filter: 'blur(8px)', duration: .3 }, 1.38)
        .to('.signal-0', { left: '50%', top: '50%', scale: 1.7, duration: .45 }, 1.34)
        .to('.signal-focus', { opacity: 1, scale: 1, duration: .35 }, 1.48)
        .to('.signal-scene', { opacity: 0, scale: 2.1, filter: 'blur(14px)', duration: .45 }, 1.82)
        .to('.decision-scene', { opacity: 1, pointerEvents: 'auto', duration: .25 }, 1.9)
        .fromTo('.decision-system', { scale: .35, rotate: -20, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: .75 }, 1.9)
        .fromTo('.core-noise i', { opacity: .75, scale: 1.4 }, { opacity: .18, scale: .5, stagger: .018, duration: .4 }, 2.2)
        .from('.decision-fragment', { scale: .4, opacity: 0, stagger: .08, duration: .35 }, 2.15)
        .to('.orbit-outer', { rotate: 145, borderColor: 'rgba(223,255,79,.52)', duration: 1.35 }, 2.1)
        .to('.orbit-mid', { rotate: -210, scale: 1.07, boxShadow: '0 0 45px rgba(223,255,79,.16)', duration: 1.35 }, 2.1)
        .to('.core-noise i', { left: '50%', top: '50%', opacity: 0, scale: .1, stagger: .018, duration: .58 }, 2.42)
        .to('.decision-fragment:not(.fragment-b)', { opacity: .12, scale: .76, duration: .35 }, 2.85)
        .to('.fragment-b', { x: 0, y: 0, scale: 1.28, duration: .35 }, 2.85)
        .to('.decision-system', { scale: .62, y: -120, duration: .48 }, 3.12)
        .to('.decision-verdict', { opacity: 1, y: 0, scale: 1.06, duration: .28, ease: 'power3.out' }, 3.17)
        .to('.core-center', { boxShadow: '0 0 95px rgba(223,255,79,.28)', duration: .25 }, 3.18)
        .to('.decision-scene', { opacity: 0, rotateX: 20, scale: .7, duration: .5 }, 3.82)
        .to('.action-scene', { opacity: 1, pointerEvents: 'auto', duration: .25 }, 3.78)
        .fromTo('.action-plane', { rotateX: 62, rotateZ: -8, scale: .76, opacity: 0 }, { rotateX: 52, rotateZ: -3, scale: 1, opacity: 1, duration: .7 }, 3.78)
        .to('.line-fill', { scaleX: 1, duration: 1.2 }, 4.18)
        .to('.data-packet', { left: '100%', duration: 1.2 }, 4.18)
      stages.forEach((_, index) => timeline
        .to(`.action-stage-${index + 1}`, { color: '#dfff4f', scale: 1.08, duration: .12 }, 4.19 + index * .24)
        .to(`.action-stage-${index + 1} i`, { boxShadow: '0 0 30px #dfff4f', background: '#dfff4f', duration: .12 }, 4.19 + index * .24)
        .to('.data-packet', { scale: 1 + index * .1, borderRadius: index > 2 ? '2px' : '50%', backgroundColor: index === 4 ? '#eaf1f1' : '#dfff4f', duration: .1 }, 4.19 + index * .24)
        .set('.data-packet span', { textContent: `0${index + 1}` }, 4.19 + index * .24))
      timeline
        .to('.action-result', { opacity: 1, scale: 1, duration: .25 }, 5.35)
        .to('.action-scene', { opacity: 0, scale: .5, z: -600, duration: .55 }, 5.72)
        .to('.product-scene', { opacity: 1, pointerEvents: 'auto', duration: .2 }, 5.88)
        .fromTo('.console', { scale: .12, z: -1500, rotateX: 18, opacity: .1 }, { scale: .86, z: 0, rotateX: 0, opacity: 1, duration: .82, ease: 'power2.inOut' }, 5.86)
        .to('.console', { scale: 1.52, x: '-21%', y: '12%', duration: .7, ease: 'power2.inOut' }, 6.68)
        .to('.console', { scale: 1.88, x: '24%', y: '-18%', duration: .7, ease: 'power2.inOut' }, 7.38)
        .to('.queue-hot', { backgroundColor: 'rgba(223,255,79,.12)', duration: .22 }, 7.67)
        .to('.console', { scale: .78, x: 0, y: 0, duration: .82, ease: 'power2.inOut' }, 8.05)
        .to('.product-callout', { opacity: 1, duration: .3 }, 8.45)
        .to('.product-scene', { filter: 'brightness(.38)', duration: .24 }, 8.72)
        .to('.network-node', { scale: .2, opacity: 0, stagger: .01, duration: .34 }, 8.74)
        .to('.product-scene', { opacity: 0, scale: .04, filter: 'blur(8px)', duration: .68 }, 8.82)
        .to('.network', { opacity: 0, scale: .05, duration: .55 }, 8.9)
        .to('.final-scene', { opacity: 1, pointerEvents: 'auto', duration: .25 }, 9.2)
        .fromTo('.collapse-point', { scale: 9, opacity: 1 }, { scale: 1, opacity: 1, duration: .6 }, 9.02)
        .fromTo('.final-line span', { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: .1, duration: .45 }, 9.42)
        .to('.final-line', { opacity: 0, scale: 1.35, filter: 'blur(10px)', duration: .42 }, 10.15)
        .fromTo('.final-brand', { opacity: 0, scale: .82 }, { opacity: 1, scale: 1, duration: .55 }, 10.3)
        .to('.edge-index', { opacity: 0, duration: .2 }, 9.05)

      ScrollTrigger.create({ trigger: '.nova-scroll', start: 'top top', end: 'bottom bottom', onUpdate: (self) => {
        const scenes = ['SYSTEM BOOT','SIGNAL FIELD','DECISION CORE','ACTION SEQUENCE','OPERATING CONSOLE','BRAND REVEAL']
        const thresholds = [.08, .25, .39, .54, .82]
        const index = thresholds.findIndex((threshold) => self.progress < threshold)
        const sceneIndex = index === -1 ? 5 : index
        const label = root.current?.querySelector('.edge-current')
        const number = root.current?.querySelector('.edge-index > span')
        if (label) label.textContent = scenes[sceneIndex]
        if (number) number.textContent = `0${sceneIndex + 1}`
      } })
    }, root)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const frame = root.current?.querySelector('.nova-viewport')
    const move = (event) => {
      const x = event.clientX / window.innerWidth
      const y = event.clientY / window.innerHeight
      frame?.style.setProperty('--cursor-x', `${x * 100}%`)
      frame?.style.setProperty('--cursor-y', `${y * 100}%`)
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) gsap.to('.network-node', { x: (x - .5) * 7, y: (y - .5) * 7, stagger: .008, duration: 1.2, overwrite: 'auto' })
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  return <main className="nova-scroll" id="nova-top" ref={root}>
    <div className="nova-viewport">
      <div className="nova-grid" aria-hidden="true" />
      <div className="cursor-light" aria-hidden="true" />
      <Network /><SystemChrome /><BootScene booted={booted} /><SignalScene /><DecisionCore /><ActionScene /><ProductScene /><FinalScene />
    </div>
  </main>
}
