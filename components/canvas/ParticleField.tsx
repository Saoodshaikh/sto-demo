'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scroll } from '@/lib/scroll-store';
import {
  galaxy,
  dust,
  human,
  network,
  globe,
  attributes,
} from '@/lib/formations';
import { vertexShader, fragmentShader } from './particles.glsl';
import { computeWeights } from '@/lib/phases';

export default function ParticleField({ count = 16000 }: { count?: number }) {
  const points = useRef<THREE.Points>(null!);
  const mat = useRef<THREE.ShaderMaterial>(null!);
  const weightsScratch = useRef<number[]>([0, 0, 0, 0, 0]);

  // Build geometry + attributes once. Heavy work, memoized.
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const { scales, seeds } = attributes(count);

    // `position` is required by three but unused by our shader; reuse galaxy.
    const g = galaxy(count);
    geo.setAttribute('position', new THREE.BufferAttribute(g.slice(), 3));
    geo.setAttribute('aPosGalaxy', new THREE.BufferAttribute(g, 3));
    geo.setAttribute('aPosDust', new THREE.BufferAttribute(dust(count), 3));
    geo.setAttribute('aPosHuman', new THREE.BufferAttribute(human(count), 3));
    geo.setAttribute('aPosNet', new THREE.BufferAttribute(network(count), 3));
    geo.setAttribute('aPosGlobe', new THREE.BufferAttribute(globe(count), 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    return geo;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 26 },
      uScatter: { value: 0.1 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uWeights: { value: [1, 0, 0, 0, 0] },
    }),
    []
  );

  useFrame((state, delta) => {
    const u = uniforms;
    u.uTime.value = state.clock.elapsedTime;

    // Blend weights from scroll.
    computeWeights(scroll.progress, weightsScratch.current);
    for (let i = 0; i < 5; i++) u.uWeights.value[i] = weightsScratch.current[i];

    // Scatter peaks during the "dust" phase, plus velocity turbulence.
    const vel = Math.min(Math.abs(scroll.velocity) * 0.02, 0.4);
    u.uScatter.value = weightsScratch.current[1] * 0.5 + 0.04 + vel;

    // Smooth pointer follow for parallax.
    u.uPointer.value.x += (scroll.pointerX * 0.6 - u.uPointer.value.x) * 0.05;
    u.uPointer.value.y += (-scroll.pointerY * 0.4 - u.uPointer.value.y) * 0.05;

    // Continuous slow rotation of the whole ecosystem.
    if (points.current) {
      points.current.rotation.y += delta * 0.045;
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
