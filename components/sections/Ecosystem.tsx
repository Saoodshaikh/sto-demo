'use client';

import Reveal from '@/components/ui/Reveal';
import { STATS } from '@/lib/content';

const NODES = [
  'Brands',
  'Recruiters',
  'Agencies',
  'Production Houses',
  'Entertainment',
  'Hospitality',
  'Sports',
  'Fashion',
  'Creators',
];

export default function Ecosystem() {
  return (
    <section id="ecosystem" className="relative py-32 section-pad">
      <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
        <div>
          <Reveal>
            <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-electric/80">
              Global Opportunity Network
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display text-4xl font-light leading-[1.05] tracking-tightest text-white sm:text-6xl">
              One network.{' '}
              <span className="text-gradient">Every opportunity.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-lg text-lg font-light text-white/70">
              STC connects talent to brands, recruiters, agencies, production
              houses, entertainment, hospitality, sports and fashion — a single
              intelligent graph where every connection is an opportunity.
            </p>
          </Reveal>

          <div className="mt-10 flex flex-wrap gap-2.5">
            {NODES.map((n, i) => (
              <Reveal key={n} delay={0.1 + i * 0.04} as="span">
                <span className="inline-block rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 text-sm text-white/65">
                  {n}
                </span>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Orbiting node diagram */}
        <Reveal delay={0.15}>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 rounded-full border border-white/5" />
            <div className="absolute inset-[12%] rounded-full border border-white/5" />
            <div className="absolute inset-[26%] rounded-full border border-white/5" />
            <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-electric to-violet blur-2xl opacity-60 animate-float" />
            <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-ink/60 font-display text-sm tracking-widest text-white backdrop-blur">
              STC
            </div>
            {NODES.slice(0, 8).map((n, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const r = 42;
              const x = 50 + Math.cos(angle) * r;
              const y = 50 + Math.sin(angle) * r;
              return (
                <div
                  key={n}
                  className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan shadow-[0_0_14px_3px_rgba(66,232,255,0.6)]"
                  style={{ left: `${x}%`, top: `${y}%` }}
                />
              );
            })}
          </div>
        </Reveal>
      </div>

      {/* Stats */}
      <div className="mt-28 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/8 bg-white/5 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div className="h-full bg-ink/60 p-8 backdrop-blur">
              <div className="font-display text-4xl font-light text-gradient sm:text-5xl">
                {s.value}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                {s.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
