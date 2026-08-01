'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Reveal from '@/components/ui/Reveal';
import { TALENT_TYPES } from '@/lib/content';

const EASE = [0.22, 1, 0.36, 1] as const;

// Every talent has a live performance on The Stage → deep-link to that act.
const PERFORMABLE: Record<string, string> = {
  Singers: 'singer',
  Musicians: 'musician',
  Guitarists: 'guitarist',
  DJs: 'dj',
  Dancers: 'dancer',
  Actors: 'actor',
  Models: 'model',
  'Content Creators': 'creator',
  Influencers: 'influencer',
  Athletes: 'athlete',
  Anchors: 'anchor',
  Photographers: 'photographer',
  Filmmakers: 'filmmaker',
  Performers: 'performer',
};

/** Accent-tinted equalizer that animates to imply live energy per talent. */
function Equalizer({ accent }: { accent: string }) {
  return (
    <div className="flex h-24 items-end gap-1.5">
      {Array.from({ length: 32 }).map((_, i) => (
        <motion.span
          key={i}
          className="w-1.5 flex-1 rounded-full"
          style={{ background: accent, boxShadow: `0 0 12px ${accent}` }}
          animate={{ height: ['12%', `${30 + ((i * 37) % 70)}%`, '18%'] }}
          transition={{
            duration: 0.9 + (i % 6) * 0.12,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
            delay: (i % 8) * 0.06,
          }}
        />
      ))}
    </div>
  );
}

export default function TalentVerticals() {
  const [active, setActive] = useState(0);
  const t = TALENT_TYPES[active];

  return (
    <section id="talent" className="relative py-32 section-pad">
      <Reveal>
        <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-electric/80">
          Every kind of talent
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="max-w-3xl font-display text-4xl font-light leading-[1.05] tracking-tightest text-white sm:text-6xl">
          One platform for{' '}
          <span className="text-gradient">every artist.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="mt-6 max-w-xl text-lg font-light text-white/70">
          STC discovers, manages and grows talent across the entire creative
          economy — each surfaced by the signal only AI can read at scale.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Feature display */}
        <div className="glass relative overflow-hidden rounded-[2rem] p-10 sm:p-12">
          <motion.div
            key={`glow-${active}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
            style={{ background: t.accent }}
          />
          {/* Keyed remount: changing `active` re-mounts this block and plays a
              fresh enter animation — robust, with no exit state to deadlock. */}
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative"
          >
            <div className="mb-6 flex items-center gap-3 font-display text-xs tabular-nums text-white/40">
                <span style={{ color: t.accent }}>
                  {String(active + 1).padStart(2, '0')}
                </span>
                <span className="h-px w-8 bg-white/20" />
                <span>{String(TALENT_TYPES.length).padStart(2, '0')}</span>
              </div>

              <h3 className="font-display text-5xl font-light leading-none tracking-tightest text-white sm:text-7xl">
                {t.name}
              </h3>
              <p
                className="mt-4 text-lg font-medium"
                style={{ color: t.accent }}
              >
                {t.tagline}
              </p>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/60">
                {t.desc}
              </p>

              {PERFORMABLE[t.name] ? (
                <a
                  href={`/experience?act=${PERFORMABLE[t.name]}`}
                  data-hover
                  className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3 text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
                >
                  <span className="text-[11px]">▶</span> Watch live performance
                </a>
              ) : (
                <span className="mt-7 inline-flex items-center rounded-full border border-white/12 px-5 py-2.5 text-xs text-white/45">
                  Live performance coming soon
                </span>
              )}

              <div className="mt-10">
                <Equalizer accent={t.accent} />
              </div>
            </motion.div>
        </div>

        {/* Selectable list of all talent types */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2">
          {TALENT_TYPES.map((item, i) => {
            const on = i === active;
            return (
              <button
                key={item.name}
                data-hover
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${
                  on
                    ? 'border-transparent bg-white/[0.09]'
                    : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                }`}
                style={on ? { boxShadow: `inset 0 0 0 1px ${item.accent}55` } : undefined}
              >
                {PERFORMABLE[item.name] && (
                  <span className="absolute right-3 top-3 flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-white/70">
                    <span
                      className="h-1.5 w-1.5 animate-pulse rounded-full"
                      style={{ background: item.accent }}
                    />
                    Live
                  </span>
                )}
                <span
                  className="mb-3 block h-1.5 w-1.5 rounded-full transition-transform duration-300 group-hover:scale-150"
                  style={{
                    background: item.accent,
                    boxShadow: on ? `0 0 12px ${item.accent}` : 'none',
                  }}
                />
                <span
                  className={`block text-sm font-medium transition-colors ${
                    on ? 'text-white' : 'text-white/70'
                  }`}
                >
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
