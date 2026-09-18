import { CanvasTexture, SRGBColorSpace, LinearMipmapLinearFilter } from 'three'

function textureFrom(canvas) {
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.minFilter = LinearMipmapLinearFilter
  texture.generateMipmaps = true
  texture.anisotropy = 8
  return texture
}

// Deliberately abstract placeholder frames, authored locally rather than borrowed projects.
export function makeFilmTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 8192
  canvas.height = 640
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#181714'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  const cell = canvas.width / 12
  for (let i = 0; i < 12; i++) {
    const x = i * cell + 20, w = cell - 40
    ctx.save()
    ctx.beginPath(); ctx.rect(x, 94, w, 450); ctx.clip()
    ctx.fillStyle = ['#b2a58c', '#292d2c', '#776851', '#ded6c4'][i % 4]
    ctx.fillRect(x, 94, w, 450)
    if (i % 3 === 0) {
      // Architectural light study.
      for (let j = 0; j < 9; j++) {
        const bx = x + j * w / 7
        const gradient = ctx.createLinearGradient(bx, 0, bx + 90, 0)
        gradient.addColorStop(0, '#171b1a'); gradient.addColorStop(.65, '#665f4e'); gradient.addColorStop(1, '#d4bd87')
        ctx.fillStyle = gradient
        ctx.fillRect(bx, 94 + j * 12, 63, 480)
      }
    } else if (i % 3 === 1) {
      // Abstract sculpture study.
      const gradient = ctx.createRadialGradient(x + w * .37, 230, 0, x + w / 2, 325, 235)
      gradient.addColorStop(0, '#e5d4ae'); gradient.addColorStop(.42, '#827560'); gradient.addColorStop(.75, '#292b28'); gradient.addColorStop(1, '#101615')
      ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(x + w / 2, 310, 187, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = '#c6ba9c'; ctx.lineWidth = 2
      ctx.beginPath(); ctx.ellipse(x + w / 2, 310, 240, 83, -.5, 0, Math.PI * 2); ctx.stroke()
    } else {
      ctx.fillStyle = i % 2 ? '#282824' : '#e3d8bd'
      ctx.font = 'bold 125px Arial'; ctx.fillText(['FORM', 'IDEA', 'MAKE', 'CULTURE'][i % 4], x + 27, 263)
      ctx.font = 'italic 115px Georgia'; ctx.fillText('in motion.', x + 24, 392)
      ctx.lineWidth = 1; ctx.strokeStyle = ctx.fillStyle
      ctx.beginPath(); ctx.moveTo(x + 30, 460); ctx.lineTo(x + w - 30, 460); ctx.stroke()
    }
    ctx.restore()
    ctx.fillStyle = '#c4b392'; ctx.font = '17px monospace'
    ctx.fillText(`0${i + 1}  /  VISUAL STUDY`, x + 8, 584)
    ctx.fillText('35 MM    ◇', x + w - 150, 584)
  }
  // True transparent sprocket perforations in the film stock.
  for (let x = 16; x < canvas.width; x += 64) {
    ctx.clearRect(x, 19, 32, 35)
    ctx.clearRect(x, 601, 32, 25)
  }
  ctx.fillStyle = '#c6ac78'
  ctx.fillRect(0, 72, canvas.width, 2)
  ctx.fillRect(0, 553, canvas.width, 2)
  return textureFrom(canvas)
}

export function makeWords(lines, label, color = '#e9e1d1') {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = lines.length * 230 + 120
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#b6a17e'; ctx.font = '25px monospace'; ctx.fillText(label, 12, 36)
  ctx.fillStyle = color; ctx.font = '500 220px Arial'
  lines.forEach((line, index) => ctx.fillText(line, 0, 260 + index * 230))
  return { texture: textureFrom(canvas), aspect: canvas.width / canvas.height }
}
