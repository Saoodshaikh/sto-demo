'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Reveal from '@/components/ui/Reveal';
import MagneticButton from '@/components/ui/MagneticButton';

export default function CTA() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    // Front-end only: wire this to your CRM / waitlist endpoint.
    setSent(true);
  };

  return (
    <section id="cta" className="relative py-40 section-pad text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 aurora" />

      <Reveal>
        <p className="mb-6 text-[11px] uppercase tracking-[0.32em] text-electric/80">
          The future of talent starts now
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="mx-auto max-w-4xl font-display text-5xl font-extralight leading-[0.98] tracking-tightest text-white sm:text-8xl">
          Be among the
          <br />
          <span className="text-gradient">first discovered.</span>
        </h2>
      </Reveal>

      <Reveal delay={0.12}>
        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto mt-12 max-w-md glass rounded-2xl px-8 py-7"
          >
            <p className="font-display text-xl text-white">You’re on the list.</p>
            <p className="mt-2 text-sm text-white/70">
              We’ll reach out as early access opens.
            </p>
          </motion.div>
        ) : (
          <form
            onSubmit={submit}
            className="mx-auto mt-12 flex max-w-md flex-col items-center gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              data-hover
              className="w-full flex-1 rounded-full border border-white/12 bg-white/[0.04] px-6 py-3.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-electric/60"
            />
            {/* Rendered as a <button> inside the form → triggers submit. */}
            <MagneticButton>Request Access</MagneticButton>
          </form>
        )}
      </Reveal>
    </section>
  );
}
