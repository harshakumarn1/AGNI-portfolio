import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import useMousePosition from '../hooks/useMousePosition'

function PhotoCard({ imageUrl, mouse }) {
  const meshRef = useRef()
  const [texture, setTexture] = useState(null)

  // Load photo texture
  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.crossOrigin = 'anonymous'
    loader.load(imageUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      setTexture(tex)
    })
  }, [imageUrl])

  // Smooth mouse-following tilt
  useFrame((state, delta) => {
    if (!meshRef.current) return

    const targetRotationY = mouse.normalized.x * 0.3
    const targetRotationX = -mouse.normalized.y * 0.2

    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetRotationY,
      delta * 3
    )
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      targetRotationX,
      delta * 3
    )
  })

  if (!texture) return null

  return (
    <Float
      speed={2}
      rotationIntensity={0.1}
      floatIntensity={0.4}
      floatingRange={[-0.1, 0.1]}
    >
      <group ref={meshRef}>
        {/* Photo frame / backing */}
        <RoundedBox args={[3.2, 3.2, 0.15]} radius={0.3} smoothness={4}>
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.5}
            roughness={0.4}
          />
        </RoundedBox>

        {/* Photo image mapped on front face */}
        <mesh position={[0, 0, 0.08]}>
          <circleGeometry args={[1.4, 64]} />
          <meshBasicMaterial map={texture} />
        </mesh>

        {/* Orange ring glow around photo */}
        <mesh position={[0, 0, 0.085]}>
          <ringGeometry args={[1.4, 1.5, 64]} />
          <meshBasicMaterial
            color="#f97316"
            transparent
            opacity={0.6}
          />
        </mesh>

        {/* Outer decorative ring */}
        <mesh position={[0, 0, 0.07]}>
          <ringGeometry args={[1.5, 1.52, 64]} />
          <meshBasicMaterial
            color="#f97316"
            transparent
            opacity={0.15}
          />
        </mesh>

        {/* Subtle point light for depth feel */}
        <pointLight position={[2, 2, 3]} intensity={0.5} color="#f97316" />
      </group>
    </Float>
  )
}

export default function ProfilePhoto3D() {
  const mouse = useMousePosition()

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <PhotoCard
        imageUrl="https://res.cloudinary.com/dm8u9jok6/image/upload/v1747034197/agni_picgft.jpg"
        mouse={mouse}
      />
    </Canvas>
  )
}
