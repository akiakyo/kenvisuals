import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Float, Image, Lightformer, Line, RoundedBox, Sparkles, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { profile } from '../content'
import { logoUrls } from './Logos'

function LogoTile({ url, aspect, position, rotation, scale = 1 }: {
  url: string
  aspect: number
  position: [number, number, number]
  rotation: [number, number, number]
  scale?: number
}) {
  const texture = useTexture(url)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  const h = 0.92
  return (
    <Float speed={1.6} rotationIntensity={0.5} floatIntensity={0.9}>
      <group position={position} rotation={rotation} scale={scale}>
        <RoundedBox args={[1.5, 1.5, 0.16]} radius={0.22} smoothness={6}>
          <meshPhysicalMaterial color="#232323" roughness={0.25} metalness={0.15} clearcoat={1} clearcoatRoughness={0.12} />
        </RoundedBox>
        <mesh position={[0, 0, 0.085]}>
          <planeGeometry args={[h * aspect, h]} />
          <meshBasicMaterial map={texture} transparent toneMapped={false} />
        </mesh>
      </group>
    </Float>
  )
}

const W = 2.55
const H = 3.4

/** His photo as a selected layer: bounding box, transform handles and anchor point. */
function ProfileLayer() {
  const hx = W / 2 + 0.06
  const hy = H / 2 + 0.06
  const box: [number, number, number][] = [[-hx, -hy, 0], [hx, -hy, 0], [hx, hy, 0], [-hx, hy, 0], [-hx, -hy, 0]]
  const handles: [number, number][] = [[-hx, -hy], [0, -hy], [hx, -hy], [hx, 0], [hx, hy], [0, hy], [-hx, hy], [-hx, 0]]
  return (
    <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.4}>
      <group position={[0.15, 0, 0]}>
        <Image url={profile.hero} scale={[W, H]} radius={0.12} toneMapped={false} />
        <group position={[0, 0, 0.02]}>
          <Line points={box} color="#ffffff" lineWidth={1.4} />
          {handles.map(([x, y], i) => (
            <mesh key={i} position={[x, y, 0.01]}>
              <planeGeometry args={[0.11, 0.11]} />
              <meshBasicMaterial color={i % 2 ? '#ffffff' : '#3d9bff'} toneMapped={false} />
            </mesh>
          ))}
          {/* anchor point */}
          <Line points={[[-0.14, 0, 0.01], [0.14, 0, 0.01]]} color="#ffffff" lineWidth={1.2} />
          <Line points={[[0, -0.14, 0.01], [0, 0.14, 0.01]]} color="#ffffff" lineWidth={1.2} />
          <mesh position={[0, 0, 0.01]}>
            <ringGeometry args={[0.06, 0.085, 24]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
        </group>
      </group>
    </Float>
  )
}

function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null)
  // Shrink the composition on narrow canvases so nothing clips.
  const width = useThree((s) => s.viewport.width)
  const height = useThree((s) => s.viewport.height)
  const scale = Math.min(1, width / 6.6, height / 4.6)
  useFrame((state, dt) => {
    if (!group.current) return
    const { x, y } = state.pointer
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, x * 0.3, 3, dt)
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -y * 0.18, 3, dt)
  })
  return <group ref={group} scale={scale}>{children}</group>
}

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 40 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      eventSource={document.getElementById('root')!}
      eventPrefix="client"
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} color="#ffffff" />
      <pointLight position={[-4, -2, 2]} intensity={25} color="#c9a8ff" />
      <Suspense fallback={null}>
        <Rig>
          <ProfileLayer />
          <LogoTile url={logoUrls.ae} aspect={240 / 234} position={[-1.75, 1.2, 0.9]} rotation={[0.08, 0.38, -0.12]} scale={0.8} />
          <LogoTile url={logoUrls.figma} aspect={38 / 57} position={[1.95, -1.15, 1]} rotation={[-0.06, -0.42, 0.14]} scale={0.75} />
        </Rig>
        <Sparkles count={40} scale={[9, 6, 4]} size={2} speed={0.3} color="#ffffff" opacity={0.6} />
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 4, 3]} scale={[8, 2, 1]} />
          <Lightformer form="rect" intensity={2} color="#c9a8ff" position={[-5, 0, 2]} scale={[2, 6, 1]} />
        </Environment>
      </Suspense>
    </Canvas>
  )
}
