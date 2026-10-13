import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { offers, offerMessage, contactLinks, revealBackground } from './content.js'

test('every room maps to supplied before, after and transformation assets', () => {
  offers.forEach((offer, i) => {
    for (const filename of [`door${i + 1}-before.png`, `door${i + 1}-after.png`, offer.video]) assert(existsSync(`public/demo14/${filename}`), filename)
  })
  assert(existsSync(`public${revealBackground}`))
})
test('all packages generate accurate messages without empty optional fields', () => {
  offers.forEach((offer, index) => {
    const message = offerMessage(index)
    assert(message.includes(`Package: ${offer.name}`))
    assert(message.includes(`Halloween Price: $${offer.price} USD`))
    assert(!/Name:|Website:|Project details:|\[/.test(message))
  })
})
test('optional text and encoded contact links round-trip without loss', () => {
  const message = offerMessage(2, { name: ' Alex & Co ', website: 'https://example.com/?a=1&b=2', notes: 'A “new” page\nWith #leads & enquiries.' })
  assert(message.includes('Name: Alex & Co\n'))
  const links = contactLinks(2, message)
  assert.equal(new URL(links.whatsapp).searchParams.get('text'), message)
  assert.equal(new URL(links.email).searchParams.get('body'), message)
  assert.equal(new URL(links.email).searchParams.get('subject'), 'Halloween Special Enquiry — Lead Generation Page')
  assert.equal(links.facebook, 'https://www.facebook.com/dylan.ang87/')
})
