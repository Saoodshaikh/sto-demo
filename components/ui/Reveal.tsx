'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Scroll-triggered reveal with physical easing. Nothing pops in — everything
 * rises with momentum. `delay` staggers grouped children.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 34,
  className,
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'span' | 'li';
}) {
  const MotionTag = motion[as] as any;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}
