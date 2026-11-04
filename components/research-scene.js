import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const accessibleName =
  'A miniature research workbench with a speech waveform, a sensing instrument, and a geometric agent. Drag or use the arrow keys to rotate.'

function WorkbenchFallback({ dark }) {
  return (
    <svg
      viewBox="0 0 640 360"
      width="100%"
      height="100%"
      role="img"
      aria-label="A miniature research workbench"
      style={{ display: 'block' }}
    >
      <ellipse cx="320" cy="299" rx="206" ry="27" fill={dark ? '#000' : '#b6c1d8'} opacity=".17" />
      <path d="m133 207 180-91 195 98-181 92Z" fill="#c7ceda" />
      <path d="m133 207 194 99v15l-194-99Zm194 99 181-92v15l-181 92Z" fill="#a7b3c8" />
      <path d="M166 225v61l15 8v-62Zm280 13v49l15-8v-49Z" fill="#8795af" />
      <path d="m214 134 92-45 1 82-93 46Z" fill="#3a4355" />
      <path d="m222 138 76-37v61l-76 38Z" fill="#263657" />
      <path d="m227 172 8-4 6-19 8 21 8-34 9 20 8-12 10 4 8-4" fill="none" stroke="#a2c4ff" strokeWidth="3" strokeLinejoin="round" />
      <path d="m250 198 27-13 24 12-28 14Z" fill="#e1e6ee" />
      <path d="m358 181 44-23 38 19-45 23Z" fill="#e1e6ee" />
      <path d="m358 181 37 19v24l-37-19Zm37 19 45-23v24l-45 23Z" fill="#c4ccdb" />
      <path d="M421 173v-47" stroke="#3a4355" strokeWidth="5" />
      <circle cx="421" cy="124" r="5" fill="#7196f0" />
      <path d="m337 240 25-13 24 12-25 13Z" fill="#527cda" />
      <path d="M361 235v-34" stroke="#c7ceda" strokeWidth="7" />
      <path d="m343 182 20-13 20 14-7 24-26-2Z" fill="#7196f0" />
      <path d="m184 207 31-15 26 13-31 15Z" fill="#527cda" />
      <path d="m184 207 26 13v9l-26-13Zm26 13 31-15v9l-31 15Z" fill="#e1e6ee" />
      <path d="m181 242 17-8 17 9-4 22-25-1Z" fill="#b2bccd" />
      <path d="M199 246v-30m0 16-15-13m15 6 15-15" fill="none" stroke="#557866" strokeWidth="7" strokeLinecap="round" />
    </svg>
  )
}

export default function ResearchScene({ theme = 'light' }) {
  const containerRef = useRef(null)
  const [fallback, setFallback] = useState(false)
  const dark = theme === 'dark'

  useEffect(() => {
    const container = containerRef.current
    if (!container || fallback) return

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
    } catch {
      setFallback(true)
      return
    }

    let disposed = false
    let frame = null
    let lastFrame = 0
    let inView = true
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reducedMotion = motionQuery.matches
    const scene = new THREE.Scene()
    const materials = new Map()
    const camera = new THREE.OrthographicCamera(-3.2, 3.2, 2, -2, 0.1, 40)
    camera.position.set(6.4, 5.15, 7.8)
    camera.lookAt(0, 0.88, 0)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.04
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    const canvas = renderer.domElement
    canvas.setAttribute('aria-label', accessibleName)
    canvas.setAttribute('role', 'img')
    canvas.tabIndex = 0
    Object.assign(canvas.style, { display: 'block', width: '100%', height: '100%', outlineOffset: '-5px' })
    container.appendChild(canvas)

    const controls = new OrbitControls(camera, canvas)
    controls.target.set(0, 0.88, 0)
    controls.enablePan = false
    controls.enableZoom = false
    controls.enableDamping = !reducedMotion
    controls.dampingFactor = 0.085
    controls.rotateSpeed = 0.6
    controls.minPolarAngle = 0.74
    controls.maxPolarAngle = 1.2
    controls.minAzimuthAngle = -0.24
    controls.maxAzimuthAngle = 1.28
    controls.update()
    // Vertical touch gestures continue scrolling the page; horizontal drags orbit.
    canvas.style.touchAction = 'pan-y'
    canvas.style.cursor = 'grab'

    const palette = {
      wood: '#c7ceda', edge: '#a7b3c8', leg: '#8795af', cream: '#e1e6ee',
      paper: '#f1f3f7', graphite: '#3a4355', teal: '#527cda', coral: '#7196f0',
      screen: '#263657', wave: '#a2c4ff', leaf: '#6d8b85', clay: '#b2bccd',
      floor: dark ? '#292f3a' : '#e4e9f2'
    }
    function material(color, extra = {}) {
      const key = `${color}:${JSON.stringify(extra)}`
      if (!materials.has(key)) {
        materials.set(key, new THREE.MeshStandardMaterial({ color, roughness: 0.78, metalness: 0, flatShading: true, ...extra }))
      }
      return materials.get(key)
    }
    function mesh(geometry, color, parent = scene, extra = {}) {
      const object = new THREE.Mesh(geometry, material(color, extra))
      object.castShadow = true
      object.receiveShadow = true
      parent.add(object)
      return object
    }
    function box(width, height, depth, color, x, y, z, parent = scene) {
      const object = mesh(new THREE.BoxGeometry(width, height, depth), color, parent)
      object.position.set(x, y, z)
      return object
    }
    function roundedShape(width, height, radius) {
      const s = new THREE.Shape()
      const x = -width / 2, y = -height / 2
      s.moveTo(x + radius, y)
      s.lineTo(x + width - radius, y)
      s.quadraticCurveTo(x + width, y, x + width, y + radius)
      s.lineTo(x + width, y + height - radius)
      s.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
      s.lineTo(x + radius, y + height)
      s.quadraticCurveTo(x, y + height, x, y + height - radius)
      s.lineTo(x, y + radius)
      s.quadraticCurveTo(x, y, x + radius, y)
      return s
    }
    function roundedPanel(width, height, depth, color, parent = scene, radius = 0.06) {
      const geometry = new THREE.ExtrudeGeometry(roundedShape(width, height, radius), {
        depth, bevelEnabled: true, bevelSegments: 1, steps: 1,
        bevelSize: 0.014, bevelThickness: 0.014, curveSegments: 4
      })
      geometry.translate(0, 0, -depth / 2)
      return mesh(geometry, color, parent)
    }
    function slab(width, depth, height, color, x, y, z, parent = scene, radius = 0.07) {
      const object = roundedPanel(width, depth, height, color, parent, radius)
      object.rotation.x = -Math.PI / 2
      object.position.set(x, y, z)
      return object
    }
    function cylinder(radiusTop, radiusBottom, height, color, x, y, z, parent = scene, segments = 12) {
      const object = mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments), color, parent)
      object.position.set(x, y, z)
      return object
    }
    function lineBetween(a, b, radius, color, parent = scene) {
      const direction = new THREE.Vector3().subVectors(b, a)
      const object = cylinder(radius, radius, direction.length(), color, 0, 0, 0, parent, 6)
      object.position.copy(a).add(b).multiplyScalar(0.5)
      object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize())
      return object
    }

    const hemi = new THREE.HemisphereLight('#fff4dc', dark ? '#43534b' : '#b9c6b8', 2.15)
    scene.add(hemi)
    const keyLight = new THREE.DirectionalLight('#fff1da', 3.1)
    keyLight.position.set(-3.5, 7, 5)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.set(1024, 1024)
    keyLight.shadow.camera.left = -4
    keyLight.shadow.camera.right = 4
    keyLight.shadow.camera.top = 4
    keyLight.shadow.camera.bottom = -4
    keyLight.shadow.camera.near = 0.5
    keyLight.shadow.camera.far = 18
    keyLight.shadow.normalBias = 0.025
    keyLight.shadow.bias = -0.0002
    keyLight.shadow.radius = 3
    scene.add(keyLight)
    const fill = new THREE.DirectionalLight('#c1d8d5', 0.7)
    fill.position.set(5, 3, -4)
    scene.add(fill)

    // A shallow, rounded plinth gives the miniature a quiet physical boundary.
    slab(5.05, 3.62, 0.13, palette.floor, 0, -0.53, 0, scene, 0.4)
    const contactShadow = new THREE.Mesh(
      new THREE.CircleGeometry(1, 48),
      new THREE.MeshBasicMaterial({ color: '#40382c', transparent: true, opacity: dark ? 0.1 : 0.045, depthWrite: false })
    )
    contactShadow.rotation.x = -Math.PI / 2
    contactShadow.scale.set(2.2, 1.45, 1)
    contactShadow.position.set(0.04, -0.448, 0.04)
    scene.add(contactShadow)

    const top = 0.94
    slab(4.08, 2.34, 0.19, palette.wood, 0, 0.84, 0, scene, 0.13)
    slab(4.0, 2.26, 0.06, palette.edge, 0, 0.73, 0, scene, 0.11)
    for (const x of [-1.64, 1.64]) {
      for (const z of [-0.81, 0.81]) {
        box(0.18, 1.16, 0.18, palette.leg, x, 0.13, z)
        box(0.22, 0.055, 0.22, palette.graphite, x, -0.423, z)
      }
      box(0.1, 0.1, 1.68, palette.leg, x, -0.13, 0)
    }
    box(3.25, 0.12, 0.09, palette.leg, 0, 0.48, -0.81)
    // A few long, nearly invisible grain marks keep the wood from feeling plastic.
    for (let i = 0; i < 5; i += 1) {
      box(3.65 - (i % 2) * 0.28, 0.002, 0.007, '#c49b6d', -0.05, top + 0.012, -0.78 + i * 0.37)
    }

    const display = new THREE.Group()
    display.position.set(-0.53, 1.7, -0.52)
    display.rotation.set(-0.06, 0.035, 0)
    scene.add(display)
    roundedPanel(1.67, 1.04, 0.13, palette.graphite, display, 0.075)
    const screen = roundedPanel(1.43, 0.79, 0.014, palette.screen, display, 0.035)
    screen.position.set(0, 0.015, 0.078)
    const wavePoints = []
    for (let i = 0; i <= 48; i += 1) {
      const u = i / 48
      const envelope = 0.055 + 0.18 * Math.exp(-Math.pow((u - 0.51) / 0.24, 2))
      const value = Math.sin(u * Math.PI * 13) * envelope * (0.68 + 0.32 * Math.sin(u * 17))
      wavePoints.push(new THREE.Vector3(-0.62 + u * 1.24, 0.06 + value, 0.102))
    }
    const wave = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(wavePoints), 110, 0.013, 5, false), palette.wave, display)
    wave.castShadow = false
    wave.receiveShadow = false
    for (let i = 0; i < 3; i += 1) {
      const dot = mesh(new THREE.SphereGeometry(0.021, 8, 6), i === 0 ? palette.coral : '#668d7a', display)
      dot.position.set(-0.59 + i * 0.075, 0.31, 0.105)
      dot.castShadow = false
    }
    for (let i = 0; i < 6; i += 1) {
      box(0.05, 0.025 + (i % 3) * 0.012, 0.009, '#719a88', 0.26 + i * 0.065, -0.27, 0.101, display)
    }
    box(0.13, 0.28, 0.14, palette.cream, -0.53, 1.065, -0.55)
    slab(0.63, 0.38, 0.04, palette.cream, -0.53, top + 0.045, -0.49, scene, 0.07)

    const keyboard = new THREE.Group()
    keyboard.position.set(-0.58, top + 0.045, 0.4)
    keyboard.rotation.y = -0.035
    scene.add(keyboard)
    slab(1.03, 0.37, 0.045, palette.cream, 0, 0, 0, keyboard, 0.04)
    const keys = new THREE.InstancedMesh(new THREE.BoxGeometry(0.088, 0.025, 0.064), material('#a8b1a1'), 30)
    const transform = new THREE.Object3D()
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 10; col += 1) {
        transform.position.set(-0.443 + col * 0.098, 0.039, -0.104 + row * 0.095)
        transform.updateMatrix()
        keys.setMatrixAt(row * 10 + col, transform.matrix)
      }
    }
    keys.castShadow = true
    keys.receiveShadow = true
    keyboard.add(keys)
    slab(0.14, 0.23, 0.07, palette.cream, 0.17, top + 0.055, 0.41, scene, 0.06)

    // A small receiver: two copper-tipped probes and an analogue lens.
    const sensor = new THREE.Group()
    sensor.position.set(1.27, top + 0.13, -0.62)
    scene.add(sensor)
    roundedPanel(0.67, 0.23, 0.57, palette.cream, sensor, 0.055)
    box(0.49, 0.08, 0.02, palette.teal, -0.015, 0.005, 0.299, sensor)
    for (const [x, height] of [[-0.22, 0.48], [0.22, 0.68]]) {
      cylinder(0.018, 0.024, height, palette.graphite, x, height / 2 + 0.115, -0.105, sensor, 8)
      const cap = mesh(new THREE.SphereGeometry(0.041, 8, 6), palette.coral, sensor)
      cap.position.set(x, height + 0.115, -0.105)
      cylinder(0.065, 0.065, 0.045, palette.teal, x, 0.137, -0.105, sensor)
    }
    const dial = cylinder(0.066, 0.066, 0.038, palette.graphite, 0.214, 0.007, 0.325, sensor, 12)
    dial.rotation.x = Math.PI / 2
    box(0.009, 0.043, 0.008, palette.paper, 0.214, 0.021, 0.347, sensor)
    box(0.17, 0.035, 0.018, '#9bbb9f', -0.145, 0.005, 0.314, sensor)

    // The agent is deliberately an abstract, original desk sculpture.
    const sculpture = new THREE.Group()
    sculpture.position.set(1.02, top, 0.52)
    sculpture.rotation.y = -0.2
    scene.add(sculpture)
    slab(0.61, 0.56, 0.065, palette.teal, 0, 0.04, 0, sculpture, 0.065)
    cylinder(0.036, 0.044, 0.31, palette.cream, 0, 0.23, 0, sculpture, 8)
    const agent = new THREE.Group()
    agent.position.y = 0.59
    sculpture.add(agent)
    const core = mesh(new THREE.IcosahedronGeometry(0.255, 0), palette.coral, agent)
    core.rotation.set(0.2, 0.25, -0.15)
    const orbit = mesh(new THREE.TorusGeometry(0.34, 0.012, 5, 32), palette.cream, agent)
    orbit.rotation.set(1.05, 0.3, -0.35)
    const satellite = mesh(new THREE.OctahedronGeometry(0.07, 0), palette.teal, agent)
    satellite.position.set(0.292, 0.10, 0.115)

    function book(width, depth, height, color, x, y, z, angle) {
      const group = new THREE.Group()
      group.position.set(x, y, z)
      group.rotation.y = angle
      scene.add(group)
      box(width - 0.025, height - 0.025, depth - 0.025, palette.paper, 0, 0, 0, group)
      slab(width, depth, 0.018, color, 0, height / 2, 0, group, 0.025)
      slab(width, depth, 0.018, color, 0, -height / 2, 0, group, 0.025)
      box(0.025, height, depth, color, -width / 2 + 0.01, 0, 0, group)
    }
    book(0.57, 0.48, 0.11, palette.teal, -1.54, top + 0.07, -0.61, 0.05)
    book(0.54, 0.43, 0.09, palette.coral, -1.51, top + 0.185, -0.61, -0.08)
    book(0.49, 0.4, 0.065, palette.cream, -1.53, top + 0.28, -0.61, 0.035)
    book(0.41, 0.46, 0.035, palette.cream, 0.33, top + 0.03, 0.45, -0.18)
    const pencil = cylinder(0.013, 0.013, 0.42, palette.coral, 0.27, top + 0.07, 0.77, scene, 6)
    pencil.rotation.z = Math.PI / 2
    pencil.rotation.y = -0.18

    const plant = new THREE.Group()
    plant.position.set(-1.51, top, 0.62)
    scene.add(plant)
    cylinder(0.18, 0.13, 0.25, palette.clay, 0, 0.14, 0, plant, 8)
    cylinder(0.159, 0.159, 0.018, '#74694e', 0, 0.27, 0, plant, 8)
    lineBetween(new THREE.Vector3(0, 0.27, 0), new THREE.Vector3(0.015, 0.67, -0.015), 0.012, palette.leaf, plant)
    const leaves = [
      [-0.12, 0.43, 0.015, -0.8, 0.15], [0.125, 0.49, -0.015, 0.75, -0.2],
      [-0.085, 0.59, -0.035, -0.65, 0.3], [0.075, 0.65, -0.02, 0.65, -0.2],
      [0.005, 0.72, -0.025, 0.03, 0.15]
    ]
    leaves.forEach(([x, y, z, tilt, turn], index) => {
      const leaf = mesh(new THREE.SphereGeometry(1, 5, 3), index % 2 ? '#789279' : palette.leaf, plant)
      leaf.scale.set(0.068, index === 4 ? 0.13 : 0.15, 0.045)
      leaf.rotation.set(turn, 0, -tilt)
      leaf.position.set(x, y, z)
    })

    const canRender = () => !disposed && inView && !document.hidden
    function requestFrame() {
      if (frame === null && canRender()) frame = window.requestAnimationFrame(render)
    }
    function render(timestamp) {
      frame = null
      if (!canRender()) return
      // Keep the slow idle animation at 30 fps rather than a monitor's refresh rate.
      if (!reducedMotion && timestamp - lastFrame < 1000 / 30) {
        requestFrame()
        return
      }
      lastFrame = timestamp
      if (!reducedMotion) {
        const t = timestamp * 0.001
        agent.position.y = 0.59 + Math.sin(t * 1.1) * 0.018
        core.rotation.y = 0.25 + Math.sin(t * 0.55) * 0.15
        orbit.rotation.z = -0.35 + Math.sin(t * 0.7) * 0.06
      }
      controls.update()
      renderer.render(scene, camera)
      if (!reducedMotion) requestFrame()
    }
    function resize() {
      if (disposed) return
      const width = container.clientWidth
      const height = container.clientHeight
      if (!width || !height) return
      const aspect = width / height
      const viewHeight = Math.max(3.75, 6.1 / aspect)
      camera.left = (-viewHeight * aspect) / 2
      camera.right = (viewHeight * aspect) / 2
      camera.top = viewHeight / 2
      camera.bottom = -viewHeight / 2
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
      requestFrame()
    }
    function onMotionChange() {
      reducedMotion = motionQuery.matches
      controls.enableDamping = !reducedMotion
      agent.position.y = 0.59
      core.rotation.y = 0.25
      orbit.rotation.z = -0.35
      requestFrame()
    }
    function onVisibilityChange() {
      if (!canRender() && frame !== null) {
        window.cancelAnimationFrame(frame)
        frame = null
      } else requestFrame()
    }
    function onKeyDown(event) {
      const offsets = { ArrowLeft: [-0.09, 0], ArrowRight: [0.09, 0], ArrowUp: [0, -0.06], ArrowDown: [0, 0.06] }
      if (!offsets[event.key]) return
      event.preventDefault()
      const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target))
      spherical.theta = THREE.MathUtils.clamp(spherical.theta + offsets[event.key][0], controls.minAzimuthAngle, controls.maxAzimuthAngle)
      spherical.phi = THREE.MathUtils.clamp(spherical.phi + offsets[event.key][1], controls.minPolarAngle, controls.maxPolarAngle)
      camera.position.copy(new THREE.Vector3().setFromSpherical(spherical).add(controls.target))
      controls.update()
      requestFrame()
    }
    function onContextLost(event) {
      event.preventDefault()
      setFallback(true)
    }
    const onPointerDown = () => { canvas.style.cursor = 'grabbing' }
    const onPointerUp = () => { canvas.style.cursor = 'grab' }
    controls.addEventListener('change', requestFrame)
    canvas.addEventListener('keydown', onKeyDown)
    canvas.addEventListener('webglcontextlost', onContextLost)
    canvas.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    document.addEventListener('visibilitychange', onVisibilityChange)
    motionQuery.addEventListener?.('change', onMotionChange)
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
    resizeObserver?.observe(container)
    if (!resizeObserver) window.addEventListener('resize', resize)
    const intersectionObserver = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting
        onVisibilityChange()
      }, { rootMargin: '60px' })
      : null
    intersectionObserver?.observe(container)
    resize()

    return () => {
      disposed = true
      if (frame !== null) window.cancelAnimationFrame(frame)
      resizeObserver?.disconnect()
      intersectionObserver?.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointerup', onPointerUp)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      motionQuery.removeEventListener?.('change', onMotionChange)
      canvas.removeEventListener('keydown', onKeyDown)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      canvas.removeEventListener('pointerdown', onPointerDown)
      controls.removeEventListener('change', requestFrame)
      controls.dispose()
      const geometries = new Set()
      const allMaterials = new Set()
      scene.traverse(object => {
        if (object.geometry) geometries.add(object.geometry)
        if (object.material) {
          const objectMaterials = Array.isArray(object.material) ? object.material : [object.material]
          objectMaterials.forEach(item => allMaterials.add(item))
        }
        // InstancedMesh owns GPU buffers beyond its shared geometry and material.
        if (object.isInstancedMesh) object.dispose()
      })
      geometries.forEach(geometry => geometry.dispose())
      allMaterials.forEach(item => {
        Object.values(item).forEach(value => { if (value?.isTexture) value.dispose() })
        item.dispose()
      })
      keyLight.shadow.dispose()
      renderer.renderLists.dispose()
      renderer.dispose()
      if (canvas.parentNode === container) container.removeChild(canvas)
      scene.clear()
    }
  }, [dark, fallback])

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 260, position: 'relative' }}>
      {fallback
        ? <WorkbenchFallback dark={dark} />
        : <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: 260 }} />}
    </div>
  )
}
