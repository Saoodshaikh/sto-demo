'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { audio } from '../audio/reactive';

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uBass;
  uniform float uMid;
  uniform float uTreble;
  uniform float uBeat;

  float hash(float n){ return fract(sin(n)*43758.5453); }

  void main() {
    // 32-column equalizer.
    float cols = 32.0;
    float col = floor(vUv.x * cols);
    float seed = hash(col);

    // Per-column bar height driven by audio + travelling sine waves.
    float wave = 0.5 + 0.5 * sin(uTime * 3.0 + col * 0.5);
    float band = mix(uBass, uTreble, fract(col / cols + 0.15));
    float h = clamp(0.18 + band * 1.3 * (0.6 + 0.4 * wave) + uMid * 0.4, 0.0, 1.0);
    h *= 0.7 + 0.6 * hash(col + floor(uTime * 2.0)); // flicker

    float lit = step(vUv.y, h);

    // Neon hue sweeping horizontally, cycling with the music.
    float hue = fract(vUv.x * 0.6 - uTime * 0.08 + uMid * 0.3);
    vec3 electric = vec3(0.31, 0.48, 1.0);
    vec3 cyan     = vec3(0.26, 0.95, 1.0);
    vec3 violet   = vec3(0.6, 0.32, 1.0);
    vec3 col3 = mix(electric, cyan, smoothstep(0.0, 0.5, hue));
    col3 = mix(col3, violet, smoothstep(0.5, 1.0, hue));

    // Brighter toward the top of each bar.
    col3 *= 0.5 + 0.9 * vUv.y / max(h, 0.001);

    // LED pixel grid.
    vec2 grid = fract(vec2(vUv.x * cols, vUv.y * 26.0));
    float cell = smoothstep(0.05, 0.12, grid.x) * smoothstep(0.05, 0.12, grid.y)
               * smoothstep(0.05, 0.12, 1.0 - grid.x) * smoothstep(0.05, 0.12, 1.0 - grid.y);

    vec3 color = col3 * lit * cell;
    color += uBeat * 0.25 * lit;           // beat flash
    color += 0.02;                         // faint idle glow

    gl_FragColor = vec4(color, 1.0);
  }
`;

/** Wraparound LED walls behind the DJ that pulse with the frequency bands. */
export default function LedWall() {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBass: { value: 0 },
      uMid: { value: 0 },
      uTreble: { value: 0 },
      uBeat: { value: 0 },
    }),
    []
  );
  const mat = useRef<THREE.ShaderMaterial>(null!);

  useFrame(() => {
    uniforms.uTime.value = audio.time;
    uniforms.uBass.value += (audio.bass - uniforms.uBass.value) * 0.35;
    uniforms.uMid.value += (audio.mid - uniforms.uMid.value) * 0.35;
    uniforms.uTreble.value += (audio.treble - uniforms.uTreble.value) * 0.4;
    uniforms.uBeat.value = audio.beat;
  });

  const Wall = ({
    position,
    rotation,
    args,
  }: {
    position: [number, number, number];
    rotation: [number, number, number];
    args: [number, number];
  }) => (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={args} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vert}
        fragmentShader={frag}
        toneMapped={false}
      />
    </mesh>
  );

  return (
    <group>
      {/* Back wall */}
      <Wall position={[0, 6, -18]} rotation={[0, 0, 0]} args={[46, 20]} />
      {/* Angled side wings */}
      <Wall position={[-21, 6, -9]} rotation={[0, Math.PI / 3.2, 0]} args={[22, 20]} />
      <Wall position={[21, 6, -9]} rotation={[0, -Math.PI / 3.2, 0]} args={[22, 20]} />
    </group>
  );
}
