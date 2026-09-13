import { readFileSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { resolve, relative } from 'node:path'
const root = resolve(import.meta.dirname, '..')
const read = name => readFileSync(resolve(root, name), 'utf8')
const baseline = JSON.parse(read('preservation/demo-5.sha256.json'))
function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(resolve(dir, e.name)) : [relative(root, resolve(dir, e.name))]).sort()
}
function check(ok, message) { if (!ok) throw new Error('Demo 5 is FROZEN / PRESERVED: ' + message) }
check(JSON.stringify(files(resolve(root, 'public/followthrough'))) === JSON.stringify(Object.keys(baseline.files).sort()), 'asset inventory changed')
for (const [file, expected] of Object.entries(baseline.files)) {
  check(createHash('sha256').update(readFileSync(resolve(root, file))).digest('hex') === expected, file + ' changed; explicit Demo 5 update authorization required')
}
const rewrites = JSON.parse(read('vercel.json')).rewrites
check(rewrites[0]?.source === '/followthrough' && rewrites[0]?.destination === '/followthrough/index.html', 'permanent route must precede generic rewrites')
check(read('vite.config.js').includes("name: 'preserved-demo-5'"), 'isolated development handler missing')
check(read('CONCEPTS.md').includes('Demo 5 — FROZEN / PRESERVED'), 'catalog freeze marker missing')
console.log('Demo 5: frozen asset checksums, inventory and permanent route verified.')
