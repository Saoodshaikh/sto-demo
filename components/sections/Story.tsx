'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { STORY } from '@/lib/content';

/**
 * One full-height narrative beat. Its text rises, holds at center, then
 * dissolves — so scrolling feels like a title sequence over the living
 * particle field, which is simultaneously morphing formation behind it.
 */
function StoryPanel({
  index,
  kicker,
  title,
  body,
  align,
}: {
  index: number;
  kicker: string;
  title: string;
  body: string;
  align: 'left' | 'right';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Fade + drift in, then hold legible across a wide plateau before easing out.
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.82, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.82, 1], [60, 0, 0, -60]);
  const blur = useTransform(scrollYProgress, [0, 0.2, 0.82, 1], [5, 0, 0, 5]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <div
      ref={ref}
      className="flex min-h-[100svh] items-center section-pad"
      style={{ justifyContent: align === 'left' ? 'flex-start' : 'flex-end' }}
    >
      <motion.div
        style={{ opacity, y, filter }}
        className={`scrim max-w-xl ${align === 'right' ? 'text-right' : 'text-left'}`}
      >
        <div
          className={`mb-5 flex items-center gap-3 ${
            align === 'right' ? 'justify-end' : ''
          }`}
        >
          <span className="font-display text-xs tabular-nums text-electric/80">
            0{index + 1}
          </span>
          <span className="h-px w-10 bg-white/20" />
          <span className="text-[11px] uppercase tracking-[0.32em] text-white/70">
            {kicker}
          </span>
        </div>
        <h2 className="whitespace-pre-line font-display text-4xl font-light leading-[1.02] tracking-tightest text-white sm:text-6xl">
          {title}
        </h2>
        <p className="mt-6 text-base font-light leading-relaxed text-white/75 sm:text-lg">
          {body}
        </p>
      </motion.div>
    </div>
  );
}

export default function Story() {
  return (
    <section id="vision" className="relative">
      {STORY.map((s, i) => (
        <StoryPanel
          key={i}
          index={i}
          kicker={s.kicker}
          title={s.title}
          body={s.body}
          align={i % 2 === 0 ? 'left' : 'right'}
        />
      ))}
    </section>
  );
}
