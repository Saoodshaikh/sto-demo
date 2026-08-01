'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Reveal from '@/components/ui/Reveal';
import { JOURNEYS } from '@/lib/content';

export default function Journeys() {
  const [active, setActive] = useState(0);
  const j = JOURNEYS[active];

  return (
    <section id="journeys" className="relative py-32 section-pad">
      <Reveal>
        <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-electric/80">
          One platform · Every side of talent
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="max-w-3xl font-display text-4xl font-light leading-[1.05] tracking-tightest text-white sm:text-6xl">
          Built for everyone the{' '}
          <span className="text-gradient">talent economy</span> runs on.
        </h2>
      </Reveal>

      <div className="mt-14 flex flex-wrap gap-2.5">
        {JOURNEYS.map((item, i) => (
          <button
            key={item.id}
            data-hover
            onClick={() => setActive(i)}
            className={`rounded-full border px-5 py-2.5 text-sm transition-all duration-300 ${
              i === active
                ? 'border-transparent bg-white text-ink'
                : 'border-white/12 text-white/60 hover:border-white/30 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="relative mt-10 min-h-[22rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={j.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="glass grid gap-10 rounded-[2rem] p-10 md:grid-cols-2 md:p-14"
          >
            <div>
              <h3 className="font-display text-3xl font-light leading-tight text-white sm:text-4xl">
                {j.headline}
              </h3>
              <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                <span className="text-sm text-white/70">{j.metric}</span>
              </div>
            </div>

            <ul className="flex flex-col justify-center gap-5">
              {j.points.map((p, i) => (
                <motion.li
                  key={p}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
                  className="flex items-start gap-4"
                >
                  <span className="mt-1.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gradient-to-br from-electric to-violet text-[11px] text-white">
                    {i + 1}
                  </span>
                  <span className="text-[17px] font-light leading-relaxed text-white/75">
                    {p}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
