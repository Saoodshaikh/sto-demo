'use client';

import { motion } from 'framer-motion';

/**
 * A calm, premium animated backdrop — slow-drifting aurora gradients over a
 * deep base. No particles, no grain: clean by construction, which is what
 * actually reads as high-end. Buttery 60fps via transform-only animation.
 */
export default function PremiumBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden bg-ink">
      {/* Base radial wash */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_-10%,#0b1234_0%,#05070f_55%,#04060d_100%)]" />

      {/* Drifting aurora orbs */}
      <motion.div
        className="absolute left-[6%] top-[6%] h-[48vw] w-[48vw] rounded-full blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgba(79,123,255,0.35), transparent 60%)' }}
        animate={{ x: [0, 70, -30, 0], y: [0, -45, 30, 0], scale: [1, 1.12, 0.96, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[4%] top-[16%] h-[42vw] w-[42vw] rounded-full blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.30), transparent 60%)' }}
        animate={{ x: [0, -55, 25, 0], y: [0, 35, -25, 0], scale: [1, 0.94, 1.12, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[2%] left-[32%] h-[38vw] w-[38vw] rounded-full blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgba(66,232,255,0.22), transparent 60%)' }}
        animate={{ x: [0, 45, -45, 0], y: [0, -25, 25, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Fine grid for depth (very subtle) */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(90% 70% at 50% 20%, black, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(90% 70% at 50% 20%, black, transparent 75%)',
        }}
      />

      {/* Bottom fade so content sits cleanly */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_120%,rgba(0,0,0,0.7),transparent)]" />
    </div>
  );
}
