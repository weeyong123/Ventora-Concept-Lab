import { useEffect, useRef } from 'react'
import './CampaignEnding.css'

const clamp = value => Math.max(0, Math.min(1, value))
const smooth = value => value * value * (3 - 2 * value)

export default function CampaignEnding() {
  const root = useRef(null)
  useEffect(() => {
    const section = root.current
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    const render = () => {
      frame = 0
      const progress = reduced.matches ? 1 : clamp((innerHeight - section.getBoundingClientRect().top) / innerHeight)
      section.style.setProperty('--campaign-first', smooth(clamp((progress - .12) / .55)))
      section.style.setProperty('--campaign-last', smooth(clamp((progress - .28) / .6)))
    }
    const update = () => { if (!frame) frame = requestAnimationFrame(render) }
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    reduced.addEventListener('change', update)
    render()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      reduced.removeEventListener('change', update)
    }
  }, [])
  return (
    <section className="etat-campaign" ref={root} aria-labelledby="etat-campaign-title">
      <p className="etat-campaign-mark">ÉTAT / 01</p>
      <p className="etat-campaign-edition">COLLECTION 01 — 2026</p>
      <h2 id="etat-campaign-title"><span className="etat-campaign-line"><span>FORM IS</span></span><span className="etat-campaign-line"><span><i>A</i> DECISION.</span></span></h2>
      <div className="etat-campaign-meta"><p>VENTORA CONCEPT LAB — 10</p><a href="/ventora-showreel">EXPLORE NEXT <span aria-hidden="true">↗</span></a></div>
    </section>
  )
}
