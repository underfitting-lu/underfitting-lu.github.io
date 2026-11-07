import { useEffect, useRef, useState } from 'react'
import { createLandscapeGeometry, paintLandscape, WORLD_WIDTH, WORLD_HEIGHT } from '../lib/sound-landscape.mjs'

export default function SoundLandscape() {
  const canvasRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    const context = canvas?.getContext('2d', { alpha: false })
    if (!host || !context) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const compact = window.matchMedia('(max-width: 600px)')
    let geometry
    let mobile
    let frame = null
    let disposed = false
    let visible = true
    let width = 0
    let height = 0
    let dpr = 1
    let lastTime = 0
    let clock = 0
    let previousTimestamp = 0
    let painted = false

    const active = () => !disposed && visible && !document.hidden
    function requestFrame() {
      if (frame === null && active()) frame = requestAnimationFrame(render)
    }
    function render(timestamp) {
      frame = null
      if (!active() || !width || !height) return
      if (!motion.matches && timestamp - lastTime < 1000 / (mobile ? 16 : 24)) {
        requestFrame()
        return
      }
      if (previousTimestamp && !motion.matches) clock += Math.min(0.1, (timestamp - previousTimestamp) / 1000)
      previousTimestamp = timestamp
      lastTime = timestamp
      const scale = Math.max(width / WORLD_WIDTH, height / WORLD_HEIGHT)
      const offsetX = (width - WORLD_WIDTH * scale) * 0.5
      const offsetY = (height - WORLD_HEIGHT * scale) * 0.5
      context.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * offsetX, dpr * offsetY)
      paintLandscape(context, geometry, motion.matches ? 0 : clock)
      if (!painted) { painted = true; setReady(true) }
      if (!motion.matches) requestFrame()
    }
    function resize() {
      width = host.clientWidth
      height = host.clientHeight
      if (mobile !== compact.matches) {
        mobile = compact.matches
        geometry = createLandscapeGeometry(mobile ? { rows: 56, columns: 260 } : undefined)
      }
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      requestFrame()
    }
    function visibility() {
      previousTimestamp = 0
      if (!active() && frame !== null) { cancelAnimationFrame(frame); frame = null }
      requestFrame()
    }
    const onMotion = () => { previousTimestamp = 0; requestFrame() }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      visibility()
    }, { rootMargin: '40px' })
    const resizeObserver = new ResizeObserver(resize)
    observer.observe(host)
    resizeObserver.observe(host)
    document.addEventListener('visibilitychange', visibility)
    motion.addEventListener('change', onMotion)
    resize()
    return () => {
      disposed = true
      if (frame !== null) cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', visibility)
      motion.removeEventListener('change', onMotion)
    }
  }, [])

  return <div className="sound-landscape" data-ready={ready}>
    <img src="/assets/sound-landscape.svg" width="1400" height="820" alt="" fetchPriority="high" decoding="async" />
    <canvas ref={canvasRef} aria-hidden="true" />
  </div>
}
