'use client';

import { MeshReflectorMaterial } from '@react-three/drei';
import LedWall from '../stagecraft/LedWall';
import Lasers from '../stagecraft/Lasers';
import Spotlights from '../stagecraft/Spotlights';
import Sparks from '../stagecraft/Sparks';
import Crowd from '../stagecraft/Crowd';
import DJ from '../figures/DJ';

/** SCENE 3 — The DJ / Festival. Composes the full stage. */
export default function DJScene({ mobile = false }: { mobile?: boolean }) {
  return (
    <group>
      {/* Reflective stage floor */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -3.4, -2]}>
        <planeGeometry args={[90, 90]} />
        <MeshReflectorMaterial
          resolution={mobile ? 256 : 512}
          blur={[400, 200]}
          mixBlur={1}
          mixStrength={10}
          depthScale={1}
          minDepthThreshold={0.85}
          color="#05070d"
          metalness={0.7}
          roughness={0.55}
          mirror={0.45}
        />
      </mesh>

      <LedWall />
      <Spotlights />
      <Lasers />
      <DJ />
      <Crowd count={mobile ? 120 : 260} />
      <Sparks count={mobile ? 400 : 900} />
    </group>
  );
}
