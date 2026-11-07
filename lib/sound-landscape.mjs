export const WORLD_WIDTH = 1400
export const WORLD_HEIGHT = 820
export const BACKGROUND = '#081c32'

const clamp = (x, a, b) => Math.max(a, Math.min(b, x))
const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

function peak(x, z, cx, cz, sx, sz, amplitude) {
  const radius = Math.sqrt(((x - cx) / sx) ** 2 + ((z - cz) / sz) ** 2 + 0.0025)
  return amplitude * Math.exp(-radius + 0.05)
}

function elevation(x, z) {
  const a = peak(x, z, -0.39, 0.27, 0.26, 0.185, 1.0)
  const b = peak(x, z, -0.88, 0.32, 0.255, 0.21, 0.64)
  const c = peak(x, z, 0.06, 0.235, 0.23, 0.16, 0.76)
  let height = (a ** 5 + b ** 5 + c ** 5) ** 0.2
  height += 0.105 * Math.exp(-(((x + 0.74) / 0.48) ** 2) - ((z - 0.58) / 0.22) ** 2)
  const river = -0.42 + 1.2 * z + 0.11 * Math.sin(5 * z - 0.4)
  const channelWidth = 0.038 + 0.125 * z * z
  const channel = Math.exp(-(((x - river) / channelWidth) ** 2))
  height *= 1 - 0.985 * channel
  height *= 1 - smooth(0.65, 0.96, z)
  height *= 0.96 + 0.028 * Math.sin(17 * x + 8 * z)
  return Math.max(0, height)
}

export function createLandscapeGeometry({ rows = 86, columns = 282 } = {}) {
  const result = []
  for (let row = 0; row < rows; row++) {
    const z = (row / (rows - 1)) ** 1.075
    const points = []
    const scale = 460 + 292 * z
    const left = (-712 - 55 * z) / scale
    const right = (712 - 55 * z) / scale
    for (let col = 0; col < columns; col++) {
      const x = left + (col / (columns - 1)) * (right - left)
      const h = elevation(x, z)
      const water = 1 - smooth(0.012, 0.095, h)
      const distance = Math.sqrt(((x - 0.53) * 1.05) ** 2 + ((z - 0.74) * 1.72) ** 2 + 0.003)
      points.push({
        x: 700 + x * scale + 55 * z,
        y: 383 + 267 * z - h * (172 + 26 * z),
        water,
        phase: distance * 22,
        swell: 8.5 * x + 7.5 * z,
        amplitude: water * (0.4 + 2.4 * Math.exp(-distance * 1.5))
      })
    }
    result.push({
      z,
      points,
      opacity: (0.29 + 0.57 * Math.sin(Math.PI * z) ** 0.5) * (1 - smooth(0.86, 1, z)),
      width: 0.78 + 0.1 * z
    })
  }
  return result
}

export function pointY(point, seconds = 0) {
  return point.y + point.amplitude * (
    0.76 * Math.sin(point.phase - seconds * 0.65) +
    0.24 * Math.sin(point.swell + seconds * 0.31)
  )
}

// The figure stands on the same projected surface, not on an arbitrary screen point.
const humanWorld = { x: 0.038, z: 0.742 }
const human = {
  x: 700 + humanWorld.x * (460 + 292 * humanWorld.z) + 55 * humanWorld.z,
  y: 383 + 267 * humanWorld.z - elevation(humanWorld.x, humanWorld.z) * (172 + 26 * humanWorld.z)
}
const humanBody = 'M-1.9,-12.4Q0,-13.8 1.9,-12.4L3.1,-7.1L2,-6.7L1.4,-10L1.1,-6.1L1.5,-.5L.2,-.5L-.3,-5.1L-.8,-.5L-2.1,-.5L-1.8,-6.2L-1.6,-9.8L-2.2,-6.8L-3.2,-7.2Z'

function paintHuman(context) {
  context.save()
  context.translate(human.x, human.y)
  context.fillStyle = '#04101f'
  context.strokeStyle = '#afd9ee'
  context.lineWidth = 0.48
  context.globalAlpha = 0.88
  context.beginPath()
  context.arc(0, -15, 1.65, 0, Math.PI * 2)
  context.fill()
  context.stroke()
  context.beginPath()
  context.moveTo(-1.9, -12.4)
  context.quadraticCurveTo(0, -13.8, 1.9, -12.4)
  for (const p of [[3.1, -7.1], [2, -6.7], [1.4, -10], [1.1, -6.1], [1.5, -0.5], [0.2, -0.5], [-0.3, -5.1], [-0.8, -0.5], [-2.1, -0.5], [-1.8, -6.2], [-1.6, -9.8], [-2.2, -6.8], [-3.2, -7.2]]) context.lineTo(...p)
  context.closePath()
  context.fill()
  context.stroke()
  context.restore()
}

function trace(context, points, seconds) {
  context.moveTo(points[0].x, pointY(points[0], seconds))
  for (let i = 1; i < points.length - 1; i++) {
    const y = pointY(points[i], seconds)
    context.quadraticCurveTo(points[i].x, y,
      (points[i].x + points[i + 1].x) / 2,
      (y + pointY(points[i + 1], seconds)) / 2)
  }
  context.lineTo(points[points.length - 1].x, pointY(points[points.length - 1], seconds))
}

export function paintLandscape(context, geometry, seconds = 0) {
  context.fillStyle = BACKGROUND
  context.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
  context.lineJoin = 'round'
  context.lineCap = 'round'
  const ink = context.createLinearGradient(0, 260, 0, 670)
  ink.addColorStop(0, '#d1efff')
  ink.addColorStop(0.38, '#a2ddfc')
  ink.addColorStop(1, '#69aad6')
  for (const row of geometry) {
    context.globalAlpha = 1
    context.beginPath()
    trace(context, row.points, seconds)
    context.lineTo(row.points[row.points.length - 1].x, WORLD_HEIGHT + 10)
    context.lineTo(row.points[0].x, WORLD_HEIGHT + 10)
    context.closePath()
    context.fillStyle = BACKGROUND
    context.fill()
    context.globalAlpha = row.opacity
    context.strokeStyle = ink
    context.lineWidth = row.width
    context.stroke()
  }
  context.globalAlpha = 1
  const edge = context.createLinearGradient(0, 0, WORLD_WIDTH, 0)
  edge.addColorStop(0, BACKGROUND)
  edge.addColorStop(0.13, 'rgba(8,28,50,0.16)')
  edge.addColorStop(0.25, 'rgba(8,28,50,0)')
  edge.addColorStop(0.88, 'rgba(8,28,50,0)')
  edge.addColorStop(1, BACKGROUND)
  context.fillStyle = edge
  context.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
  paintHuman(context)
}

export function landscapeSVG(geometry, seconds = 0) {
  const paths = []
  for (const row of geometry) {
    const points = row.points
    let d = `M${points[0].x.toFixed(1)},${pointY(points[0], seconds).toFixed(1)}`
    for (let i = 1; i < points.length - 1; i++) {
      const y = pointY(points[i], seconds)
      d += `Q${points[i].x.toFixed(1)},${y.toFixed(1)} ${((points[i].x + points[i + 1].x) / 2).toFixed(1)},${((y + pointY(points[i + 1], seconds)) / 2).toFixed(1)}`
    }
    d += `L${points[points.length - 1].x.toFixed(1)},${pointY(points[points.length - 1], seconds).toFixed(1)}L${points[points.length - 1].x.toFixed(1)},830L${points[0].x.toFixed(1)},830Z`
    paths.push(`<path d="${d}" fill="${BACKGROUND}" stroke="url(#ink)" stroke-opacity="${row.opacity.toFixed(3)}" stroke-width="${row.width.toFixed(3)}"/>`)
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="820" viewBox="0 0 1400 820" role="img" aria-label="Fine blue lines reveal a mountain range, a meandering river, and an open sea"><defs><linearGradient id="ink" x1="0" y1="260" x2="0" y2="670" gradientUnits="userSpaceOnUse"><stop stop-color="#d1efff"/><stop offset=".38" stop-color="#a2ddfc"/><stop offset="1" stop-color="#69aad6"/></linearGradient><linearGradient id="edge"><stop stop-color="${BACKGROUND}"/><stop offset=".13" stop-color="${BACKGROUND}" stop-opacity=".16"/><stop offset=".25" stop-color="${BACKGROUND}" stop-opacity="0"/><stop offset=".88" stop-color="${BACKGROUND}" stop-opacity="0"/><stop offset="1" stop-color="${BACKGROUND}"/></linearGradient></defs><rect width="1400" height="820" fill="${BACKGROUND}"/><g stroke-linecap="round" stroke-linejoin="round">${paths.join('')}</g><rect width="1400" height="820" fill="url(#edge)"/><g transform="translate(${human.x.toFixed(2)} ${human.y.toFixed(2)})" fill="#04101f" stroke="#afd9ee" stroke-width=".48" opacity=".88" stroke-linecap="round" stroke-linejoin="round"><circle cx="0" cy="-15" r="1.65"/><path d="${humanBody}"/></g></svg>`
}
