import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createMobilePlayback } from './mobilePlayback.js'

function setup() {
  let plays = 0, seeks = 0, time = 0
  const media = { duration: 10.041667, paused: true,
    get currentTime() { return time },
    set currentTime(value) { seeks++; time = value },
    play() { plays++; this.paused = false; return Promise.resolve() },
    pause() { this.paused = true },
  }
  const controller = createMobilePlayback(media, () => {})
  return { media, controller, plays: () => plays, seeks: () => seeks,
    advance(seconds) { if (!media.paused) time += seconds } }
}

test('unlock then natural forward playback advances after 500ms without seeking or restarting', async () => {
  const f = setup()
  f.controller.unlock(); await Promise.resolve()
  assert.equal(f.media.paused, true)
  f.controller.update(2)
  await Promise.resolve()
  const before = f.media.currentTime
  f.advance(.5)
  assert.ok(f.media.currentTime > before)
  for (let i = 0; i < 30; i++) f.controller.update(2 + i / 100)
  assert.equal(f.plays(), 2)
  assert.equal(f.seeks(), 0)
  f.advance(2.9); f.controller.update(2.5)
  assert.equal(f.media.paused, true)
  f.controller.update(4); await Promise.resolve()
  assert.equal(f.media.paused, false)
  assert.equal(f.plays(), 3)
})

test('reverse resets once; final segment reaches the end-frame blend', async () => {
  const f = setup()
  f.controller.unlock(); await Promise.resolve()
  f.controller.update(10.041667); await Promise.resolve()
  f.advance(10.02); f.controller.update(10.041667)
  assert.equal(f.media.paused, false)
  f.advance(.02); f.controller.update(10.041667)
  assert.equal(f.media.paused, true)
  f.controller.update(4)
  assert.equal(f.seeks(), 1)
  assert.equal(f.media.currentTime, 5.9)
  f.controller.update(4)
  assert.equal(f.seeks(), 1)
  f.controller.dispose()
})

test('play rejection waits for a new gesture rather than retrying every frame', async () => {
  const f = setup()
  let attempts = 0
  f.media.play = () => { attempts++; return Promise.reject(new Error('NotAllowedError')) }
  f.controller.unlock(); await Promise.resolve(); await Promise.resolve()
  for (let i = 0; i < 30; i++) f.controller.update(2)
  assert.equal(attempts, 1)
  f.controller.unlock()
  assert.equal(attempts, 2)
  await Promise.resolve(); await Promise.resolve()
  f.controller.dispose()
})
