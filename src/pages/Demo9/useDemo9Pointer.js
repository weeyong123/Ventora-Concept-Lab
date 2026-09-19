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
    let scrollTimer = 0
    let scrolling = false
    let pageTop = page.offsetTop
    let height = page.querySelector('.d9-stage').clientHeight
    let width = innerWidth
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
    function onScroll() {
      // Keep the cursor itself responsive, but suspend hit testing, magnetic
      // easing and depth work until the browser has finished scrolling.
      if (!preference.matches || !active) return
      scrolling = true
      cursor.dataset.cta = 'false'
      clearTimeout(scrollTimer)
      scrollTimer = window.setTimeout(() => { scrolling = false; schedule() }, 160)
      if (frame) { cancelAnimationFrame(frame); frame = 0 }
    }
    function resize() {
      pageTop = page.offsetTop
      height = page.querySelector('.d9-stage').clientHeight
      width = innerWidth
      reset()
    }
    function paint(time) {
      frame = 0
      const enabled = preference.matches && active
      if (scrolling && enabled) {
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`
        page.dataset.pointer = 'true'
        cursor.dataset.threshold = String(window.scrollY - pageTop < height * filmStart)
        lastTime = 0
        return
      }
      // Read hit targets before any writes. Link hit areas remain stationary;
      // only the lettering moves, avoiding hover-edge feedback loops.
      const hit = enabled ? document.elementFromPoint(x, y)?.closest('a, button') : null
      const hovered = hit && !hit.closest('[inert]') ? hit : null
      const rect = hovered?.getBoundingClientRect()
      const depthEnabled = enabled && !final.inert
      const targetX = depthEnabled ? (clamp(x / width) * 2 - 1) * 2.5 : 0
      const targetY = depthEnabled ? (clamp(y / height) * 2 - 1) * 1.5 : 0
      const blend = 1 - Math.exp(-Math.min(64, time - (lastTime || time - 16)) / 65)
      lastTime = time
      let moving = false
      const settle = (current, target) => {
        if (!preference.matches || scrolling || Math.abs(current - target) < .015) return target
        moving = true
        return current + (target - current) * blend
      }
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`
      page.dataset.pointer = String(enabled)
      cursor.dataset.threshold = String(enabled && window.scrollY - pageTop < height * filmStart)
      depthX = settle(depthX, targetX)
      depthY = settle(depthY, targetY)
      final.style.setProperty('--d9-depth-x', `${depthX}px`)
      final.style.setProperty('--d9-depth-y', `${depthY}px`)
      cursor.dataset.cta = String(Boolean(hovered))
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
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', visibility)
    preference.addEventListener('change', resize)
    if (new URLSearchParams(window.location.search).get('record') === '1' && preference.matches) {
      active = true
      x = width * .85
      y = height * .8
      schedule()
    }
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(scrollTimer)
      page.removeEventListener('pointermove', move)
      page.removeEventListener('pointerleave', reset)
      page.removeEventListener('pointercancel', reset)
      window.removeEventListener('blur', reset)
      window.removeEventListener('keydown', keyboard)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', visibility)
      preference.removeEventListener('change', resize)
      delete page.dataset.pointer
      final.style.removeProperty('--d9-depth-x')
      final.style.removeProperty('--d9-depth-y')
      links.forEach((link) => {
        link.style.removeProperty('--d9-magnet-x')
        link.style.removeProperty('--d9-magnet-y')
      })
    }
  }, [root, filmStart])
}

const clamp = (value) => Math.max(0, Math.min(1, value))
