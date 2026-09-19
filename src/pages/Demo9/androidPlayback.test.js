import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createAndroidPlayback, isAndroidPlayback } from './androidPlayback.js'

function setup(readyState = 4) {
  const events = new Map(), diagnostics = []
  let loads = 0, plays = 0, pauses = 0, retry = false
  const media = { readyState, duration: readyState ? 10.041667 : NaN, currentTime: 0, paused: true,
    load() { loads++ },
    play() { plays++; this.paused = false; return Promise.resolve() },
    pause() { pauses++; this.paused = true },
    addEventListener(name, fn) { events.set(name, fn) },
    removeEventListener(name) { events.delete(name) },
  }
  const controller = createAndroidPlayback(media, () => {}, value => { retry = value }, info => diagnostics.push(info))
  return { media, controller, events, diagnostics, counts: () => ({ loads, plays, pauses, retry }) }
}
const flush = async () => { await Promise.resolve(); await Promise.resolve() }

test('Android Chrome and Samsung Internet selected; iPhone and desktop excluded', () => {
  assert.equal(isAndroidPlayback('Mozilla Android Chrome/140 Mobile', true), true)
  assert.equal(isAndroidPlayback('Mozilla Android SamsungBrowser/28 Chrome/130', true), true)
  assert.equal(isAndroidPlayback('Mozilla iPhone AppleWebKit Safari', true), false)
  assert.equal(isAndroidPlayback('Mozilla Macintosh Chrome', false), false)
})

test('missing metadata loads once and waits for actual data before play', async () => {
  const f = setup(0)
  f.controller.unlock(); f.controller.unlock(); f.controller.update(3)
  assert.deepEqual(f.counts(), { loads: 1, plays: 0, pauses: 0, retry: false })
  f.media.readyState = 1; f.media.duration = 10.041667
  f.controller.update(3); f.events.get('canplay')()
  assert.equal(f.counts().plays, 0)
  f.media.readyState = 2; f.events.get('loadeddata')()
  await flush()
  assert.equal(f.counts().plays, 1)
  assert.equal(f.counts().pauses, 0)
  assert.equal(f.media.muted, true)
  f.controller.dispose()
})

test('play resolves, 500ms diagnostic advances, repeated scroll does not pause or restart', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const f = setup()
  f.controller.update(3); f.controller.unlock(); await flush()
  for (let i = 0; i < 30; i++) { f.controller.update(3); f.controller.unlock() }
  assert.equal(f.counts().plays, 1)
  assert.equal(f.counts().pauses, 0)
  f.media.currentTime = .5
  t.mock.timers.tick(500)
  assert.equal(f.diagnostics.at(-1).advanced, true)
  assert.equal(f.diagnostics.at(-1).paused, false)
  f.controller.dispose()
})

test('rejection offers tap retry and scroll cannot repeatedly retry', async () => {
  const f = setup()
  f.media.play = () => Promise.reject(new Error('NotAllowedError'))
  f.controller.update(3); f.controller.unlock(); await flush()
  assert.equal(f.counts().retry, true)
  f.media.play = () => { f.media.paused = false; return Promise.resolve() }
  f.controller.unlock(); f.controller.update(3)
  assert.equal(f.media.paused, true)
  f.controller.unlock(true); await flush()
  assert.equal(f.media.paused, false)
  assert.equal(f.counts().retry, false)
  f.controller.dispose()
})

test('intro permission unlock occurs once; pending play is not cancelled by renderer', async () => {
  const f = setup()
  f.controller.unlock(); f.controller.update(0)
  assert.equal(f.counts().pauses, 0)
  await flush()
  assert.equal(f.counts().pauses, 1)
  for (let i = 0; i < 10; i++) f.controller.unlock()
  assert.equal(f.counts().plays, 1)
  f.controller.dispose()
})
