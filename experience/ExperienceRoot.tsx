'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { AudioEngine, ActId } from './audio/AudioEngine';
import { audio } from './audio/reactive';
import StageScene from './scenes/StageScene';
import { STAGE } from './acts';

/** Eases fog + background color toward the active act's palette. */
function Atmosphere({ act }: { act: ActId }) {
  const { scene } = useThree();
  const target = useRef(new THREE.Color(STAGE[act].fog));
  useFrame(() => {
    target.current.set(STAGE[act].fog);
    if (scene.background instanceof THREE.Color) {
      scene.background.lerp(target.current, 0.05);
    }
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.lerp(target.current, 0.05);
    }
  });
  return null;
}

/** Publishes audio bands, waveform + elapsed time into the shared store. */
function AudioBridge({ engine }: { engine: AudioEngine }) {
  useFrame((_, delta) => {
    audio.time += delta;
    const r = engine.read();
    audio.bass = r.bass;
    audio.mid = r.mid;
    audio.treble = r.treble;
    audio.level = r.level;
    audio.beat = r.beat;
    engine.readWave(audio.wave);
  });
  return null;
}

/** Cinematic camera: slow push-in, beat-timed micro-shake, cursor sway. */
function CameraRig({ started }: { started: boolean }) {
  const { camera } = useThree();
  const [t0, setT0] = useState(0);

  useEffect(() => {
    if (started) setT0(audio.time);
  }, [started]);

  useFrame((_, delta) => {
    const elapsed = started ? audio.time - t0 : 0;
    // Push in from a wide establishing shot over ~7s.
    const push = THREE.MathUtils.smoothstep(elapsed, 0, 7);
    const baseZ = THREE.MathUtils.lerp(30, 15, push);
    const baseY = THREE.MathUtils.lerp(5.5, 2.2, push);

    const shake = audio.beat * 0.18;
    const swayX = audio.pointerX * 2.2;
    const swayY = -audio.pointerY * 1.2;

    const tx = swayX + (Math.random() - 0.5) * shake;
    const ty = baseY + swayY + (Math.random() - 0.5) * shake;

    const k = Math.min(delta * 2.2, 1);
    camera.position.x += (tx - camera.position.x) * k;
    camera.position.y += (ty - camera.position.y) * k;
    camera.position.z += (baseZ - camera.position.z) * k;
    camera.lookAt(0, 1.5, -6);
  });

  return null;
}

export default function ExperienceRoot({
  engine,
  started,
  act,
}: {
  engine: AudioEngine;
  started: boolean;
  act: ActId;
}) {
  const [mobile, setMobile] = useState(false);
  const [dpr, setDpr] = useState<[number, number]>([1, 1.7]);

  useEffect(() => {
    const m = window.matchMedia('(max-width: 820px)').matches;
    setMobile(m);
    if (m) setDpr([1, 1.3]);

    const onMove = (e: PointerEvent) => {
      audio.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      audio.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <Canvas
      dpr={dpr}
      gl={{
        antialias: false,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      camera={{ position: [0, 5.5, 30], fov: 50, near: 0.1, far: 200 }}
      style={{ position: 'fixed', inset: 0 }}
    >
      <color attach="background" args={['#03040a']} />
      <fog attach="fog" args={['#04060f', 22, 68]} />

      <Suspense fallback={null}>
        <AudioBridge engine={engine} />
        <Atmosphere act={act} />
        <CameraRig started={started} />
        <StageScene act={act} mobile={mobile} />

        {/* Clean grade — bloom + gentle vignette, NO film noise (reads premium). */}
        <EffectComposer multisampling={mobile ? 0 : 2}>
          <Bloom
            intensity={0.9}
            luminanceThreshold={0.25}
            luminanceSmoothing={0.9}
            mipmapBlur
            radius={0.7}
          />
          <Vignette offset={0.3} darkness={0.72} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
