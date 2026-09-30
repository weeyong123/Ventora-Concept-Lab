import { useEffect, useRef } from 'react'

const frames = Array.from({ length: 16 }, (_, index) =>
  `/demo11/orbita-h1-rotation-16/orbita-rotate-${String(index + 1).padStart(2, '0')}.webp`)
const pixelsPerFrame = 24

export default function HeroRotation() {
  const image = useRef(null)

  useEffect(() => {
    const element = image.current
    let disposed = false
    let ready = false
    let current = 0
    let distance = 0
    let pointer = null
    let lastX = 0
    let startY = 0
    let axis = null
    let targetFrame = 0
    let easedFrame = 0
    let animation = 0
    let lastTick = 0
    let hoverX = null
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    // Retain decoded images for the lifetime of the viewer. Only src changes;
    // pointer movement never re-renders the Hero or its surrounding sections.
    const decoded = frames.map(src => {
      const frame = new Image()
      frame.decoding = 'async'
      frame.src = src
      return frame
    })
    Promise.all(decoded.map(frame => frame.decode())).then(() => {
      if (disposed) return
      ready = true
      element.dataset.ready = 'true'
      element.tabIndex = 0
      element.setAttribute('role', 'slider')
      element.setAttribute('aria-label', 'Rotate ORBITA H1 headphones')
      element.setAttribute('aria-valuemin', '1')
      element.setAttribute('aria-valuemax', '16')
      element.setAttribute('aria-valuenow', '1')
      element.setAttribute('aria-valuetext', 'View 1 of 16')
    }).catch(() => {
      // If any frame fails, keep the first image as a usable static fallback.
    })
    const show = index => {
      current = Math.min(15, Math.max(0, index))
      if (element.src !== decoded[current].src) element.src = decoded[current].src
      element.setAttribute('aria-valuenow', String(current + 1))
      element.setAttribute('aria-valuetext', `View ${current + 1} of 16`)
    }
    const stopFollowing = () => {
      cancelAnimationFrame(animation)
      animation = 0
      lastTick = 0
      targetFrame = easedFrame = current
      hoverX = null
    }
    const tick = time => {
      const elapsed = lastTick ? Math.min(time - lastTick, 50) : 16.67
      lastTick = time
      // A shorter response removes floatiness; limit each rendered advance so
      // fast pointer travel still visits the intermediate source angles.
      const response = (targetFrame - easedFrame) * (1 - Math.exp(-elapsed / 95))
      const maxStep = Math.min(1, elapsed / 16.67)
      easedFrame += Math.max(-maxStep, Math.min(maxStep, response))
      show(Math.round(easedFrame))
      if (Math.abs(targetFrame - easedFrame) > 0.015) animation = requestAnimationFrame(tick)
      else { easedFrame = targetFrame; animation = 0; lastTick = 0 }
    }
    const enter = event => {
      if (event.pointerType !== 'mouse') return
      stopFollowing()
      hoverX = event.clientX
    }
    const leave = event => {
      if (event.pointerType === 'mouse') stopFollowing()
    }
    const follow = event => {
      if (!ready || pointer !== null) return
      if (hoverX === null) { hoverX = event.clientX; return }
      // Relative pointer position within the existing image area: a full-width
      // traverse covers the sequence. Re-entry anchors to the retained angle.
      const width = element.getBoundingClientRect().width
      targetFrame = Math.min(15, Math.max(0,
        targetFrame + (event.clientX - hoverX) / Math.max(1, width) * 15))
      hoverX = event.clientX
      if (reducedMotion.matches) {
        easedFrame = targetFrame
        show(Math.round(targetFrame))
      } else if (!animation) animation = requestAnimationFrame(tick)
    }
    const finish = () => {
      const active = pointer
      pointer = null
      axis = null
      distance = 0
      delete element.dataset.dragging
      if (active !== null && element.hasPointerCapture(active)) element.releasePointerCapture(active)
    }
    const down = event => {
      if (event.pointerType === 'mouse' || !ready || !event.isPrimary || event.button !== 0 || pointer !== null) return
      stopFollowing()
      pointer = event.pointerId
      lastX = event.clientX
      startY = event.clientY
      distance = 0
      axis = null
      // Wait for clear horizontal intent before explicitly capturing touch.
    }
    const move = event => {
      if (event.pointerType === 'mouse') { follow(event); return }
      if (event.pointerId !== pointer) return
      const dx = event.clientX - lastX
      if (!axis) {
        const dy = Math.abs(event.clientY - startY)
        if (Math.max(Math.abs(dx), dy) < 10) return
        if (dy >= Math.abs(dx)) { finish(); return }
        if (Math.abs(dx) < dy * 1.35) return
        axis = 'horizontal'
        element.setPointerCapture(pointer)
        element.dataset.dragging = 'true'
      }
      lastX = event.clientX
      distance += dx
      const steps = Math.trunc(distance / pixelsPerFrame)
      if (steps) {
        show(current + steps)
        distance -= steps * pixelsPerFrame
      }
      // Discard outward travel at the ends so reversal responds immediately.
      if ((current === 0 && distance < 0) || (current === 15 && distance > 0)) distance = 0
    }
    const up = event => { if (event.pointerId === pointer) finish() }
    const key = event => {
      if (!ready) return
      const target = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: 15 }[event.key]
      if (target === undefined) return
      event.preventDefault()
      show(target)
      stopFollowing()
    }
    const preventDrag = event => event.preventDefault()
    const reset = () => { stopFollowing(); finish() }
    const visibility = () => { if (document.hidden) reset() }
    element.addEventListener('pointerenter', enter)
    element.addEventListener('pointerleave', leave)
    reducedMotion.addEventListener('change', stopFollowing)
    document.addEventListener('visibilitychange', visibility)
    element.addEventListener('pointerdown', down)
    element.addEventListener('pointermove', move)
    element.addEventListener('pointerup', up)
    element.addEventListener('pointercancel', up)
    element.addEventListener('lostpointercapture', up)
    element.addEventListener('keydown', key)
    element.addEventListener('dragstart', preventDrag)
    window.addEventListener('blur', reset)
    return () => {
      disposed = true
      reset()
      element.removeEventListener('pointerenter', enter)
      element.removeEventListener('pointerleave', leave)
      reducedMotion.removeEventListener('change', stopFollowing)
      document.removeEventListener('visibilitychange', visibility)
      element.removeEventListener('pointerdown', down)
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerup', up)
      element.removeEventListener('pointercancel', up)
      element.removeEventListener('lostpointercapture', up)
      element.removeEventListener('keydown', key)
      element.removeEventListener('dragstart', preventDrag)
      window.removeEventListener('blur', reset)
    }
  }, [])

  return <img ref={image} className="d11-product d11-rotation" src={frames[0]}
    alt="ORBITA H1 headphones in brushed champagne metal and graphite"
    fetchPriority="high" width="1106" height="1422" draggable={false} />
}
