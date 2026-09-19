export const FILM_START = 1.625
export const FILM_DISTANCE = 6.25
export const HOLD_DISTANCE = 1.35
export const FILM_END = FILM_START + FILM_DISTANCE
export const TIMELINE_DISTANCE = FILM_END + HOLD_DISTANCE
const clamp = (value) => Math.max(0, Math.min(1, value))

// One cinematic coordinate covers the portal, film, overlays and closing frame.
// Smooth density peaks create near-still reading moments, never flat locks.
const holds = [
  ...[.245, .47, .82, .95].map(time => [(FILM_START + time * FILM_DISTANCE) / TIMELINE_DISTANCE, .012]),
  [(FILM_END + .58) / TIMELINE_DISTANCE, .014],
]
const strength = 5
const total = 1 + strength * holds.reduce((sum, [, width]) => sum + width, 0)

export function scrollProgress(cinematic) {
  const time = clamp(cinematic)
  let distance = time
  for (const [center, width] of holds) {
    const offset = Math.max(-width, Math.min(width, time - center))
    distance += strength * ((offset + width) / 2 + width * Math.sin(Math.PI * offset / width) / (2 * Math.PI))
  }
  return clamp(distance / total)
}

export function masterProgress(scroll) {
  if (scroll <= 0) return 0
  if (scroll >= 1) return 1
  let low = 0, high = 1
  for (let i = 0; i < 24; i++) {
    const middle = (low + high) / 2
    if (scrollProgress(middle) < scroll) low = middle
    else high = middle
  }
  return (low + high) / 2
}

// Native scrolling stays untouched. Only the cinematic input is damped, so
// wheel, scrollbar, keyboard and trackpad share the same short response tail.
export function smoothProgress(current, target, elapsedMs, immediate = false) {
  if (immediate || Math.abs(target - current) < .00001) return target
  return current + (target - current) * (1 - Math.exp(-Math.min(elapsedMs, 64) / 75))
}
