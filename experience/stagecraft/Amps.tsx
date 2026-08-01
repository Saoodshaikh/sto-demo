'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { audio } from '../audio/reactive';

/** A single speaker cabinet whose grille glows and pumps with the bass. */
function Cabinet({ x }: { x: number }) {
  const grille = useRef<THREE.Mesh>(null!);
  useFrame(() => {
    if (grille.current) {
      const m = grille.current.material as THREE.MeshBasicMaterial;
      const g = 0.3 + audio.bass * 1.3 + audio.beat * 0.5;
      m.color.setRGB(g, g * 0.55, g * 0.2); // warm amber pump
    }
  });
  return (
    <group position={[x, -1.4, -3.5]}>
      {/* Cabinet body */}
      <mesh>
        <boxGeometry args={[3, 4, 1.6]} />
        <meshBasicMaterial color="#0a0a0f" toneMapped={false} />
      </mesh>
      {/* Two speaker cones */}
      {[0.9, -0.9].map((y, i) => (
        <mesh key={i} ref={i === 0 ? grille : undefined} position={[0, y, 0.85]}>
          <circleGeometry args={[0.95, 32]} />
          <meshBasicMaterial
            color="#ffb454"
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
            fog={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Amp stacks flanking the guitarist's stage. */
export default function Amps() {
  return (
    <group>
      <Cabinet x={-8.5} />
      <Cabinet x={8.5} />
    </group>
  );
}
