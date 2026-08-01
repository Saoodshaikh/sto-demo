'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Cinematic boot sequence. Emerges from pure black, counts to 100 while the
 * WebGL scene warms up, then lifts like a curtain to reveal the particle void.
 */
export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let val = 0;
    const tick = () => {
      // Ease toward 100 with organic, decelerating steps.
      val += Math.max(0.5, (100 - val) * 0.04);
      if (val >= 100) {
        val = 100;
        setProgress(100);
        setTimeout(() => setDone(true), 550);
        return;
      }
      setProgress(val);
      requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink"
          exit={{ opacity: 0, filter: 'blur(12px)' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="h-2.5 w-2.5 animate-float rounded-full bg-cyan shadow-[0_0_20px_4px_rgba(66,232,255,0.7)]" />
              <span className="font-display text-sm uppercase tracking-[0.5em] text-white/70">
                Select&nbsp;Talent&nbsp;Co
              </span>
            </div>

            <div className="font-display text-7xl font-light tabular-nums text-gradient sm:text-8xl">
              {Math.floor(progress)}
            </div>

            <div className="mt-8 h-px w-56 overflow-hidden bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-electric to-violet"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-5 text-xs uppercase tracking-[0.35em] text-white/60">
              Initializing intelligence
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
