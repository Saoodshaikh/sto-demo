'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { audio } from '../audio/reactive';

const vert = /* glsl */ `
  uniform float uTime;
  uniform float uBeat;
  attribute float aSeed;
  attribute float aScale;
  varying float vSeed;
  void main() {
    vSeed = aSeed;
    vec3 p = position;
    // Drift upward and loop; jump a little on the beat.
    float t = uTime * (0.2 + aSeed * 0.3);
    p.y = mod(p.y + t * 2.0, 26.0) - 6.0;
    p.x += sin(uTime * 0.5 + aSeed * 6.28) * 1.5;
    p.z += cos(uTime * 0.4 + aSeed * 6.28) * 1.5;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aScale * (1.0 + uBeat * 1.5) * (60.0 / -mv.z);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  varying float vSeed;
  uniform float uBeat;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    vec3 warm = vec3(1.0, 0.85, 0.55);
    vec3 cool = vec3(0.4, 0.9, 1.0);
    vec3 c = mix(cool, warm, fract(vSeed * 3.0));
    gl_FragColor = vec4(c * (1.0 + uBeat), a);
  }
`;

/** Floating embers / confetti sparks that swell on every kick. */
export default function Sparks({ count = 900 }: { count?: number }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const scale = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = Math.random() * 26;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 24 - 4;
      seed[i] = Math.random();
      scale[i] = 0.5 + Math.random() * 2.0;
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    g.setAttribute('aScale', new THREE.BufferAttribute(scale, 1));
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uBeat: { value: 0 } }),
    []
  );

  useFrame(() => {
    uniforms.uTime.value = audio.time;
    uniforms.uBeat.value = audio.beat;
  });

  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vert}
        fragmentShader={frag}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}
