// Android Chrome / Samsung Internet only. iPhone retains mobilePlayback.js.
export const isAndroidPlayback = (userAgent, coarse) => coarse && /Android/i.test(userAgent)

export function createAndroidPlayback(media, requestRender, showRetry, diagnose = () => {}, allowed = () => true) {
  let target = 0, segment = 0, pending = false, disposed = false
  let granted = false
  let interacted = false, blocked = false, loaded = false, sampleTimer = 0
  const tolerance = () => target >= media.duration - .002 ? .001 : .025
  const needsMotion = () => media.currentTime < target - tolerance()
  const reject = (error) => {
    pending = false
    if (disposed) return
    blocked = true
    showRetry(true)
    diagnose({ event: 'play-rejected', reason: error?.name, readyState: media.readyState })
  }
  const start = () => {
    if (disposed || !allowed() || !interacted || blocked || pending || !media.paused) return
    if (media.readyState < 2 || !Number.isFinite(media.duration)) {
      // One explicit load; never reload on subsequent scrolls/readiness events.
      if (!loaded) { loaded = true; media.load() }
      return
    }
    pending = true
    media.muted = true
    media.playsInline = true
    media.preload = 'auto'
    try {
      Promise.resolve(media.play()).then(() => {
        pending = false
        if (disposed) { media.pause(); return }
        granted = true
        if (!allowed()) { media.pause(); return }
        showRetry(false)
        diagnose({ event: 'play-resolved', readyState: media.readyState, currentTime: media.currentTime })
        if (!needsMotion()) media.pause() // Permission unlock in the intro only.
        else {
          clearTimeout(sampleTimer)
          const before = media.currentTime
          sampleTimer = setTimeout(() => {
            if (disposed) return
            const after = media.currentTime
            diagnose({ event: 'playback-500ms', before, after, advanced: after > before, paused: media.paused })
            if (needsMotion() && after <= before) {
              blocked = true
              showRetry(true)
            }
          }, 500)
        }
        requestRender()
      }).catch(reject)
    } catch (error) { reject(error) }
  }
  const ready = () => { if (interacted && (!granted || needsMotion())) start(); requestRender() }
  media.addEventListener('loadeddata', ready)
  media.addEventListener('canplay', ready)
  return {
    unlock(retry = false) {
      if (disposed || (blocked && !retry)) return
      interacted = true
      if (retry) {
        if (blocked && !media.paused) media.pause()
        blocked = false
      }
      if (!granted || needsMotion()) start()
    },
    update(time) {
      if (disposed) return
      if (!Number.isFinite(media.duration)) { if (interacted) start(); return }
      const end = Math.max(0, media.duration - .001)
      const ends = [0, 3.4, 5.9, 7.35, 8.82, end].map(value => Math.min(value, end))
      const next = time <= .01 ? 0 : Math.max(1, ends.findIndex(value => value >= Math.min(time, end)))
      target = ends[next]
      if (next < segment) { media.pause(); media.currentTime = target }
      segment = next
      // Don't pause a pending play request: Android may dispatch play before
      // resolving it. Only its resolution or the reached endpoint may pause.
      if (!pending && !needsMotion()) { if (!media.paused) media.pause() }
      else if (needsMotion()) start()
      if (!media.paused) requestRender()
    },
    dispose() {
      disposed = true
      clearTimeout(sampleTimer)
      media.removeEventListener('loadeddata', ready)
      media.removeEventListener('canplay', ready)
      media.pause()
    },
  }
}
