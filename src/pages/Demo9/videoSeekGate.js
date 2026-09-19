// One decoder request at a time. Touch uses 100ms film samples during motion,
// then resolves once to the exact scroll position after the gesture settles.
// The caller runs this only in rAF, never in the raw scroll handler.
export function createVideoSeekGate() {
  let lastWrite = -Infinity
  return {
    plan({ target, duration, currentTime, seeking, readyState, now, touch, settled }) {
      if (seeking || readyState < 1 || !Number.isFinite(duration) || duration <= 0) return null
      const end = Math.max(0, duration - .001)
      const clamped = Math.max(0, Math.min(target, end))
      const boundary = clamped === 0 || clamped === end
      const time = touch && !settled && !boundary ? Math.min(end, Math.round(clamped * 10) / 10) : clamped
      const minimum = settled || boundary ? 1 / 120 : touch ? .075 : 1 / 30
      if (Math.abs(currentTime - time) < minimum) return null
      const interval = touch ? 100 : 1000 / 30
      return { time, wait: Math.max(0, interval - (now - lastWrite)) }
    },
    didWrite(now) { lastWrite = now },
  }
}
