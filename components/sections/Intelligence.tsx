'use client';

import Reveal from '@/components/ui/Reveal';
import { INTELLIGENCE } from '@/lib/content';

export default function Intelligence() {
  return (
    <section id="intelligence" className="relative py-32 section-pad">
      <Reveal>
        <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-electric/80">
          AI Intelligence
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="max-w-3xl font-display text-4xl font-light leading-[1.05] tracking-tightest text-white sm:text-6xl">
          The intelligence that reads{' '}
          <span className="text-gradient">talent like a human</span> — at the
          scale of a nation.
        </h2>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="mt-6 max-w-xl text-lg font-light text-white/70">
          Four systems working as one — turning raw human potential into
          discoverable, verifiable, bookable signal.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-5 md:grid-cols-2">
        {INTELLIGENCE.map((item, i) => (
          <Reveal key={item.title} delay={0.1 + i * 0.08}>
            <article className="glass glass-hover group relative h-full overflow-hidden rounded-3xl p-8">
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-electric/20 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-40" />
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 font-display text-sm text-cyan">
                0{i + 1}
              </div>
              <h3 className="font-display text-2xl font-light text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/70">
                {item.desc}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
