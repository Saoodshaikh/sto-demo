'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Reveal from '@/components/ui/Reveal';
import { ROADMAP } from '@/lib/content';

export default function Roadmap() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.4'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="roadmap" className="relative py-32 section-pad">
      <Reveal>
        <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-electric/80">
          Roadmap
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="max-w-3xl font-display text-4xl font-light leading-[1.05] tracking-tightest text-white sm:text-6xl">
          From discovery to a{' '}
          <span className="text-gradient">global talent OS.</span>
        </h2>
      </Reveal>

      <div ref={ref} className="relative mt-20 pl-8 sm:pl-0">
        {/* Track */}
        <div className="absolute left-1.5 top-0 h-full w-px bg-white/10 sm:left-1/2 sm:-translate-x-1/2">
          <motion.div
            style={{ height: lineHeight }}
            className="w-full bg-gradient-to-b from-electric to-violet"
          />
        </div>

        <div className="flex flex-col gap-16">
          {ROADMAP.map((r, i) => (
            <div
              key={r.phase}
              className={`relative sm:w-1/2 ${
                i % 2 === 0 ? 'sm:pr-14' : 'sm:ml-auto sm:pl-14 sm:text-left'
              }`}
            >
              {/* Node */}
              <span
                className={`absolute top-1.5 h-3 w-3 rounded-full bg-cyan shadow-[0_0_14px_3px_rgba(66,232,255,0.6)] ${
                  i % 2 === 0
                    ? '-left-[1.65rem] sm:left-auto sm:-right-1.5'
                    : '-left-[1.65rem]'
                }`}
              />
              <Reveal>
                <div className="glass glass-hover rounded-2xl p-7">
                  <span className="font-display text-xs uppercase tracking-[0.3em] text-electric/80">
                    {r.phase}
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-light text-white">
                    {r.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/70">
                    {r.desc}
                  </p>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
