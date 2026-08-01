'use client';

import { useRef, ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface Props {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'ghost';
  className?: string;
}

/**
 * A magnetic button: the element (and its label, at a lower strength) drift
 * toward the cursor while hovered, then spring back on leave.
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = 'primary',
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    if (inner.current) {
      inner.current.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
    }
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'translate(0,0)';
    if (inner.current) inner.current.style.transform = 'translate(0,0)';
  };

  const base =
    'relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide will-change-transform';
  const styles =
    variant === 'primary'
      ? 'text-white shadow-[0_20px_60px_-20px_rgba(79,123,255,0.9)]'
      : 'text-white/80 border border-white/15 hover:border-white/35';

  const Tag: any = href ? 'a' : 'button';

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className="inline-block"
      style={{ transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)' }}
    >
      <Tag
        href={href}
        onClick={onClick}
        data-hover
        className={clsx(base, styles, className)}
      >
        {variant === 'primary' && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-gradient-to-r from-electric via-[#6a6bff] to-violet"
          />
        )}
        {variant === 'primary' && (
          <span
            aria-hidden
            className="absolute inset-[1px] rounded-full bg-gradient-to-b from-white/15 to-transparent"
          />
        )}
        <span
          ref={inner}
          className="relative z-10 inline-flex items-center gap-2"
          style={{ transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)' }}
        >
          {children}
        </span>
      </Tag>
    </motion.div>
  );
}
