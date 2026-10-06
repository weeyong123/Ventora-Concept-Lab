import { useEffect, useRef } from 'react'
import './Material.css'

const clamp = value => Math.max(0, Math.min(1, value))
const smooth = value => value * value * (3 - 2 * value)

export default function Material() {
  const root = useRef(null)
  useEffect(() => {
    const section = root.current
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const pointer = matchMedia('(hover: hover) and (pointer: fine)')
    let frame = 0
    const reset = () => {
      section.style.setProperty('--material-x', '0%')
      section.style.setProperty('--material-y', '0%')
    }
    const render = () => {
      frame = 0
      const box = section.getBoundingClientRect()
      // Reveal during entry, then leave a generous, fully resolved composition.
      const progress = reduced.matches ? 1 : clamp((innerHeight * .9 - box.top) / (innerHeight * .95))
      section.style.setProperty('--material-reveal', smooth(progress))
      section.style.setProperty('--material-type', smooth(clamp((progress - .12) / .68)))
      if (reduced.matches || !pointer.matches) reset()
    }
    const update = () => { if (!frame) frame = requestAnimationFrame(render) }
    const move = event => {
      if (reduced.matches || !pointer.matches) return
      const box = section.getBoundingClientRect()
      // At most 3% displacement per axis, with overscan to prevent exposed edges.
      section.style.setProperty('--material-x', `${(clamp((event.clientX - box.left) / box.width) - .5) * 6}%`)
      section.style.setProperty('--material-y', `${(clamp((event.clientY - box.top) / box.height) - .5) * 6}%`)
    }
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    section.addEventListener('pointermove', move, { passive: true })
    section.addEventListener('pointerleave', reset)
    reduced.addEventListener('change', update)
    pointer.addEventListener('change', update)
    render()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      section.removeEventListener('pointermove', move)
      section.removeEventListener('pointerleave', reset)
      reduced.removeEventListener('change', update)
      pointer.removeEventListener('change', update)
    }
  }, [])

  return (
    <section className="etat-material" ref={root} aria-labelledby="etat-material-title">
      <p className="etat-material-label">02 / MATERIAL</p>
      <figure className="etat-material-image">
        <img src="/demo10/etat/etat-material.png" alt="Extreme close-up of sculpted black fabric: fine pleats, a curved seam and a textured woven surface" width="1690" height="931" loading="lazy" decoding="async" />
      </figure>
      <h2 id="etat-material-title"><span>TEXTURE</span><span><i>BECOMES</i></span><span>LANGUAGE.</span></h2>
      <p className="etat-material-marginal" aria-hidden="true">ÉTAT / 01 &nbsp; — &nbsp; SURFACE STUDY</p>
      <p className="etat-material-caption">PLEAT / SEAM / SURFACE</p>
    </section>
  )
}
