import { useEffect, useRef } from 'react'

const sparks = Array.from({ length: 24 }, (_, i) => i)
export default function HauntedPointer({ cinematic }) {
  const ref = useRef(null)
  useEffect(() => {
    const node = ref.current
    const core = node.querySelector('.haunt-pointer-core')
    const particles = [...node.querySelectorAll('.haunt-pointer-spark')]
    const seal = node.querySelector('.haunt-pointer-sigil')
    const media = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    let frame = 0, index = 0, lastSpark = 0
    const hide = () => {
      cancelAnimationFrame(frame)
      node.style.opacity = '0'
      node.getAnimations({ subtree: true }).forEach(animation => animation.cancel())
    }
    const allowed = event => media.matches && !cinematic && event.pointerType !== 'touch' && !event.target.closest('input, textarea, select')
    const emit = (x, y, burst = false) => {
      const particle = particles[index++ % particles.length]
      particle.getAnimations().forEach(animation => animation.cancel())
      const angle = Math.random() * Math.PI * 2
      const distance = burst ? 35 + Math.random() * 65 : 12 + Math.random() * 22
      particle.animate([
        { transform: `translate(${x}px,${y}px) scale(${burst ? 1.4 : 1})`, opacity: .85 },
        { transform: `translate(${x + Math.cos(angle) * distance}px,${y + (burst ? Math.sin(angle) * distance : -distance)}px) scale(0)`, opacity: 0 },
      ], { duration: burst ? 850 : 700, easing: 'ease-out' })
    }
    const move = event => {
      if (!allowed(event)) { hide(); return }
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        core.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
        node.style.opacity = '1'
        node.classList.toggle('is-inviting', Boolean(event.target.closest('button, a, label')))
        if (performance.now() - lastSpark > 35) {
          emit(event.clientX, event.clientY)
          lastSpark = performance.now()
        }
      })
    }
    const press = event => {
      if (!allowed(event)) return
      node.style.opacity = '1'
      core.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
      seal.getAnimations().forEach(animation => animation.cancel())
      seal.animate([{ transform: 'scale(.45) rotate(-35deg)', opacity: 1 }, { transform: 'scale(2.1) rotate(35deg)', opacity: 0 }], { duration: 750, easing: 'ease-out' })
      for (let i = 0; i < 12; i++) emit(event.clientX, event.clientY, true)
    }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', press, { passive: true })
    window.addEventListener('blur', hide)
    window.addEventListener('scroll', hide, { passive: true })
    document.documentElement.addEventListener('pointerleave', hide)
    media.addEventListener('change', hide)
    hide()
    return () => {
      hide()
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', press)
      window.removeEventListener('blur', hide)
      window.removeEventListener('scroll', hide)
      document.documentElement.removeEventListener('pointerleave', hide)
      media.removeEventListener('change', hide)
    }
  }, [cinematic])
  return <div ref={ref} className="haunt-pointer" aria-hidden="true"><div className="haunt-pointer-core"><i className="haunt-pointer-mist"/><i className="haunt-pointer-ring"/><i className="haunt-pointer-ember"/><svg className="haunt-pointer-sigil" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="32"/><circle cx="40" cy="40" r="25" strokeDasharray="16 5 2 5"/><path d="m40 12 24 42H16ZM40 2v9m0 58v9M2 40h9m58 0h9M17 17l6 6m34 34 6 6M17 63l6-6m34-34 6-6"/></svg></div>{sparks.map(i => <i key={i} className="haunt-pointer-spark"/>)}</div>
}
