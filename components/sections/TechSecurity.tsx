'use client';

import Reveal from '@/components/ui/Reveal';
import { TECH, SECURITY } from '@/lib/content';

export default function TechSecurity() {
  return (
    <section id="technology" className="relative py-32 section-pad">
      {/* Technology stack */}
      <Reveal>
        <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-electric/80">
          Technology
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="max-w-3xl font-display text-4xl font-light leading-[1.05] tracking-tightest text-white sm:text-6xl">
          An infrastructure layer,{' '}
          <span className="text-gradient">not an app.</span>
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/8 bg-white/5 sm:grid-cols-2 lg:grid-cols-3">
        {TECH.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.06}>
            <div className="group h-full bg-ink/60 p-8 backdrop-blur transition-colors duration-500 hover:bg-white/[0.04]">
              <div className="mb-5 h-8 w-8 rounded-lg bg-gradient-to-br from-electric/80 to-violet/80 opacity-80 transition-transform duration-500 group-hover:scale-110" />
              <h3 className="font-display text-lg text-white">{t.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                {t.detail}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Security */}
      <div id="security" className="mt-32 grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <Reveal>
            <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-electric/80">
              Security & Trust
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display text-4xl font-light leading-[1.05] tracking-tightest text-white sm:text-5xl">
              Talent is personal.
              <br />
              We treat it that way.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-md text-lg font-light text-white/70">
              Trust is the product. Every identity is verified, every right is
              enforced, and every person owns their data.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {SECURITY.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <div className="glass glass-hover h-full rounded-2xl p-7">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-cyan/30 bg-cyan/10">
                  <span className="h-2 w-2 rounded-full bg-cyan shadow-[0_0_10px_2px_rgba(66,232,255,0.7)]" />
                </div>
                <h3 className="font-display text-lg text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
