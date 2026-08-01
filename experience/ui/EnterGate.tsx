'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * The Void → Enter gate. Black, near-silent, drifting dust. The click is the
 * user gesture that unlocks Web Audio and begins the performance.
 *
 * The gate's LIFETIME is controlled by the parent (`{!started && <EnterGate/>}`)
 * so it can never linger on top and steal clicks. The moment it's clicked it
 * also drops `pointer-events`, so nothing is blocked while audio spins up.
 */
export default function EnterGate({ onEnter }: { onEnter: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);

  const enter = async () => {
    if (busy) return;
    setBusy(true);
    await onEnter(); // parent unmounts this gate when `started` flips true
  };

  return (
    <motion.div
      className={`fixed inset-0 z-[80] flex flex-col items-center justify-center overflow-hidden bg-black ${
        busy ? 'pointer-events-none' : ''
      }`}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(12px)' }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Drifting dust */}
      {Array.from({ length: 26 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-[2px] w-[2px] rounded-full bg-white/40"
          initial={{
            x: `${((i * 37) % 100) - 50}vw`,
            y: `${((i * 53) % 100) - 50}vh`,
            opacity: 0,
          }}
          animate={{ opacity: [0, 0.6, 0], y: `+=${20 + (i % 5) * 6}` }}
          transition={{ duration: 6 + (i % 5), repeat: Infinity, delay: i * 0.2 }}
        />
      ))}

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 0.3 }}
        className="mb-6 text-[11px] uppercase tracking-[0.5em] text-white/40"
      >
        Select Talent Co presents
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, filter: 'blur(14px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center font-display text-4xl font-extralight leading-tight tracking-tight text-white sm:text-6xl"
      >
        THE STAGE
      </motion.h1>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.1 }}
        onClick={enter}
        className="group relative mt-12 flex items-center gap-3 rounded-full border border-white/20 px-8 py-4 text-sm tracking-wide text-white transition-colors hover:border-white/60"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-70" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan" />
        </span>
        {busy ? 'Entering…' : 'Enter the Stage'}
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="mt-6 text-[11px] uppercase tracking-[0.3em] text-white/25"
      >
        Best with sound on · headphones recommended
      </motion.p>
    </motion.div>
  );
}
