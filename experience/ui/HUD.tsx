'use client';

import { motion } from 'framer-motion';
import { ACTS, ACT_MAP } from '../acts';
import type { ActId } from '../audio/AudioEngine';

/**
 * Persistent overlay: wordmark, sound toggle, and the interactive TALENT
 * SELECTOR — click a talent and that performer takes the stage.
 */
export default function HUD({
  visible,
  muted,
  act,
  onMute,
  onSelect,
}: {
  visible: boolean;
  muted: boolean;
  act: ActId;
  onMute: () => void;
  onSelect: (id: ActId) => void;
}) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.3 }}
      className="pointer-events-none fixed inset-0 z-[70]"
    >
      {/* Wordmark + back to site */}
      <a
        href="/"
        aria-label="Back to Select Talent Co"
        className="pointer-events-auto absolute left-6 top-6 flex items-center gap-2.5"
      >
        <span className="relative flex h-6 w-6 items-center justify-center">
          <span className="absolute h-2 w-2 rounded-full bg-cyan" />
          <span className="absolute h-6 w-6 rounded-full border border-white/30" />
        </span>
        <span className="font-display text-xs font-semibold tracking-[0.25em] text-white/90">
          SELECT&nbsp;TALENT&nbsp;CO
        </span>
      </a>

      {/* Sound toggle */}
      <button
        onClick={onMute}
        className="pointer-events-auto absolute right-6 top-6 flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-white/70 transition-colors hover:border-white/40"
      >
        <span className={`h-1.5 w-1.5 rounded-full ${muted ? 'bg-white/30' : 'bg-cyan'}`} />
        {muted ? 'Sound off' : 'Sound on'}
      </button>

      {/* Talent selector — all talents, compact chips */}
      <div className="absolute inset-x-0 bottom-5 flex flex-col items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.4em] text-white/40">
          Choose your talent · {ACT_MAP[act].tagline}
        </span>
        <div className="pointer-events-auto mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2 px-4">
          {ACTS.map((a) => {
            const active = a.id === act;
            return (
              <button
                key={a.id}
                onClick={() => onSelect(a.id)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-300 ${
                  active
                    ? 'border-transparent bg-white text-ink'
                    : 'border-white/12 bg-white/[0.04] text-white/75 hover:border-white/35 hover:bg-white/[0.08]'
                }`}
                style={active ? { boxShadow: `0 10px 30px -10px ${a.accent}` } : undefined}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: a.accent }} />
                {a.label}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
