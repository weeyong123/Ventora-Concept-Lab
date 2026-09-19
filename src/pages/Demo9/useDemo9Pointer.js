import { useEffect } from 'react'

// Independent of the film timeline: this hook never reads or writes media time.
export default function useDemo9Pointer(root, filmStart) {
  useEffect(() => {
    const page = root.current
    const cursor = page.querySelector('.d9-cursor')
    const final = page.querySelector('.d9-final')
    const links = [...page.querySelectorAll('.d9-actions a')]
    const preference = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    let frame = 0
    let active = false
    let x = 0
    let y = 0
    let depthX = 0
    let depthY = 0
    let lastTime = 0
    const magnets = links.map((link) => ({ link, x: 0, y: 0 }))

    function schedule() {
      if (!frame) frame = requestAnimationFrame(paint)
    }
    function reset() {
      active = false
      page.dataset.pointer = 'false'
      cursor.dataset.cta = 'false'
      schedule()
    }
    function paint(time) {
      frame = 0
      const enabled = preference.matches && active
      // Read hit targets before any writes. Link hit areas remain stationary;
      // only the lettering moves, avoiding hover-edge feedback loops.
      const hit = enabled ? document.elementFromPoint(x, y)?.closest('a, button') : null
      const hovered = hit && !hit.closest('[inert]') ? hit : null
      const rect = hovered?.getBoundingClientRect()
      const threshold = enabled && -page.getBoundingClientRect().top < innerHeight * filmStart
      const depthEnabled = enabled && !final.inert
      const targetX = depthEnabled ? (clamp(x / innerWidth) * 2 - 1) * 2.5 : 0
      const targetY = depthEnabled ? (clamp(y / innerHeight) * 2 - 1) * 1.5 : 0
      const blend = 1 - Math.exp(-Math.min(64, time - (lastTime || time - 16)) / 65)
      lastTime = time
      let moving = false
      const settle = (current, target) => {
        if (!preference.matches || Math.abs(current - target) < .015) return target
        moving = true
        return current + (target - current) * blend
      }
      depthX = settle(depthX, targetX)
      depthY = settle(depthY, targetY)
      page.style.setProperty('--d9-depth-x', `${depthX}px`)
      page.style.setProperty('--d9-depth-y', `${depthY}px`)
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`
      cursor.dataset.cta = String(Boolean(hovered))
      cursor.dataset.threshold = String(threshold)
      page.dataset.pointer = String(enabled)
      magnets.forEach((magnet) => {
        const over = hovered === magnet.link
        const mx = over ? (clamp((x - rect.left) / rect.width) * 2 - 1) * 3.5 : 0
        const my = over ? (clamp((y - rect.top) / rect.height) * 2 - 1) * 2.25 : 0
        magnet.x = settle(magnet.x, mx)
        magnet.y = settle(magnet.y, my)
        magnet.link.style.setProperty('--d9-magnet-x', `${magnet.x}px`)
        magnet.link.style.setProperty('--d9-magnet-y', `${magnet.y}px`)
      })
      // Stop requesting frames as soon as the tiny offsets settle.
      if (moving) schedule()
      else lastTime = 0
    }
    function move(event) {
      if (!preference.matches || event.pointerType !== 'mouse') { reset(); return }
      active = true
      x = event.clientX
      y = event.clientY
      schedule()
    }
    function keyboard(event) { if (event.key === 'Tab') reset() }
    function visibility() { if (document.hidden) reset() }
    page.addEventListener('pointermove', move, { passive: true })
    page.addEventListener('pointerleave', reset)
    page.addEventListener('pointercancel', reset)
    window.addEventListener('blur', reset)
    window.addEventListener('keydown', keyboard)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', reset)
    document.addEventListener('visibilitychange', visibility)
    preference.addEventListener('change', reset)
    return () => {
      cancelAnimationFrame(frame)
      page.removeEventListener('pointermove', move)
      page.removeEventListener('pointerleave', reset)
      page.removeEventListener('pointercancel', reset)
      window.removeEventListener('blur', reset)
      window.removeEventListener('keydown', keyboard)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', reset)
      document.removeEventListener('visibilitychange', visibility)
      preference.removeEventListener('change', reset)
      delete page.dataset.pointer
      page.style.removeProperty('--d9-depth-x')
      page.style.removeProperty('--d9-depth-y')
      links.forEach((link) => {
        link.style.removeProperty('--d9-magnet-x')
        link.style.removeProperty('--d9-magnet-y')
      })
    }
  }, [root, filmStart])
}

const clamp = (value) => Math.max(0, Math.min(1, value))
