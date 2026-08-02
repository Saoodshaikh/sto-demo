'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { audio } from '../audio/reactive';
import { ACT_MAP } from '../acts';
import type { ActId } from '../audio/AudioEngine';

type Pose = 'armUp' | 'armsOut' | 'hold' | 'action' | 'hip';

const POSE: Record<ActId, Pose> = {
  singer: 'armUp', dj: 'armUp', performer: 'armUp', influencer: 'armUp', filmmaker: 'armUp',
  dancer: 'armsOut', actor: 'armsOut',
  guitarist: 'hold', musician: 'hold', photographer: 'hold', anchor: 'hold', creator: 'hold',
  athlete: 'action', model: 'hip',
};

/**
 * A real 3D humanoid performer built from geometry (not a flat cutout): head,
 * torso, limbs as capsules with an accent-lit chest strip and eye glow. Lit by
 * the stage lights, grounded by a contact shadow, posed + animated per act.
 *
 * (For photorealistic characters, drop a rigged .glb in and swap this out — the
 * loader hook is documented in the README.)
 */
export default function Performer3D({ act }: { act: ActId }) {
  const group = useRef<THREE.Group>(null!);
  const rArm = useRef<THREE.Group>(null!);
  const lArm = useRef<THREE.Group>(null!);
  const accent = useMemo(() => new THREE.Color(ACT_MAP[act].accent), [act]);

  const bodyMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#0e1424', roughness: 0.5, metalness: 0.35 }),
    []
  );
  const trimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0e1424',
        roughness: 0.35,
        metalness: 0.4,
        emissive: accent,
        emissiveIntensity: 1.4,
      }),
    []
  );
  useEffect(() => {
    trimMat.emissive.copy(accent);
  }, [accent, trimMat]);

  const pose = POSE[act];

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.position.y = -1.0 + audio.beat * 0.14;
      group.current.rotation.y = Math.sin(t * 0.4) * 0.08 + audio.pointerX * 0.12;
    }
    const beat = audio.beat;
    if (rArm.current && lArm.current) {
      let rz = -0.35, lz = 0.35, rx = 0, lx = 0;
      if (pose === 'armUp') { rz = -2.5 - beat * 0.3; lz = 0.35; }
      else if (pose === 'armsOut') { rz = -1.5; lz = 1.5; rx = Math.sin(t * 3) * 0.25; lx = -Math.sin(t * 3) * 0.25; }
      else if (pose === 'hold') { rz = -0.55; lz = 0.55; rx = 1.0; lx = 1.0; }
      else if (pose === 'action') { rz = -1.9 - Math.sin(t * 6) * 0.4; lz = 0.7 + Math.sin(t * 6) * 0.4; }
      else if (pose === 'hip') { rz = -0.3; lz = 1.15; }
      const k = 0.12;
      rArm.current.rotation.z += (rz - rArm.current.rotation.z) * k;
      lArm.current.rotation.z += (lz - lArm.current.rotation.z) * k;
      rArm.current.rotation.x += (rx - rArm.current.rotation.x) * k;
      lArm.current.rotation.x += (lx - lArm.current.rotation.x) * k;
    }
  });

  return (
    <group ref={group} position={[0, -1.0, -6]}>
      {/* Legs */}
      <mesh position={[-0.26, -1.3, 0]} material={bodyMat}>
        <capsuleGeometry args={[0.22, 1.8, 6, 14]} />
      </mesh>
      <mesh position={[0.26, -1.3, 0]} material={bodyMat}>
        <capsuleGeometry args={[0.22, 1.8, 6, 14]} />
      </mesh>
      {/* Pelvis */}
      <mesh position={[0, -0.05, 0]} material={bodyMat}>
        <capsuleGeometry args={[0.34, 0.28, 6, 14]} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 0.85, 0]} material={bodyMat}>
        <capsuleGeometry args={[0.42, 1.1, 8, 18]} />
      </mesh>
      {/* Accent chest strip */}
      <mesh position={[0, 0.95, 0.37]} material={trimMat}>
        <boxGeometry args={[0.12, 0.95, 0.05]} />
      </mesh>
      {/* Neck + head */}
      <mesh position={[0, 1.62, 0]} material={bodyMat}>
        <cylinderGeometry args={[0.12, 0.15, 0.26, 12]} />
      </mesh>
      <mesh position={[0, 2.02, 0.02]} material={bodyMat}>
        <sphereGeometry args={[0.34, 28, 28]} />
      </mesh>
      {/* Eye-visor glow */}
      <mesh position={[0, 2.04, 0.3]} material={trimMat}>
        <boxGeometry args={[0.26, 0.06, 0.05]} />
      </mesh>

      {/* Arms — pivot at the shoulder */}
      <group ref={rArm} position={[-0.6, 1.42, 0]}>
        <mesh position={[0, -0.72, 0]} material={bodyMat}>
          <capsuleGeometry args={[0.15, 1.25, 6, 12]} />
        </mesh>
      </group>
      <group ref={lArm} position={[0.6, 1.42, 0]}>
        <mesh position={[0, -0.72, 0]} material={bodyMat}>
          <capsuleGeometry args={[0.15, 1.25, 6, 12]} />
        </mesh>
      </group>
    </group>
  );
}
