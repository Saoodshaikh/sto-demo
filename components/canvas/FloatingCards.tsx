'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { scroll } from '@/lib/scroll-store';
import { networkWeight } from '@/lib/phases';
import { TALENT, createCardTexture } from '@/lib/talent-cards';

// Resting layout — cards frame the hero without covering the centred headline.
const LAYOUT = [
  { pos: [-7.2, 1.8, 1.5], scale: 1.0, phase: 0.0 },
  { pos: [7.0, 3.2, -0.5], scale: 0.92, phase: 1.1 },
  { pos: [-6.2, -3.4, 2.2], scale: 0.86, phase: 2.2 },
  { pos: [7.6, -2.6, 0.4], scale: 0.98, phase: 3.0 },
  { pos: [0.4, 5.0, -2.5], scale: 0.8, phase: 4.3 },
];

/**
 * Floating holographic talent cards — the product made literal: verified
 * profiles (name, craft, AI match %) drifting in space, billboarded to camera,
 * reacting to the cursor. They lead the hero, then dissolve as the particles
 * form the talent × recruiter network so they never fight the globe.
 */
export default function FloatingCards() {
  const { camera } = useThree();
  const group = useRef<THREE.Group>(null!);
  const intro = useRef(0);

  const cards = useMemo(
    () =>
      TALENT.map((t, i) => ({
        texture: createCardTexture(t),
        ...LAYOUT[i % LAYOUT.length],
      })),
    []
  );

  const refs = useRef<THREE.Mesh[]>([]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Ease the whole cluster in after the loader, then fade as the network forms.
    intro.current += (1 - intro.current) * Math.min(delta * 1.2, 1);
    const net = networkWeight(scroll.progress);
    const reveal = intro.current * (1 - THREE.MathUtils.smoothstep(net, 0.15, 0.75));

    // Subtle cursor parallax on the cluster.
    if (group.current) {
      group.current.position.x += (scroll.pointerX * 1.2 - group.current.position.x) * 0.04;
      group.current.position.y += (-scroll.pointerY * 0.8 - group.current.position.y) * 0.04;
    }

    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const c = cards[i];
      // Gentle float + billboard toward the camera.
      const fy = Math.sin(t * 0.6 + c.phase) * 0.35;
      const fx = Math.cos(t * 0.4 + c.phase) * 0.2;
      mesh.position.set(c.pos[0] + fx, c.pos[1] + fy, c.pos[2]);
      mesh.quaternion.copy(camera.quaternion);
      const s = c.scale * (0.9 + 0.1 * intro.current);
      mesh.scale.set(s, s, s);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = reveal;
      mesh.visible = reveal > 0.01;
    });
  });

  return (
    <group ref={group}>
      {cards.map((c, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) refs.current[i] = el;
          }}
          position={c.pos as [number, number, number]}
        >
          <planeGeometry args={[3.4, 2.0]} />
          <meshBasicMaterial
            map={c.texture}
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
            fog={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
