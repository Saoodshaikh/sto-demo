'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scroll } from '@/lib/scroll-store';
import { globeWeight } from '@/lib/phases';
import { greatCircleArc, latLonToVec3, INDIA, HUBS } from '@/lib/geo';
import {
  arcVertex,
  arcFragment,
  dotsVertex,
  dotsFragment,
} from './holographic.glsl';

const RADIUS = 5.4;

/**
 * The visible "AI connections": one bowed tube per hub, from India outward,
 * each carrying a travelling pulse of light. Rendered inside the Earth group so
 * the arcs stay attached to their cities as the globe rotates.
 */
export default function ConnectionArcs() {
  const arcMat = useRef<THREE.ShaderMaterial>(null!);
  const nodeMat = useRef<THREE.ShaderMaterial>(null!);
  const reveal = useRef(0);

  // One tube geometry per hub arc, each stamped with a phase offset so the
  // pulses fire out of sync.
  const arcs = useMemo(() => {
    return HUBS.map((hub, i) => {
      const pts = greatCircleArc(
        INDIA.lat,
        INDIA.lon,
        hub.lat,
        hub.lon,
        RADIUS + 0.03,
        56,
        2.2
      );
      const curve = new THREE.CatmullRomCurve3(pts);
      const geo = new THREE.TubeGeometry(curve, 60, 0.03, 8, false);
      const n = geo.attributes.position.count;
      const offset = new Float32Array(n).fill((i * 0.161803) % 1);
      geo.setAttribute('aOffset', new THREE.BufferAttribute(offset, 1));
      return geo;
    });
  }, []);

  const arcUniforms = useMemo(
    () => ({ uTime: { value: 0 }, uReveal: { value: 0 }, uSpeed: { value: 0.17 } }),
    []
  );

  // Endpoint markers: India origin (glowing) + every hub.
  const nodeGeo = useMemo(() => {
    const positions: number[] = [];
    const india: number[] = [];
    const origin = latLonToVec3(INDIA.lat, INDIA.lon, RADIUS + 0.05);
    positions.push(origin.x, origin.y, origin.z);
    india.push(1);
    for (const h of HUBS) {
      const v = latLonToVec3(h.lat, h.lon, RADIUS + 0.05);
      positions.push(v.x, v.y, v.z);
      india.push(0);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    g.setAttribute('aIndia', new THREE.BufferAttribute(new Float32Array(india), 1));
    return g;
  }, []);

  const nodeUniforms = useMemo(
    () => ({ uTime: { value: 0 }, uReveal: { value: 0 }, uSize: { value: 34 } }),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const target = globeWeight(scroll.progress);
    reveal.current += (target - reveal.current) * Math.min(delta * 3, 1);

    arcUniforms.uTime.value = t;
    arcUniforms.uReveal.value = reveal.current;
    nodeUniforms.uTime.value = t;
    nodeUniforms.uReveal.value = reveal.current;
  });

  return (
    <group>
      {arcs.map((geo, i) => (
        <mesh key={i} geometry={geo}>
          <shaderMaterial
            ref={i === 0 ? arcMat : undefined}
            uniforms={arcUniforms}
            vertexShader={arcVertex}
            fragmentShader={arcFragment}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      <points geometry={nodeGeo} frustumCulled={false}>
        <shaderMaterial
          ref={nodeMat}
          uniforms={nodeUniforms}
          vertexShader={dotsVertex}
          fragmentShader={dotsFragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
