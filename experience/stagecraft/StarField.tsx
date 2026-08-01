'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { audio } from '../audio/reactive';

const vert = /* glsl */ `
  uniform float uTime;
  attribute float aSeed;
  varying float vSeed;
  void main() {
    vSeed = aSeed;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.0 + aSeed * 2.5) * (120.0 / -mv.z);
  }
`;
const frag = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uLevel;
  varying float vSeed;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    float tw = 0.5 + 0.5 * sin(uTime * 1.5 + vSeed * 40.0);
    gl_FragColor = vec4(vec3(0.75, 0.85, 1.0), a * (0.35 + tw * 0.5) * (0.6 + uLevel));
  }
`;

/** A deep starfield backdrop for the intimate concert acts. */
export default function StarField({ count = 700 }: { count?: number }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 90;
      pos[i * 3 + 1] = Math.random() * 40 - 2;
      pos[i * 3 + 2] = -20 - Math.random() * 40;
      seed[i] = Math.random();
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uLevel: { value: 0 } }),
    []
  );
  useFrame(() => {
    uniforms.uTime.value = audio.time;
    uniforms.uLevel.value = audio.level;
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
