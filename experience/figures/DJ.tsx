'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { audio } from '../audio/reactive';

/** DJ silhouette — headphones, one hand raised to the crowd. */
function djTexture() {
  const W = 200;
  const H = 240;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d')!;

  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, 'rgba(150,200,255,0.95)');
  g.addColorStop(0.16, 'rgba(26,44,78,0.98)');
  g.addColorStop(1, 'rgba(4,6,13,1)');
  ctx.fillStyle = g;
  ctx.strokeStyle = g as unknown as string;

  // Head.
  ctx.beginPath();
  ctx.arc(W / 2, H * 0.26, 26, 0, Math.PI * 2);
  ctx.fill();
  // Headphones.
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.arc(W / 2, H * 0.26, 32, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(W / 2 - 30, H * 0.28, 9, 0, Math.PI * 2);
  ctx.arc(W / 2 + 30, H * 0.28, 9, 0, Math.PI * 2);
  ctx.fill();
  // Torso.
  ctx.beginPath();
  ctx.moveTo(W * 0.3, H * 0.42);
  ctx.lineTo(W * 0.7, H * 0.42);
  ctx.lineTo(W * 0.66, H);
  ctx.lineTo(W * 0.34, H);
  ctx.closePath();
  ctx.fill();
  // One raised arm (right), one on the deck (left).
  ctx.lineWidth = 15;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(W * 0.64, H * 0.46);
  ctx.lineTo(W * 0.86, H * 0.08); // raised
  ctx.moveTo(W * 0.36, H * 0.46);
  ctx.lineTo(W * 0.2, H * 0.6); // on deck
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function DJ() {
  const tex = useMemo(() => djTexture(), []);
  const dj = useRef<THREE.Mesh>(null!);
  const halo = useRef<THREE.Mesh>(null!);
  const booth = useRef<THREE.Mesh>(null!);
  const boothMat = useRef<THREE.MeshBasicMaterial>(null!);

  useFrame(() => {
    const t = audio.time;
    if (dj.current) {
      // Subtle sway + a lift on the beat, as if working the crowd.
      dj.current.position.y = 1.7 + Math.sin(t * 2) * 0.05 + audio.beat * 0.18;
      dj.current.rotation.z = Math.sin(t * 1.3) * 0.02;
    }
    if (halo.current) {
      const s = 5 + audio.bass * 3 + audio.beat * 1.5;
      halo.current.scale.set(s, s, 1);
      (halo.current.material as THREE.MeshBasicMaterial).opacity =
        0.25 + audio.bass * 0.5;
    }
    if (boothMat.current) {
      boothMat.current.color.setRGB(
        0.2 + audio.mid,
        0.6 + audio.treble * 0.6,
        1.0
      );
    }
  });

  return (
    <group position={[0, 0, -6]}>
      {/* Bass-reactive halo behind the DJ */}
      <mesh ref={halo} position={[0, 2, -1]}>
        <circleGeometry args={[1, 48]} />
        <meshBasicMaterial
          color="#4f7bff"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          fog={false}
        />
      </mesh>

      {/* DJ silhouette */}
      <mesh ref={dj} position={[0, 1.7, 0]}>
        <planeGeometry args={[3.4, 4.1]} />
        <meshBasicMaterial
          map={tex}
          transparent
          alphaTest={0.3}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Booth */}
      <mesh ref={booth} position={[0, -1.4, 1.4]}>
        <boxGeometry args={[6, 2.2, 1.6]} />
        <meshBasicMaterial color="#080b16" toneMapped={false} />
      </mesh>
      {/* Booth LED face */}
      <mesh position={[0, -1.4, 2.22]}>
        <planeGeometry args={[5.6, 1.7]} />
        <meshBasicMaterial
          ref={boothMat}
          color="#2a7bff"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          fog={false}
        />
      </mesh>
    </group>
  );
}
