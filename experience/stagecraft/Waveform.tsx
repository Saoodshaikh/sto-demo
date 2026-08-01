'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { audio } from '../audio/reactive';
import { ACT_MAP } from '../acts';
import type { ActId } from '../audio/AudioEngine';

const SEGMENTS = 128;

/**
 * A circular oscilloscope of the live audio, ringed behind the performer.
 * Radius modulates with the waveform + bass so it "breathes" with the music —
 * the visible signature of whichever talent is on stage.
 */
export default function Waveform({
  act,
  scale = 1,
}: {
  act: ActId;
  scale?: number;
}) {
  const line = useRef<THREE.LineLoop>(null!);
  const color = useMemo(() => new THREE.Color(ACT_MAP[act].accent), [act]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(SEGMENTS * 3), 3)
    );
    return g;
  }, []);

  useFrame(() => {
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const baseR = 4.6 + audio.bass * 1.2;
    for (let i = 0; i < SEGMENTS; i++) {
      const a = (i / SEGMENTS) * Math.PI * 2;
      const w = audio.wave[i % audio.wave.length] || 0;
      const r = baseR + w * 2.2 * scale;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = Math.sin(a) * r + 2;
      arr[i * 3 + 2] = 0;
    }
    pos.needsUpdate = true;

    if (line.current) {
      const m = line.current.material as THREE.LineBasicMaterial;
      m.color.lerp(color, 0.1);
      m.opacity = 0.5 + audio.level * 0.5;
    }
  });

  return (
    <lineLoop ref={line} geometry={geo} position={[0, 0, -8]}>
      <lineBasicMaterial
        color={ACT_MAP[act].accent}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
        fog={false}
      />
    </lineLoop>
  );
}
