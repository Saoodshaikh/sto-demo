'use client';

import { motion } from 'framer-motion';
import MagneticButton from '@/components/ui/MagneticButton';

const EASE = [0.22, 1, 0.36, 1] as const;

const line = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: EASE, delay: 0.5 + i * 0.12 },
  }),
};

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden text-center section-pad"
    >
      {/* Aurora glow behind the headline */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 aurora" />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.35 }}
        className="glass mb-8 flex items-center gap-2.5 rounded-full px-4 py-2"
      >
        <span className="h-1.5 w-1.5 animate-float rounded-full bg-cyan" />
        <span className="text-[11px] uppercase tracking-[0.32em] text-white/70">
          India’s AI Talent Operating System
        </span>
      </motion.div>

      <h1 className="relative font-display text-[13vw] font-extralight leading-[0.92] tracking-tightest sm:text-[10vw] md:text-[8.4rem]">
        <motion.span custom={0} variants={line} initial="hidden" animate="show" className="block text-white">
          Discover the
        </motion.span>
        <motion.span custom={1} variants={line} initial="hidden" animate="show" className="block text-gradient">
          undiscovered.
        </motion.span>
      </h1>

      <motion.p
        custom={2}
        variants={line}
        initial="hidden"
        animate="show"
        className="mt-8 max-w-xl text-base font-light leading-relaxed text-white/75 sm:text-lg"
      >
        Select Talent Co is the AI platform connecting extraordinary people with
        the brands, recruiters and opportunities searching for them — the
        operating system for the global talent economy.
      </motion.p>

      <motion.div
        custom={3}
        variants={line}
        initial="hidden"
        animate="show"
        className="mt-11 flex flex-col items-center gap-4 sm:flex-row"
      >
        <MagneticButton href="#cta">Request Early Access</MagneticButton>
        <MagneticButton href="#talent" variant="ghost">
          Explore talent
        </MagneticButton>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.35em] text-white/60">Scroll</span>
        <div className="h-10 w-px overflow-hidden bg-white/15">
          <motion.div
            className="h-4 w-full bg-gradient-to-b from-cyan to-transparent"
            animate={{ y: [-16, 40] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
