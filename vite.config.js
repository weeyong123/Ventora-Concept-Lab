import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { createReadStream } from 'node:fs'
import { fileURLToPath } from 'node:url'

// Demo 5 is an isolated document: never import the shared React application.
const demo5File = fileURLToPath(new URL('./public/followthrough/index.html', import.meta.url))
function serveDemo5(server) {
  server.middlewares.use((req, res, next) => {
    const pathname = new URL(req.url, 'http://localhost').pathname
    if (pathname !== '/followthrough' && pathname !== '/followthrough/') return next()
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    createReadStream(demo5File).on('error', next).pipe(res)
  })
}
export default defineConfig({
  plugins: [react(), {
    name: 'preserved-demo-5',
    configureServer: serveDemo5,
    configurePreviewServer: serveDemo5,
  }],
})
