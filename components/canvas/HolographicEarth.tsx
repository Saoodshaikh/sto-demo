'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scroll } from '@/lib/scroll-store';
import { globeWeight } from '@/lib/phases';
import { landDots, latLonToVec3, INDIA } from '@/lib/geo';
import {
  shellVertex,
  shellFragment,
  dotsVertex,
  dotsFragment,
} from './holographic.glsl';
import ConnectionArcs from './ConnectionArcs';

const RADIUS = 5.4;

export default function HolographicEarth() {
  const group = useRef<THREE.Group>(null!);
  const shellMat = useRef<THREE.ShaderMaterial>(null!);
  const dotsMat = useRef<THREE.ShaderMaterial>(null!);
  const grid = useRef<THREE.LineSegments>(null!);
  const beacon = useRef<THREE.Mesh>(null!);
  const reveal = useRef(0);

  // Dotted continents geometry.
  const dotsGeo = useMemo(() => {
    const { positions, india } = landDots(RADIUS + 0.02);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('aIndia', new THREE.BufferAttribute(india, 1));
    return g;
  }, []);

  // Latitude/longitude wire grid for structure.
  const gridGeo = useMemo(() => {
    const g = new THREE.SphereGeometry(RADIUS, 36, 24);
    return new THREE.WireframeGeometry(g);
  }, []);

  const shellUniforms = useMemo(
    () => ({ uTime: { value: 0 }, uReveal: { value: 0 } }),
    []
  );
  const dotsUniforms = useMemo(
    () => ({ uTime: { value: 0 }, uReveal: { value: 0 }, uSize: { value: 12 } }),
    []
  );

  // Orient India toward the camera at reveal, then let it drift.
  const indiaDir = useMemo(
    () => latLonToVec3(INDIA.lat, INDIA.lon, 1).normalize(),
    []
  );
  const beaconQuat = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), indiaDir);
    return q;
  }, [indiaDir]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const target = globeWeight(scroll.progress);
    // Smooth the reveal so it eases in/out rather than tracking scroll rigidly.
    reveal.current += (target - reveal.current) * Math.min(delta * 3, 1);
    const r = reveal.current;

    shellUniforms.uReveal.value = r;
    dotsUniforms.uReveal.value = r;
    shellUniforms.uTime.value = t;
    dotsUniforms.uTime.value = t;

    if (group.current) {
      // Rotate so India faces camera early (offset), plus a slow global spin.
      group.current.rotation.y = -1.2 + t * 0.05;
      group.current.rotation.x = -0.18;
      const s = 0.8 + 0.2 * r;
      group.current.scale.setScalar(s);
      group.current.visible = r > 0.001;
    }
    if (grid.current) {
      (grid.current.material as THREE.LineBasicMaterial).opacity = 0.06 * r;
    }
    if (beacon.current) {
      // Expanding, fading beacon ring pulsing out from India.
      const pulse = (t * 0.6) % 1;
      const s = RADIUS * (0.04 + pulse * 0.5);
      beacon.current.scale.setScalar(s);
      (beacon.current.material as THREE.MeshBasicMaterial).opacity =
        (1 - pulse) * 0.8 * r;
    }
  });

  return (
    <group ref={group}>
      {/* Fresnel hologram shell */}
      <mesh>
        <sphereGeometry args={[RADIUS, 64, 48]} />
        <shaderMaterial
          ref={shellMat}
          uniforms={shellUniforms}
          vertexShader={shellVertex}
          fragmentShader={shellFragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Inner dark core so the far side dots don't bleed through */}
      <mesh>
        <sphereGeometry args={[RADIUS - 0.06, 48, 32]} />
        <meshBasicMaterial color="#04060d" transparent opacity={0.85} />
      </mesh>

      {/* Lat/long grid */}
      <lineSegments ref={grid} geometry={gridGeo}>
        <lineBasicMaterial color="#4f7bff" transparent opacity={0} depthWrite={false} />
      </lineSegments>

      {/* Dotted continents */}
      <points geometry={dotsGeo} frustumCulled={false}>
        <shaderMaterial
          ref={dotsMat}
          uniforms={dotsUniforms}
          vertexShader={dotsVertex}
          fragmentShader={dotsFragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* India beacon ring, tangent to the surface at New Delhi */}
      <mesh
        ref={beacon}
        position={indiaDir.clone().multiplyScalar(RADIUS + 0.05)}
        quaternion={beaconQuat}
      >
        <ringGeometry args={[0.7, 1.0, 48]} />
        <meshBasicMaterial
          color="#ffdca0"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* AI connection beams — inherit the globe's rotation + scale */}
      <ConnectionArcs />
    </group>
  );
}
