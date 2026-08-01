'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { audio } from '../audio/reactive';

const PALETTE = [
  new THREE.Color('#42e8ff'),
  new THREE.Color('#4f7bff'),
  new THREE.Color('#8b5cf6'),
  new THREE.Color('#ff5da2'),
];

/** One rig of beams fanning from a truss point and sweeping to the beat. */
function Rig({ origin, dir }: { origin: [number, number, number]; dir: number }) {
  const group = useRef<THREE.Group>(null!);
  const beams = useRef<THREE.Mesh[]>([]);
  const count = 7;

  // A cylinder whose pivot is at its TOP, so it emanates from the truss.
  const geo = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.04, 0.14, 34, 6, 1, true);
    g.translate(0, -17, 0);
    return g;
  }, []);

  useFrame(() => {
    const t = audio.time;
    const sweep = Math.sin(t * 0.6) * 0.5 + dir * t * 0.08;
    if (group.current) group.current.rotation.z = sweep;

    beams.current.forEach((m, i) => {
      if (!m) return;
      const mat = m.material as THREE.MeshBasicMaterial;
      // Each beam flickers on treble + snaps bright on the beat.
      const flick = 0.3 + 0.7 * Math.abs(Math.sin(t * 4 + i));
      mat.opacity = (0.12 + audio.treble * 0.5 + audio.beat * 0.5) * flick;
    });
  });

  return (
    <group ref={group} position={origin}>
      {Array.from({ length: count }).map((_, i) => {
        const spread = (i / (count - 1) - 0.5) * 1.5;
        return (
          <mesh
            key={i}
            geometry={geo}
            rotation={[0.15, 0, spread]}
            ref={(el) => {
              if (el) beams.current[i] = el;
            }}
          >
            <meshBasicMaterial
              color={PALETTE[i % PALETTE.length]}
              transparent
              opacity={0.2}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
              side={THREE.DoubleSide}
              fog={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function Lasers({ rigs = 3 }: { rigs?: number }) {
  const all = [
    { origin: [-12, 13, -6] as [number, number, number], dir: 1 },
    { origin: [12, 13, -6] as [number, number, number], dir: -1 },
    { origin: [0, 14, -10] as [number, number, number], dir: 1 },
  ];
  return (
    <group>
      {all.slice(0, Math.max(0, rigs)).map((r, i) => (
        <Rig key={i} origin={r.origin} dir={r.dir} />
      ))}
    </group>
  );
}
