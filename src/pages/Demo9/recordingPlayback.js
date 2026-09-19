// Recording-only clock. The normal scroll renderer remains the source of truth.
export function createRecordingPlayback({ requestFrame, cancelFrame, read, write, speed, end, stateChanged = () => {} }) {
  let state = 'ready'
  let frame = 0
  let last = null
  let position = 0
  const setState = (next) => { state = next; stateChanged(next) }
  const stop = (next) => {
    cancelFrame(frame)
    frame = 0
    last = null
    setState(next)
  }
  const tick = (now) => {
    frame = 0
    if (state !== 'playing') return
    const dt = last === null ? 0 : Math.min((now - last) / 1000, .05)
    last = now
    position = Math.min(end, position + dt * speed(position))
    write(position)
    if (position >= end) stop('finished')
    else frame = requestFrame(tick)
  }
  const start = () => {
    if (state === 'playing' || state === 'finished' || state === 'manual') return
    position = Math.max(0, Math.min(end, read()))
    last = null
    setState('playing')
    frame = requestFrame(tick)
  }
  return {
    get state() { return state },
    start,
    toggle() { if (state === 'playing') stop('paused'); else start() },
    pause() { if (state === 'playing') stop('paused') },
    exit() { stop('manual') },
    restart() { stop('ready'); write(0); start() },
    dispose() { cancelFrame(frame); frame = 0; state = 'manual' },
  }
}
