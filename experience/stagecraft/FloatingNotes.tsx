'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { audio } from '../audio/reactive';

/** A canvas-drawn music note sprite (♪ / ♫). */
function noteTexture() {
  const S = 64;
  const c = document.createElement('canvas');
  c.width = S;
  c.height = S;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#bff0ff';
  ctx.font = '52px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(Math.random() > 0.5 ? '♪' : '♫', S / 2, S / 2 + 4);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Music notes drifting up from the keys — the musician's signature. */
export default function FloatingNotes({ count = 30 }: { count?: number }) {
  const tex = useMemo(() => noteTexture(), []);
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: (Math.random() - 0.5) * 16,
        z: -4 + (Math.random() - 0.5) * 6,
        y0: Math.random() * 14,
        sp: 0.6 + Math.random() * 0.8,
        ph: Math.random() * Math.PI * 2,
        s: 0.5 + Math.random() * 0.6,
      })),
    [count]
  );

  useFrame(() => {
    const t = audio.time;
    data.forEach((d, i) => {
      const y = ((d.y0 + t * d.sp) % 16) - 2;
      const x = d.x + Math.sin(t * 0.5 + d.ph) * 1.2;
      dummy.position.set(x, y, d.z);
      const s = d.s * (1 + audio.beat * 0.3);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined as any, undefined as any, count]}
      frustumCulled={false}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={tex}
        transparent
        alphaTest={0.2}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}
