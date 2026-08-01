'use client';

import Reveal from '@/components/ui/Reveal';
import MagneticButton from '@/components/ui/MagneticButton';

const INVEST = [
  { k: 'Market', v: 'The global talent economy — measured in trillions.' },
  { k: 'Wedge', v: 'India first: the world’s largest pool of undiscovered talent.' },
  { k: 'Moat', v: 'A proprietary talent graph that compounds with every profile.' },
  { k: 'Model', v: 'Discovery, SaaS, commerce take-rate and payments.' },
];

export default function Vision() {
  return (
    <section id="investors" className="relative py-32 section-pad">
      {/* Founder's vision */}
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <p className="mb-8 text-[11px] uppercase tracking-[0.32em] text-electric/80">
            Founder’s Vision
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <blockquote className="font-display text-3xl font-light leading-[1.15] tracking-tightest text-white sm:text-5xl">
            “Talent is the most{' '}
            <span className="text-gradient">unequally discovered</span> resource
            on earth. We are building the intelligence that finds it —
            everywhere, for everyone.”
          </blockquote>
        </Reveal>
        <Reveal delay={0.14}>
          <div className="mt-10 flex items-center justify-center gap-3">
            <span className="h-9 w-9 rounded-full bg-gradient-to-br from-electric to-violet" />
            <div className="text-left">
              <p className="text-sm font-medium text-white">Select Talent Co</p>
              <p className="text-xs text-white/62">Founding Team</p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Investor opportunity */}
      <div className="mt-28">
        <div className="glass overflow-hidden rounded-[2.5rem] p-10 sm:p-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Reveal>
                <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-electric/80">
                  Investor Opportunity
                </p>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="font-display text-4xl font-light leading-[1.05] tracking-tightest text-white sm:text-5xl">
                  Back the infrastructure layer of{' '}
                  <span className="text-gradient">future talent.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-6 max-w-md text-lg font-light text-white/70">
                  Category-defining companies are built at the intersection of a
                  massive market and a hard technical moat. STC sits precisely
                  there.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <div className="mt-9">
                  <MagneticButton href="#cta">Request the deck</MagneticButton>
                </div>
              </Reveal>
            </div>

            <div className="grid gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/5 sm:grid-cols-2">
              {INVEST.map((item, i) => (
                <Reveal key={item.k} delay={i * 0.08}>
                  <div className="h-full bg-ink/50 p-7">
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan/80">
                      {item.k}
                    </p>
                    <p className="mt-3 text-[15px] leading-relaxed text-white/70">
                      {item.v}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
