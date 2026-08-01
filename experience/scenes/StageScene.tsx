'use client';

import { MeshReflectorMaterial } from '@react-three/drei';
import LedWall from '../stagecraft/LedWall';
import Lasers from '../stagecraft/Lasers';
import Spotlights from '../stagecraft/Spotlights';
import Sparks from '../stagecraft/Sparks';
import Crowd from '../stagecraft/Crowd';
import Waveform from '../stagecraft/Waveform';
import StarField from '../stagecraft/StarField';
import Amps from '../stagecraft/Amps';
import FloatingNotes from '../stagecraft/FloatingNotes';
import Performer from '../figures/Performer';
import { STAGE } from '../acts';
import type { ActId } from '../audio/AudioEngine';

/**
 * The Stage adapts to the talent: the performer, palette, lighting and set
 * pieces all change per act — a DJ festival, a singer's concert, a guitarist's
 * rock stage, a musician's recital — while the floor + crowd stay shared.
 */
export default function StageScene({
  act,
  mobile = false,
}: {
  act: ActId;
  mobile?: boolean;
}) {
  const cfg = STAGE[act];

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

      {/* Backdrop set pieces (per act) */}
      {cfg.stars && <StarField count={mobile ? 350 : 700} />}
      {cfg.ledWall && <LedWall />}
      {cfg.amps && <Amps />}
      {cfg.notes && <FloatingNotes count={mobile ? 18 : 30} />}

      {/* Lighting */}
      <Spotlights colors={cfg.spots} />
      {cfg.laserRigs > 0 && <Lasers rigs={cfg.laserRigs} />}

      {/* The performance */}
      <Waveform act={act} scale={cfg.waveScale} />
      <Performer act={act} booth={cfg.booth} />

      {/* Audience + atmosphere */}
      <Crowd count={mobile ? 120 : 260} />
      <Sparks count={mobile ? 300 : cfg.ledWall ? 900 : 500} />
    </group>
  );
}
