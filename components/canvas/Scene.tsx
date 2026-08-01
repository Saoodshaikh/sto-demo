'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { scroll } from '@/lib/scroll-store';
import ParticleField from './ParticleField';
import HolographicEarth from './HolographicEarth';
import FloatingCards from './FloatingCards';

/**
 * Flies the camera from deep darkness inward on first scroll, then keeps a
 * gentle cursor-reactive sway and a slow orbital drift as the story evolves.
 */
function CameraRig() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const p = scroll.progress;

    // Dolly: start far away in the void, glide in through the particles,
    // then pull back out slightly as the globe/ecosystem forms.
    const z = THREE.MathUtils.lerp(34, 19, Math.min(p * 2.2, 1)) + p * 6;
    const y = Math.sin(p * Math.PI) * 2.2;

    // Cursor sway.
    const swayX = scroll.pointerX * 2.4;
    const swayY = -scroll.pointerY * 1.6 + y;

    camera.position.x += (swayX - camera.position.x) * Math.min(delta * 2.5, 1);
    camera.position.y += (swayY - camera.position.y) * Math.min(delta * 2.5, 1);
    camera.position.z += (z - camera.position.z) * Math.min(delta * 2.0, 1);

    target.current.set(0, 0, 0);
    camera.lookAt(target.current);
  });

  return null;
}

export default function Scene() {
  const [dpr, setDpr] = useState<[number, number]>([1, 1.6]);
  const [count, setCount] = useState(16000);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 820px)').matches;
    const lowMem = (navigator as any).deviceMemory && (navigator as any).deviceMemory <= 4;
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (mobile || lowMem) {
      setCount(7000); // adapted lightweight 3D for mobile / low-end
      setDpr([1, 1.3]);
    }
  }, []);

  return (
    <Canvas
      dpr={dpr}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      camera={{ position: [0, 0, 40], fov: 55, near: 0.1, far: 200 }}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#04060d']} />
      <fog attach="fog" args={['#04060d', 26, 70]} />

      <Suspense fallback={null}>
        <ParticleField count={count} />
        <FloatingCards />
        <HolographicEarth />
        <CameraRig />

        {!reduced && (
          <EffectComposer multisampling={0} enableNormalPass={false}>
            <Bloom
              intensity={1.15}
              luminanceThreshold={0.05}
              luminanceSmoothing={0.9}
              mipmapBlur
              radius={0.7}
            />
            <Vignette eskil={false} offset={0.2} darkness={0.9} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}
