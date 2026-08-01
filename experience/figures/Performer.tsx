'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { audio } from '../audio/reactive';
import type { ActId } from '../audio/AudioEngine';
import { ACT_MAP } from '../acts';

/* ---------- silhouette painters (rim-lit, no faces) ---------- */

function base(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, 'rgba(150,200,255,0.95)');
  g.addColorStop(0.16, 'rgba(26,44,78,0.98)');
  g.addColorStop(1, 'rgba(4,6,13,1)');
  ctx.fillStyle = g;
  ctx.strokeStyle = g as unknown as string;
  ctx.lineCap = 'round';
  return g;
}

function head(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function torso(ctx: CanvasRenderingContext2D, W: number, top: number, bottom: number, wTop = 0.4, wBot = 0.34) {
  ctx.beginPath();
  ctx.moveTo(W * (0.5 - wTop / 2), top);
  ctx.lineTo(W * (0.5 + wTop / 2), top);
  ctx.lineTo(W * (0.5 + wBot / 2), bottom);
  ctx.lineTo(W * (0.5 - wBot / 2), bottom);
  ctx.closePath();
  ctx.fill();
}

const PAINTERS: Record<ActId, (ctx: CanvasRenderingContext2D, W: number, H: number) => void> = {
  singer: (ctx, W, H) => {
    base(ctx, W, H);
    head(ctx, W / 2, H * 0.26, 26);
    torso(ctx, W, H * 0.4, H);
    // Mic stand + mic to the mouth.
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(W * 0.28, H);
    ctx.lineTo(W * 0.4, H * 0.34);
    ctx.stroke();
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(W * 0.4, H * 0.34);
    ctx.lineTo(W * 0.46, H * 0.3);
    ctx.stroke();
    // One raised hand.
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.moveTo(W * 0.64, H * 0.46);
    ctx.lineTo(W * 0.84, H * 0.14);
    ctx.stroke();
  },
  guitarist: (ctx, W, H) => {
    base(ctx, W, H);
    head(ctx, W / 2, H * 0.24, 24);
    torso(ctx, W, H * 0.36, H);
    // Guitar body (diagonal) + neck.
    ctx.save();
    ctx.translate(W * 0.5, H * 0.62);
    ctx.rotate(-0.5);
    ctx.beginPath();
    ctx.ellipse(0, 0, 34, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(20, -8);
    ctx.lineTo(120, -58);
    ctx.stroke();
    ctx.restore();
    // Arms to the guitar.
    ctx.lineWidth = 13;
    ctx.beginPath();
    ctx.moveTo(W * 0.38, H * 0.42);
    ctx.lineTo(W * 0.5, H * 0.6);
    ctx.moveTo(W * 0.62, H * 0.42);
    ctx.lineTo(W * 0.72, H * 0.52);
    ctx.stroke();
  },
  musician: (ctx, W, H) => {
    base(ctx, W, H);
    head(ctx, W / 2, H * 0.28, 24);
    torso(ctx, W, H * 0.4, H * 0.72, 0.4, 0.44);
    // Keyboard slab in front.
    ctx.fillRect(W * 0.16, H * 0.72, W * 0.68, H * 0.1);
    // Arms down to keys.
    ctx.lineWidth = 13;
    ctx.beginPath();
    ctx.moveTo(W * 0.4, H * 0.46);
    ctx.lineTo(W * 0.36, H * 0.72);
    ctx.moveTo(W * 0.6, H * 0.46);
    ctx.lineTo(W * 0.64, H * 0.72);
    ctx.stroke();
  },
  dj: (ctx, W, H) => {
    base(ctx, W, H);
    head(ctx, W / 2, H * 0.26, 26);
    // Headphones.
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.arc(W / 2, H * 0.26, 32, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    torso(ctx, W, H * 0.42, H);
    // One raised hand, one on the deck.
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.moveTo(W * 0.64, H * 0.46);
    ctx.lineTo(W * 0.86, H * 0.08);
    ctx.moveTo(W * 0.36, H * 0.46);
    ctx.lineTo(W * 0.2, H * 0.6);
    ctx.stroke();
  },
  dancer: (ctx, W, H) => {
    base(ctx, W, H);
    head(ctx, W * 0.52, H * 0.22, 22);
    torso(ctx, W, H * 0.34, H * 0.72, 0.32, 0.24);
    ctx.lineWidth = 13;
    ctx.beginPath();
    ctx.moveTo(W * 0.44, H * 0.4); ctx.lineTo(W * 0.24, H * 0.16); // arm up
    ctx.moveTo(W * 0.6, H * 0.4); ctx.lineTo(W * 0.84, H * 0.36); // arm out
    ctx.moveTo(W * 0.46, H * 0.72); ctx.lineTo(W * 0.4, H); // standing leg
    ctx.moveTo(W * 0.54, H * 0.72); ctx.lineTo(W * 0.76, H * 0.88); // lifted leg
    ctx.stroke();
  },
  actor: (ctx, W, H) => {
    base(ctx, W, H);
    // Cape sweeping behind.
    ctx.beginPath();
    ctx.moveTo(W * 0.32, H * 0.4); ctx.lineTo(W * 0.08, H); ctx.lineTo(W * 0.5, H);
    ctx.closePath(); ctx.fill();
    head(ctx, W * 0.5, H * 0.24, 24);
    torso(ctx, W, H * 0.38, H, 0.4, 0.34);
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.moveTo(W * 0.6, H * 0.44); ctx.lineTo(W * 0.82, H * 0.12); // arm to sky
    ctx.stroke();
  },
  model: (ctx, W, H) => {
    base(ctx, W, H);
    head(ctx, W * 0.5, H * 0.2, 20);
    torso(ctx, W, H * 0.32, H, 0.28, 0.2);
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(W * 0.42, H * 0.42); ctx.lineTo(W * 0.32, H * 0.56); ctx.lineTo(W * 0.44, H * 0.6); // hand on hip
    ctx.moveTo(W * 0.58, H * 0.42); ctx.lineTo(W * 0.62, H * 0.72); // arm down
    ctx.stroke();
  },
  creator: (ctx, W, H) => {
    base(ctx, W, H);
    // Ring light halo.
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(W * 0.5, H * 0.36, H * 0.27, 0, Math.PI * 2);
    ctx.stroke();
    head(ctx, W * 0.5, H * 0.36, 20);
    torso(ctx, W, H * 0.48, H * 0.9, 0.38, 0.42);
    ctx.fillRect(W * 0.42, H * 0.86, W * 0.16, H * 0.1); // camera
  },
  influencer: (ctx, W, H) => {
    base(ctx, W, H);
    head(ctx, W * 0.5, H * 0.24, 22);
    torso(ctx, W, H * 0.38, H, 0.36, 0.28);
    ctx.lineWidth = 13;
    ctx.beginPath();
    ctx.moveTo(W * 0.56, H * 0.42); ctx.lineTo(W * 0.78, H * 0.28); // arm up
    ctx.moveTo(W * 0.44, H * 0.42); ctx.lineTo(W * 0.4, H * 0.66);
    ctx.stroke();
    ctx.fillRect(W * 0.76, H * 0.2, W * 0.1, H * 0.13); // phone
  },
  athlete: (ctx, W, H) => {
    base(ctx, W, H);
    head(ctx, W * 0.52, H * 0.2, 20);
    torso(ctx, W, H * 0.3, H * 0.62, 0.3, 0.22);
    ctx.lineWidth = 13;
    ctx.beginPath();
    ctx.moveTo(W * 0.44, H * 0.36); ctx.lineTo(W * 0.3, H * 0.26); // arm
    ctx.moveTo(W * 0.58, H * 0.36); ctx.lineTo(W * 0.7, H * 0.5); // arm
    ctx.moveTo(W * 0.48, H * 0.62); ctx.lineTo(W * 0.38, H * 0.9); // leg
    ctx.moveTo(W * 0.54, H * 0.62); ctx.lineTo(W * 0.7, H * 0.8); // leg
    ctx.stroke();
    ctx.beginPath(); ctx.arc(W * 0.74, H * 0.9, 12, 0, Math.PI * 2); ctx.fill(); // ball
  },
  anchor: (ctx, W, H) => {
    base(ctx, W, H);
    head(ctx, W * 0.5, H * 0.28, 22);
    torso(ctx, W, H * 0.42, H * 0.72, 0.42, 0.46);
    ctx.fillRect(W * 0.16, H * 0.72, W * 0.68, H * 0.14); // desk
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(W * 0.5, H * 0.72); ctx.lineTo(W * 0.5, H * 0.52); ctx.stroke();
    ctx.beginPath(); ctx.arc(W * 0.5, H * 0.5, 6, 0, Math.PI * 2); ctx.fill(); // mic
  },
  photographer: (ctx, W, H) => {
    base(ctx, W, H);
    head(ctx, W * 0.5, H * 0.26, 22);
    torso(ctx, W, H * 0.4, H, 0.4, 0.34);
    ctx.lineWidth = 13;
    ctx.beginPath();
    ctx.moveTo(W * 0.4, H * 0.44); ctx.lineTo(W * 0.42, H * 0.3);
    ctx.moveTo(W * 0.6, H * 0.44); ctx.lineTo(W * 0.58, H * 0.3);
    ctx.stroke();
    ctx.fillRect(W * 0.4, H * 0.2, W * 0.2, H * 0.13); // camera body
    ctx.beginPath(); ctx.arc(W * 0.5, H * 0.27, 8, 0, Math.PI * 2); ctx.fill(); // lens
  },
  filmmaker: (ctx, W, H) => {
    base(ctx, W, H);
    head(ctx, W * 0.5, H * 0.26, 22);
    torso(ctx, W, H * 0.4, H, 0.4, 0.34);
    ctx.lineWidth = 13;
    ctx.beginPath();
    ctx.moveTo(W * 0.6, H * 0.44); ctx.lineTo(W * 0.8, H * 0.18); // raised arm
    ctx.moveTo(W * 0.4, H * 0.44); ctx.lineTo(W * 0.36, H * 0.66);
    ctx.stroke();
    ctx.fillRect(W * 0.72, H * 0.08, W * 0.18, H * 0.1); // clapperboard
  },
  performer: (ctx, W, H) => {
    base(ctx, W, H);
    head(ctx, W * 0.5, H * 0.22, 24);
    torso(ctx, W, H * 0.36, H, 0.4, 0.34);
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.moveTo(W * 0.42, H * 0.42); ctx.lineTo(W * 0.16, H * 0.3); // arm wide
    ctx.moveTo(W * 0.58, H * 0.42); ctx.lineTo(W * 0.84, H * 0.3); // arm wide
    ctx.stroke();
  },
};

function makeTexture(act: ActId) {
  const W = 200;
  const H = 240;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d')!;
  PAINTERS[act](ctx, W, H);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function Performer({
  act,
  booth = true,
}: {
  act: ActId;
  booth?: boolean;
}) {
  // Pre-bake all four silhouettes; swap by visibility so switching is instant.
  const textures = useMemo(() => {
    const map: Partial<Record<ActId, THREE.Texture>> = {};
    (Object.keys(PAINTERS) as ActId[]).forEach((a) => {
      map[a] = makeTexture(a);
    });
    return map as Record<ActId, THREE.Texture>;
  }, []);

  const fig = useRef<THREE.Mesh>(null!);
  const halo = useRef<THREE.Mesh>(null!);
  const haloColor = useMemo(() => new THREE.Color(ACT_MAP[act].accent), [act]);

  useFrame(() => {
    const t = audio.time;
    if (fig.current) {
      fig.current.position.y = 1.9 + Math.sin(t * 2) * 0.05 + audio.beat * 0.16;
      fig.current.rotation.z = Math.sin(t * 1.3) * 0.02;
      (fig.current.material as THREE.MeshBasicMaterial).map = textures[act];
    }
    if (halo.current) {
      const s = 5 + audio.bass * 3 + audio.beat * 1.4;
      halo.current.scale.set(s, s, 1);
      const m = halo.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.22 + audio.bass * 0.5;
      m.color.lerp(haloColor, 0.1);
    }
  });

  return (
    <group position={[0, 0, -6]}>
      <mesh ref={halo} position={[0, 2.2, -1]}>
        <circleGeometry args={[1, 48]} />
        <meshBasicMaterial
          color={ACT_MAP[act].accent}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          fog={false}
        />
      </mesh>

      <mesh ref={fig} position={[0, 1.9, 0]}>
        <planeGeometry args={[3.6, 4.3]} />
        <meshBasicMaterial
          map={textures[act]}
          transparent
          alphaTest={0.3}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Booth (DJ / keys) or an open-stage riser glow */}
      {booth ? (
        <mesh position={[0, -1.6, 1.2]}>
          <boxGeometry args={[6, 2, 1.6]} />
          <meshBasicMaterial color="#080b16" toneMapped={false} />
        </mesh>
      ) : (
        <mesh rotation-x={-Math.PI / 2} position={[0, -3.3, 0]}>
          <circleGeometry args={[3.4, 48]} />
          <meshBasicMaterial
            color={ACT_MAP[act].accent}
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
            fog={false}
          />
        </mesh>
      )}
    </group>
  );
}
