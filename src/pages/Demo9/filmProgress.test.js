import { test } from 'node:test'
import assert from 'node:assert/strict'
import { masterProgress, scrollProgress, smoothProgress, TIMELINE_DISTANCE } from './filmProgress.js'

test('master is continuous, reversible and strictly advancing through every hold', () => {
  assert.equal(TIMELINE_DISTANCE, 9.225)
  assert.equal(masterProgress(0), 0)
  assert.equal(masterProgress(1), 1)
  let previous = 0, minimum = Infinity, maximum = 0
  for (let i = 1; i <= 10000; i++) {
    const input = i / 10000
    const current = masterProgress(input)
    const speed = (current - previous) * 10000
    assert.ok(speed > .21 && speed < 1.32)
    assert.ok(Math.abs(scrollProgress(current) - input) < 1e-6)
    minimum = Math.min(minimum, speed); maximum = Math.max(maximum, speed)
    previous = current
  }
  assert.ok(minimum / maximum < .18, 'near-still holds release into full movement')
})

test('wheel steps, fine trackpad input, fast jumps and reverse input settle without overshoot', () => {
  for (const targets of [[.1, .2, .3, .4], [.01, .02, .03, .04], [1, 0, .9, .2]]) {
    let current = 0
    for (const target of targets) {
      for (let i = 0; i < 70; i++) {
        const next = smoothProgress(current, target, 16)
        assert.ok(next >= Math.min(current, target) && next <= Math.max(current, target))
        current = next
      }
      assert.equal(current, target)
    }
  }
})

test('smoothing is refresh-rate independent and touch bypasses inertia', () => {
  const advance = (dt) => {
    let current = 0
    for (let time = 0; time < 240; time += dt) current = smoothProgress(current, 1, dt)
    return current
  }
  assert.ok(Math.abs(advance(8) - advance(16)) < 1e-12)
  assert.equal(smoothProgress(.1, .8, 16, true), .8)
})
