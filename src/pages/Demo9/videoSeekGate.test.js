import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createVideoSeekGate } from './videoSeekGate.js'

const input = (overrides = {}) => ({ target: 1, duration: 10.041667, currentTime: 0,
  seeking: false, readyState: 4, now: 0, touch: false, settled: false, ...overrides })

test('ignores unloaded media, busy decoders, and desktop micro-seeks', () => {
  const gate = createVideoSeekGate()
  assert.equal(gate.plan(input({ readyState: 0 })), null)
  assert.equal(gate.plan(input({ duration: NaN })), null)
  assert.equal(gate.plan(input({ seeking: true })), null)
  assert.equal(gate.plan(input({ currentTime: .98 })), null)
})

test('caps desktop writes at 30/s and replaces a pending target on reverse scroll', () => {
  const gate = createVideoSeekGate()
  gate.didWrite(100)
  const waiting = gate.plan(input({ target: 8, now: 110 }))
  assert.ok(waiting.wait > 23)
  const reverse = gate.plan(input({ currentTime: 6, target: 2, now: 134 }))
  assert.equal(reverse.wait, 0)
  assert.equal(reverse.time, 2)
})

test('touch samples in tenths, caps requests at 10/s, then settles accurately', () => {
  const gate = createVideoSeekGate()
  assert.equal(gate.plan(input({ touch: true, target: 2.347 })).time, 2.3)
  gate.didWrite(100)
  assert.equal(gate.plan(input({ touch: true, target: 3, now: 150 })).wait, 50)
  assert.equal(gate.plan(input({ touch: true, currentTime: 2.3, target: 2.347, now: 300 })), null)
  assert.equal(gate.plan(input({ touch: true, settled: true, currentTime: 2.3, target: 2.347, now: 300 })).time, 2.347)
})

test('retains precise start/end boundaries and stops after settling', () => {
  const gate = createVideoSeekGate()
  assert.equal(gate.plan(input({ target: -10, currentTime: 4 })).time, 0)
  assert.ok(Math.abs(gate.plan(input({ target: 100, touch: true })).time - 10.040667) < 1e-9)
  assert.equal(gate.plan(input({ target: 3.127, currentTime: 3.127, settled: true })), null)
})

for (const touch of [false, true]) {
  test(`${touch ? 'touch' : 'desktop'} rapid forward/reverse bursts stay bounded and use the latest target`, () => {
    const gate = createVideoSeekGate()
    let currentTime = 0
    const writes = []
    for (let now = 0; now < 2000; now += 8) {
      const target = now < 1000 ? now / 100 : (2000 - now) / 100
      const plan = gate.plan(input({ touch, now, target, currentTime }))
      if (plan && plan.wait === 0) {
        currentTime = plan.time
        gate.didWrite(now)
        writes.push(now)
      }
    }
    for (let i = 1; i < writes.length; i++) assert.ok(writes[i] - writes[i - 1] >= (touch ? 100 : 1000 / 30))
    assert.ok(writes.length <= (touch ? 20 : 60))
    const last = gate.plan(input({ touch, now: 2200, target: .08, currentTime, settled: true }))
    if (last) currentTime = last.time
    assert.ok(Math.abs(currentTime - .08) < 1 / 120)
  })
}
