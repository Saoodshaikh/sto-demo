'use client';

import { STATS, INTELLIGENCE, JOURNEYS, ROADMAP } from '@/lib/content';

/**
 * The substantive STC story, in a premium luxury language: warm near-black
 * (never pure #000), champagne-gold accent, glassmorphism, generous spacing and
 * slow expo-eased motion — the design-intelligence recommendation for a
 * high-end, cinematic AI brand.
 */

const GOLD = '#e6c980';

/**
 * Always-visible wrapper. We deliberately do NOT gate opacity on scroll/motion
 * (that left content stuck invisible). Content renders at full opacity; a pure
 * CSS keyframe adds a gentle rise that still ENDS visible even if it never runs.
 */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{ animation: `rise 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s both` }}
    >
      {children}
    </div>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[11px] font-medium uppercase tracking-[0.4em]"
      style={{ color: GOLD }}
    >
      {children}
    </span>
  );
}

const PILLARS = [
  {
    n: '01',
    title: 'Discover',
    body: 'AI surfaces the right talent for any brief — ranked by fit, verified by data, in under a minute.',
  },
  {
    n: '02',
    title: 'Manage',
    body: 'One home for profiles, credits, bookings, rights and reputation. Scattered work becomes a managed career.',
  },
  {
    n: '03',
    title: 'Monetize',
    body: 'Contracts, escrow and payouts built in. Talent gets discovered — and paid — without leaving the platform.',
  },
];

export default function PremiumContent() {
  return (
    <div className="relative bg-[#0a0806] text-white">
      {/* warm ambient light */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[60vh]"
        style={{
          background:
            'radial-gradient(60% 100% at 50% 0%, rgba(230,201,128,0.10), transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
        {/* ── The platform ── */}
        <section className="py-32">
          <Reveal>
            <Kicker>The platform</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 max-w-3xl font-display text-4xl font-light leading-[1.08] tracking-tight sm:text-6xl">
              One intelligent layer beneath the entire{' '}
              <span style={{ color: GOLD }}>talent economy.</span>
            </h2>
          </Reveal>

          <div className="mt-20 grid gap-px overflow-hidden rounded-3xl border border-white/10 sm:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.1}>
                <div className="h-full bg-white/[0.02] p-9 backdrop-blur-sm transition-colors duration-500 hover:bg-white/[0.045]">
                  <span className="font-display text-sm" style={{ color: GOLD }}>
                    {p.n}
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-light">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/55">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* ── The numbers ── */}
        <section className="py-32">
          <Reveal>
            <Kicker>The opportunity</Kicker>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 gap-y-14 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <div>
                  <div
                    className="font-display text-5xl font-light sm:text-6xl"
                    style={{ color: GOLD }}
                  >
                    {s.value}
                  </div>
                  <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-white/50">
                    {s.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* ── The intelligence ── */}
        <section className="py-32">
          <Reveal>
            <Kicker>The intelligence</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 max-w-3xl font-display text-4xl font-light leading-[1.08] tracking-tight sm:text-5xl">
              AI that reads talent like a human — at the scale of a nation.
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-5 md:grid-cols-2">
            {INTELLIGENCE.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-colors duration-500 hover:border-white/20">
                  <div
                    className="mb-6 h-9 w-9 rounded-xl border"
                    style={{ borderColor: 'rgba(230,201,128,0.4)', background: 'rgba(230,201,128,0.08)' }}
                  />
                  <h3 className="font-display text-xl font-light">{item.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/55">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* ── Built for everyone ── */}
        <section className="py-32">
          <Reveal>
            <Kicker>Built for everyone talent touches</Kicker>
          </Reveal>
          <div className="mt-14 space-y-px overflow-hidden rounded-3xl border border-white/10">
            {JOURNEYS.map((j, i) => (
              <Reveal key={j.id} delay={i * 0.06}>
                <div className="grid items-center gap-6 bg-white/[0.02] p-8 transition-colors duration-500 hover:bg-white/[0.045] sm:grid-cols-[0.5fr_1fr_0.8fr] sm:p-10">
                  <span className="font-display text-2xl font-light text-white">
                    {j.label}
                  </span>
                  <p className="text-[15px] leading-relaxed text-white/60">
                    {j.headline}
                  </p>
                  <span
                    className="justify-self-start rounded-full border px-4 py-2 text-xs sm:justify-self-end"
                    style={{ borderColor: 'rgba(230,201,128,0.35)', color: GOLD }}
                  >
                    {j.metric}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* ── Roadmap ── */}
        <section className="py-32">
          <Reveal>
            <Kicker>The roadmap</Kicker>
          </Reveal>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {ROADMAP.map((r, i) => (
              <Reveal key={r.phase} delay={i * 0.1}>
                <div className="relative">
                  <div className="mb-5 h-px w-full" style={{ background: 'rgba(230,201,128,0.4)' }} />
                  <span className="font-display text-xs uppercase tracking-[0.3em]" style={{ color: GOLD }}>
                    {r.phase}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-light">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">{r.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* ── Founder vision ── */}
        <section className="py-36 text-center">
          <Reveal>
            <Kicker>Founder’s vision</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <blockquote className="mx-auto mt-10 max-w-4xl font-display text-3xl font-light leading-[1.2] tracking-tight sm:text-5xl">
              “Talent is the most{' '}
              <span style={{ color: GOLD }}>unequally discovered</span> resource
              on earth. We are building the intelligence that finds it —
              everywhere, for everyone.”
            </blockquote>
          </Reveal>
        </section>
      </div>

      <FinalCTA />
    </div>
  );
}

function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 py-40 text-center">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 80% at 50% 50%, rgba(230,201,128,0.10), transparent 70%)',
        }}
      />
      <div className="relative mx-auto max-w-3xl px-6">
        <Reveal>
          <Kicker>Your moment</Kicker>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mx-auto mt-8 max-w-2xl font-display text-5xl font-extralight leading-[1.02] tracking-tight sm:text-7xl">
            Be among the first
            <br />
            <span style={{ color: GOLD }}>discovered.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mx-auto mt-12 flex max-w-md flex-col items-center gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="you@company.com"
              className="w-full flex-1 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-white/40"
            />
            <button
              className="rounded-full px-7 py-3.5 text-sm font-medium text-black transition-transform hover:scale-[1.03]"
              style={{ background: GOLD }}
            >
              Request Access
            </button>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-16 text-xs tracking-[0.2em] text-white/30">
            SELECT TALENT CO — THE OPERATING SYSTEM FOR THE GLOBAL TALENT ECONOMY
          </p>
        </Reveal>
      </div>
    </section>
  );
}
