/* oxlint-disable react/immutability -- Three.js resources and camera are intentionally mutated inside the GSAP render controller, never React state. */
import { Component, Suspense, useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { BufferGeometry, Float32BufferAttribute, DoubleSide, SRGBColorSpace, TextureLoader, MathUtils, Vector3 } from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { makeFilmTexture, makeWords } from './sceneAssets'
import './Demo9.css'

gsap.registerPlugin(ScrollTrigger)
const PORTAL_Z = -31
const FILM_SEGMENTS = 280
const mix = MathUtils.lerp

function makeRibbon() {
  const geometry = new BufferGeometry()
  const positions = new Float32Array((FILM_SEGMENTS + 1) * 6)
  const uv = [], indices = []
  for (let i = 0; i <= FILM_SEGMENTS; i++) {
    uv.push(i / FILM_SEGMENTS, 0, i / FILM_SEGMENTS, 1)
    if (i < FILM_SEGMENTS) {
      const a = i * 2
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
    }
  }
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new Float32BufferAttribute(uv, 2))
  geometry.setIndex(indices)
  return geometry
}

// The same film vertices morph from a human-scale helix to an expanded world,
// then into a rectangular spiral terminating at the studio portal.
function shapeRibbon(geometry, spread, converge) {
  const attr = geometry.attributes.position
  for (let i = 0; i <= FILM_SEGMENTS; i++) {
    const u = i / FILM_SEGMENTS
    const angle = mix(-Math.PI * 1.17, Math.PI * 1.17, u)
    const x = Math.sin(angle) * mix(6.5, 11.8, spread)
    const y = .3 + angle * .74 + Math.sin(angle * 2) * .3 - 5.2 * spread * Math.cos(angle)
    const z = Math.cos(angle) * mix(3.6, 11.5, spread) - mix(1.5, 7.6, spread)
    const turn = u * Math.PI * 3.8 + .45
    const radius = mix(14, 5.7, u)
    const rectX = Math.sign(Math.cos(turn)) * Math.pow(Math.abs(Math.cos(turn)), .35) * radius
    const rectY = Math.sign(Math.sin(turn)) * Math.pow(Math.abs(Math.sin(turn)), .35) * radius * .62
    const px = mix(x, rectX, converge)
    const py = mix(y, rectY, converge)
    const pz = mix(z, mix(5, PORTAL_Z + 2, u), converge)
    const height = mix(1.45, .85, converge)
    const lean = Math.sin(angle) * .18 * (1 - converge)
    attr.setXYZ(i * 2, px - lean, py - height / 2, pz)
    attr.setXYZ(i * 2 + 1, px + lean, py + height / 2, pz)
  }
  attr.needsUpdate = true
  geometry.computeBoundingSphere()
}

function SpatialWords({ asset, width, ...props }) {
  return <group {...props}>
    {/* A short extruded edge makes the lettering read as a physical scene object. */}
    {[.09, .045, 0].map((depth, i) => <mesh key={depth} position={[depth * .32, -depth * .3, -depth]}>
      <planeGeometry args={[width, width / asset.aspect]} />
      <meshBasicMaterial map={asset.texture} color={i === 2 ? '#ffffff' : '#554531'} transparent alphaTest={.05} depthWrite side={DoubleSide} toneMapped={false} fog={false} />
    </mesh>)}
  </group>
}

function Portal({ portalRef }) {
  const texture = useLoader(TextureLoader, '/demo9/exterior-studio.png')
  useLayoutEffect(() => { texture.colorSpace = SRGBColorSpace; texture.needsUpdate = true }, [texture])
  return <group ref={portalRef} position={[0, 0, PORTAL_Z]}>
    <mesh name="studio-image" position={[0, 0, -.06]}>
      <planeGeometry args={[10, 10 * 941 / 1672]} />
      <meshBasicMaterial map={texture} toneMapped={false} fog={false} />
    </mesh>
    {/* Solid jambs extend toward the camera: this is a deep opening, not a flat overlay. */}
    {[-1, 1].map(side => <group key={side}>
      <mesh position={[side * 5.18, 0, 1.15]}><boxGeometry args={[.32, 6.08, 2.4]} /><meshStandardMaterial color="#292722" metalness={.5} roughness={.46} /></mesh>
      <mesh position={[0, side * 2.97, 1.15]}><boxGeometry args={[10.7, .28, 2.4]} /><meshStandardMaterial color="#292722" metalness={.5} roughness={.46} /></mesh>
      <mesh position={[side * 5.01, 0, 2.36]}><boxGeometry args={[.025, 5.67, .025]} /><meshBasicMaterial color="#bfa071" /></mesh>
      <mesh position={[0, side * 2.82, 2.36]}><boxGeometry args={[10.02, .025, .025]} /><meshBasicMaterial color="#bfa071" /></mesh>
    </group>)}
  </group>
}

function World({ scrollRoot, statusRef, cueRef }) {
  const { camera, invalidate, gl } = useThree()
  const portrait = useLoader(TextureLoader, '/demo9/founder-cutout.png')
  useLayoutEffect(() => { portrait.colorSpace = SRGBColorSpace; portrait.needsUpdate = true }, [portrait])
  const subject = useRef(), firstWords = useRef(), secondWords = useRef(), portal = useRef()
  const assets = useMemo(() => ({
    film: makeFilmTexture(), ribbon: makeRibbon(),
    first: makeWords(['YOU BUILT', 'THE WORK.'], '01 / HUMAN — PRESENCE'),
    second: makeWords(['NOW BUILD', 'THE WORLD', 'AROUND IT.'], '02 / THE CONTENT WORLD'),
  }), [])

  useLayoutEffect(() => {
    const state = { progress: 0, cameraZ: 12.8, cameraX: .35, cameraY: .3, lookX: 0, lookY: 0, lookZ: -3, spread: 0, converge: 0, subjectX: .9, subjectZ: 0, subjectTurn: 0, wordTurn: Math.PI / 2, wordX: 1.1, firstX: -3.6, portalTurn: Math.PI / 2 }
    const gaze = new Vector3()
    const canvas = gl.domElement
    const update = () => {
      camera.position.set(state.cameraX, state.cameraY, state.cameraZ)
      camera.lookAt(gaze.set(state.lookX, state.lookY, state.lookZ))
      shapeRibbon(assets.ribbon, state.spread, state.converge)
      subject.current.position.set(state.subjectX, -.48, state.subjectZ)
      subject.current.rotation.y = state.subjectTurn
      firstWords.current.position.set(state.firstX, 2.05, -3)
      firstWords.current.rotation.y = .16
      secondWords.current.position.set(state.wordX, .6, -10)
      secondWords.current.rotation.y = state.wordTurn
      portal.current.rotation.y = state.portalTurn
      secondWords.current.visible = state.progress > .16 && state.progress < .79
      firstWords.current.visible = state.progress < .47
      // DOM diagnostics make camera depth and sequence completion testable without
      // exposing internal Three.js objects or running a second animation loop.
      canvas.dataset.progress = state.progress.toFixed(4)
      canvas.dataset.cameraZ = state.cameraZ.toFixed(3)
      canvas.dataset.spread = state.spread.toFixed(3)
      canvas.dataset.converge = state.converge.toFixed(3)
      canvas.dataset.scene = state.progress < .29 ? 'presence' : state.progress < .66 ? 'content-world' : 'portal'
      statusRef.current.textContent = state.progress < .29 ? '01 — PRESENCE' : state.progress < .66 ? '02 — CONTENT WORLD' : '03 — ARRIVAL'
      cueRef.current.style.opacity = String(1 - MathUtils.smoothstep(state.progress, .03, .16))
      scrollRoot.current.style.setProperty('--d9-progress', state.progress)
      invalidate()
    }
    // One GSAP timeline is the single clock for camera, film, subject and type.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timeline = gsap.timeline({ onUpdate: update, scrollTrigger: {
      trigger: scrollRoot.current, start: 'top top', end: 'bottom bottom',
      scrub: reduced ? true : .85, invalidateOnRefresh: true,
    } })
    timeline.to(state, { progress: 1, duration: 1, ease: 'none' }, 0)
      .to(state, { cameraZ: 5.8, cameraX: 1, cameraY: .65, lookX: .1, lookZ: -11, spread: 1, subjectX: -8.5, subjectZ: -3.4, subjectTurn: .23, firstX: -15, duration: .45, ease: 'power1.inOut' }, .08)
      .to(state, { wordTurn: -.06, duration: .19, ease: 'power2.out' }, .19)
      .to(state, { cameraZ: .8, cameraX: .25, cameraY: .2, lookZ: PORTAL_Z, duration: .17, ease: 'sine.inOut' }, .53)
      .to(state, { portalTurn: 0, duration: .16, ease: 'power1.inOut' }, .54)
      .to(state, { converge: 1, wordX: -17, wordTurn: -.5, duration: .23, ease: 'power1.inOut' }, .56)
      .to(state, { cameraZ: -23.55, cameraX: 0, cameraY: 0, lookX: 0, lookY: 0, lookZ: PORTAL_Z, duration: .30, ease: 'power1.inOut' }, .70)
    canvas.dataset.ready = 'true'
    update()
    return () => {
      timeline.scrollTrigger?.kill()
      timeline.kill()
      delete canvas.dataset.ready
    }
  }, [assets, camera, cueRef, gl, invalidate, scrollRoot, statusRef])

  useLayoutEffect(() => () => {
    assets.film.dispose(); assets.ribbon.dispose()
    assets.first.texture.dispose(); assets.second.texture.dispose()
  }, [assets])

  return <>
    <color attach="background" args={['#111311']} />
    <fog attach="fog" args={['#111311', 10, 48]} />
    <ambientLight intensity={1.3} />
    <pointLight position={[0, 5, -22]} color="#d3b37b" intensity={90} distance={35} />
    <pointLight position={[-7, 4, 4]} color="#b49d76" intensity={40} distance={25} />
    <mesh geometry={assets.ribbon} name="continuous-film-strip" frustumCulled={false}>
      <meshBasicMaterial map={assets.film} side={DoubleSide} alphaTest={.3} toneMapped={false} fog={false} />
    </mesh>
    <group ref={subject}>
      <mesh name="founder-portrait">
        <planeGeometry args={[7.28, 9.1]} />
        {/* Alpha testing writes opaque subject pixels to depth, preserving real occlusion. */}
        <meshBasicMaterial map={portrait} alphaTest={.13} side={DoubleSide} toneMapped={false} fog={false} />
      </mesh>
    </group>
    <SpatialWords ref={firstWords} asset={assets.first} width={7.4} />
    <SpatialWords ref={secondWords} asset={assets.second} width={12.2} />
    <Portal portalRef={portal} />
    {/* Restrained physical floor and converging rails give the camera travel a scale. */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5.2, -12]}>
      <planeGeometry args={[100, 110]} /><meshStandardMaterial color="#171916" roughness={.72} metalness={.25} />
    </mesh>
    {[-1, 1].map(side => <mesh key={side} position={[side * 5.6, -5.19, -14]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[.018, 65]} /><meshBasicMaterial color="#514936" />
    </mesh>)}
  </>
}

class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed ? <div className="demo9-scene-message" role="alert">The 3D scene couldn’t load. Please reload with WebGL enabled.</div> : this.props.children
  }
}

export default function Demo9() {
  const root = useRef(null), status = useRef(null), cue = useRef(null)
  useLayoutEffect(() => {
    const title = document.title
    document.title = 'Demo 09 — Into the brand world'
    return () => { document.title = title }
  }, [])
  return <main className="demo9-spatial" ref={root} aria-label="A continuous cinematic journey from the founder’s visual world into Tomorrow Studio">
    <div className="demo9-stage">
      <SceneBoundary>
        <Canvas camera={{ position: [.35, .3, 12.8], fov: 43, near: .08, far: 130 }} dpr={[1, 1.75]} frameloop="demand" gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }} fallback={<div className="demo9-scene-message">This spatial experience requires WebGL.</div>}>
          <Suspense fallback={null}><World scrollRoot={root} statusRef={status} cueRef={cue} /></Suspense>
        </Canvas>
      </SceneBoundary>
      <div className="demo9-scene-index" ref={status}>LOADING THE WORLD</div>
      <p className="demo9-scroll-cue" ref={cue}>SCROLL TO MOVE THROUGH <span aria-hidden="true">↓</span></p>
      <div className="demo9-progress" aria-hidden="true" />
      <p className="demo9-accessible">You built the work. Now build the world around it. Scroll to travel through a three-dimensional film strip and approach the exterior of Tomorrow Studio.</p>
    </div>
  </main>
}
