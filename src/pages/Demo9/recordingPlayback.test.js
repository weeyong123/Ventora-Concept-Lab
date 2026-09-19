import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRecordingPlayback } from './recordingPlayback.js'

function fixture() {
  let position = 0, id = 0
  const pending = new Map()
  const writes = []
  const playback = createRecordingPlayback({
    requestFrame(fn) { pending.set(++id, fn); return id },
    cancelFrame(id) { pending.delete(id) },
    read: () => position,
    write(value) { position = value; writes.push(value) },
    speed: () => .38, end: 9.225,
  })
  return { playback, writes, pending, tick(now) {
    const callbacks = [...pending.values()]; pending.clear()
    callbacks.forEach(fn => fn(now))
  } }
}

test('idle until started, continuous bounded motion, exact final stop with no loop', () => {
  const f = fixture()
  assert.equal(f.pending.size, 0)
  f.playback.start(); f.playback.start()
  assert.equal(f.pending.size, 1)
  for (let t = 0; t < 30000; t += 1000 / 60) f.tick(t)
  assert.equal(f.playback.state, 'finished')
  assert.equal(f.pending.size, 0)
  assert.equal(f.writes.at(-1), 9.225)
  for (let i = 1; i < f.writes.length; i++) {
    assert.ok(f.writes[i] > f.writes[i - 1])
    assert.ok(f.writes[i] - f.writes[i - 1] < .007)
  }
})

test('pause/resume, restart and Escape preserve control without background motion', () => {
  const f = fixture()
  f.playback.start(); f.tick(0); f.tick(16)
  f.playback.toggle()
  const paused = f.writes.at(-1)
  f.tick(1000)
  assert.equal(f.writes.at(-1), paused)
  f.playback.toggle(); f.tick(2000)
  assert.equal(f.writes.at(-1), paused)
  f.tick(2016)
  assert.ok(f.writes.at(-1) > paused)
  f.playback.exit(); f.playback.start()
  assert.equal(f.pending.size, 0)
  assert.equal(f.playback.state, 'manual')
  f.playback.restart()
  assert.equal(f.writes.at(-1), 0)
  assert.equal(f.playback.state, 'playing')
  f.playback.dispose()
  assert.equal(f.pending.size, 0)
})
