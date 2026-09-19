// Touch uses natural decoder playback in coarse narrative ranges. Forward
// scroll only extends the destination; it never seeks or restarts active video.
export function createMobilePlayback(media, requestRender) {
  let unlocked = false, pending = false, blocked = false, disposed = false
  let target = 0, segment = 0
  const tolerance = () => target >= media.duration - .002 ? .001 : .025
  const play = () => {
    if (pending || !media.paused || blocked || disposed) return
    pending = true
    try {
      Promise.resolve(media.play()).then(() => {
        pending = false
        if (disposed) { media.pause(); return }
        unlocked = true
        if (media.currentTime >= target - tolerance()) media.pause()
        requestRender()
      }).catch(() => { pending = false; blocked = true })
    } catch { pending = false; blocked = true }
  }
  return {
    unlock() {
      if (disposed) return
      blocked = false
      if (!unlocked) play() // Must run synchronously inside the user gesture.
      else if (target > media.currentTime + .025) play()
    },
    update(time) {
      if (disposed || !Number.isFinite(media.duration)) return
      const end = Math.max(0, media.duration - .001)
      const ends = [0, 3.4, 5.9, 7.35, 8.82, end].map(value => Math.min(value, end))
      const next = time <= .01 ? 0 : Math.max(1, ends.findIndex(value => value >= Math.min(time, end)))
      if (next < segment) {
        media.pause()
        // Reverse navigation is a single frame reset per segment, not a
        // continuous seek loop. Forward motion always goes through play().
        target = ends[next]
        media.currentTime = target
      } else target = ends[next]
      segment = next
      if (media.currentTime >= target - tolerance()) {
        if (!media.paused) media.pause()
      } else if (unlocked) play()
      if (!media.paused || pending) requestRender()
    },
    dispose() { disposed = true; media.pause() },
  }
}
