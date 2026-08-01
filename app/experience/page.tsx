'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import { AudioEngine, ActId } from '@/experience/audio/AudioEngine';
import EnterGate from '@/experience/ui/EnterGate';
import HUD from '@/experience/ui/HUD';

const ExperienceRoot = dynamic(() => import('@/experience/ExperienceRoot'), {
  ssr: false,
});

const VALID: ActId[] = [
  'singer', 'guitarist', 'musician', 'dj', 'dancer', 'actor', 'model',
  'creator', 'influencer', 'athlete', 'anchor', 'photographer', 'filmmaker', 'performer',
];

function initialAct(): ActId {
  if (typeof window === 'undefined') return 'dj';
  const p = new URLSearchParams(window.location.search).get('act') as ActId;
  return VALID.includes(p) ? p : 'dj';
}

export default function ExperiencePage() {
  const engineRef = useRef<AudioEngine>();
  if (!engineRef.current) engineRef.current = new AudioEngine();
  const engine = engineRef.current;

  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  // Read the talent from ?act= synchronously so it opens on the right one.
  const [act, setAct] = useState<ActId>(initialAct);

  // Guarantee the audio is torn down when leaving the page — no leaked
  // AudioContext can keep playing "underneath" a new one.
  useEffect(() => {
    return () => engine.dispose();
  }, [engine]);

  const onEnter = async () => {
    try {
      await engine.start(act);
    } catch {
      /* audio may be blocked; visuals still run */
    }
    setStarted(true);
  };

  const onMute = () => {
    const next = !muted;
    setMuted(next);
    engine.setMuted(next);
  };

  const onSelect = (id: ActId) => {
    if (id === act) return;
    setAct(id);
    engine.setAct(id);
    // Keep the URL in sync without reloading.
    window.history.replaceState(null, '', `/experience?act=${id}`);
  };

  return (
    <main className="fixed inset-0 cursor-auto bg-black [&_a]:cursor-pointer [&_button]:cursor-pointer">
      <ExperienceRoot engine={engine} started={started} act={act} />

      {/* Gate lifetime is tied to `started` → it can never linger and block clicks */}
      <AnimatePresence>
        {!started && <EnterGate key="gate" onEnter={onEnter} />}
      </AnimatePresence>
      <HUD
        visible={started}
        muted={muted}
        act={act}
        onMute={onMute}
        onSelect={onSelect}
      />
    </main>
  );
}
