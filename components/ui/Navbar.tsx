'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MagneticButton from './MagneticButton';

const LINKS = [
  { label: 'Talent', href: '#talent' },
  { label: 'Intelligence', href: '#intelligence' },
  { label: 'Ecosystem', href: '#ecosystem' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'Investors', href: '#investors' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={`section-pad flex w-full max-w-7xl items-center justify-between rounded-full py-3 transition-all duration-500 ${
          scrolled ? 'glass' : ''
        }`}
        style={{ paddingLeft: '1.5rem', paddingRight: '0.75rem' }}
      >
        <a href="#top" data-hover className="flex items-center gap-2.5">
          <span className="relative flex h-6 w-6 items-center justify-center">
            <span className="absolute h-2 w-2 rounded-full bg-cyan shadow-[0_0_16px_3px_rgba(66,232,255,0.8)]" />
            <span className="absolute h-6 w-6 rounded-full border border-electric/50" />
          </span>
          <span className="font-display text-sm font-semibold tracking-[0.25em] text-white">
            STC
          </span>
        </a>

        <ul className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                data-hover
                className="group relative text-[13px] font-medium text-white/60 transition-colors hover:text-white"
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gradient-to-r from-electric to-violet transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="scale-90">
          <MagneticButton href="#cta">Request Access</MagneticButton>
        </div>
      </nav>
    </motion.header>
  );
}
