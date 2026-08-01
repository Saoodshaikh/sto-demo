'use client';

import { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { audio } from '../audio/reactive';

/** A canvas-drawn concert-goer silhouette (arms up), rim-lit at the top. */
function crowdTexture() {
  const W = 128;
  const H = 160;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d')!;

  // Rim gradient — dark body, cool light catching the top edge.
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, 'rgba(120,180,255,0.9)');
  g.addColorStop(0.18, 'rgba(30,50,90,0.95)');
  g.addColorStop(1, 'rgba(4,6,13,0.98)');
  ctx.fillStyle = g;

  // Head.
  ctx.beginPath();
  ctx.arc(W / 2, H * 0.24, 15, 0, Math.PI * 2);
  ctx.fill();
  // Torso.
  ctx.beginPath();
  ctx.moveTo(W * 0.32, H * 0.36);
  ctx.lineTo(W * 0.68, H * 0.36);
  ctx.lineTo(W * 0.6, H);
  ctx.lineTo(W * 0.4, H);
  ctx.closePath();
  ctx.fill();
  // Raised arms.
  ctx.lineWidth = 11;
  ctx.lineCap = 'round';
  ctx.strokeStyle = g as unknown as string;
  ctx.beginPath();
  ctx.moveTo(W * 0.36, H * 0.4);
  ctx.lineTo(W * 0.2, H * 0.12);
  ctx.moveTo(W * 0.64, H * 0.4);
  ctx.lineTo(W * 0.8, H * 0.12);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function Crowd({ count = 260 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tex = useMemo(() => crowdTexture(), []);

  // Per-instance base layout.
  const data = useMemo(() => {
    const arr: { x: number; z: number; y: number; s: number; ph: number }[] = [];
    for (let i = 0; i < count; i++) {
      const z = 4 + Math.random() * 18;
      // wider crowd toward the back
      const spread = 12 + (z - 4) * 0.9;
      arr.push({
        x: (Math.random() - 0.5) * spread * 2,
        z,
        y: -3.2,
        s: 1.4 + Math.random() * 1.1,
        ph: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, [count]);

  useLayoutEffect(() => {
    data.forEach((d, i) => {
      dummy.position.set(d.x, d.y + d.s / 2, d.z);
      dummy.scale.set(d.s * 0.7, d.s, 1);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [data, dummy]);

  useFrame(() => {
    const t = audio.time;
    const jump = audio.beat * 0.5 + audio.bass * 0.3;
    data.forEach((d, i) => {
      const bob = Math.sin(t * 6.4 + d.ph) * 0.12 + jump;
      dummy.position.set(d.x, d.y + d.s / 2 + bob, d.z);
      dummy.scale.set(d.s * 0.7, d.s, 1);
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
      <planeGeometry args={[1.6, 2.4]} />
      <meshBasicMaterial
        map={tex}
        transparent
        alphaTest={0.35}
        depthWrite={true}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}
