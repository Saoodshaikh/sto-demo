'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { audio } from '../audio/reactive';

const vert = /* glsl */ `
  varying float vY;
  void main() {
    vY = uv.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Soft volumetric cone: bright at the source, fading to nothing at the floor,
// and feathered at the cone edge for a god-ray look.
const frag = /* glsl */ `
  precision highp float;
  varying float vY;
  uniform vec3 uColor;
  uniform float uIntensity;
  void main() {
    float top = smoothstep(0.0, 0.35, vY);      // fade from apex
    float bottom = smoothstep(1.0, 0.4, vY);     // fade to floor
    float a = top * bottom * 0.5 * uIntensity;
    gl_FragColor = vec4(uColor * (0.6 + a), a);
  }
`;

function Beam({
  x,
  color,
  swing,
  phase,
}: {
  x: number;
  color: string;
  swing: number;
  phase: number;
}) {
  const mesh = useRef<THREE.Mesh>(null!);
  const mat = useRef<THREE.ShaderMaterial>(null!);
  const uColor = useRef(new THREE.Color(color));

  useFrame(() => {
    const t = audio.time;
    if (mesh.current) {
      mesh.current.rotation.z = Math.sin(t * 0.5 + phase) * swing;
      mesh.current.rotation.x = 0.12 + Math.sin(t * 0.3 + phase) * 0.05;
    }
    if (mat.current) {
      mat.current.uniforms.uIntensity.value = 0.5 + audio.level * 1.4 + audio.beat * 0.6;
    }
  });

  return (
    <mesh ref={mesh} position={[x, 12.5, -5]}>
      {/* open cone, apex up */}
      <coneGeometry args={[4.2, 20, 32, 1, true]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={{
          uColor: { value: uColor.current },
          uIntensity: { value: 0.6 },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

/** Volumetric spotlights raking the stage through the fog, colored per act. */
export default function Spotlights({
  colors = ['#4f7bff', '#42e8ff', '#8b5cf6', '#42e8ff'],
}: {
  colors?: string[];
}) {
  const n = colors.length;
  return (
    <group>
      {colors.map((c, i) => {
        // Spread beams across the stage; edges swing wider than the center.
        const x = n === 1 ? 0 : (i / (n - 1) - 0.5) * 16;
        const swing = 0.22 + Math.abs(i / (n - 1) - 0.5) * 0.3;
        return <Beam key={i} x={x} color={c} swing={swing} phase={i * 1.6} />;
      })}
    </group>
  );
}
