'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

/**
 * A scroll-driven cinematic experience. No sections, no cards. Each "scene" is a
 * full-viewport, sticky stage whose entire environment (light, colour, motion)
 * changes as you scroll — the visitor is the audience, the scroll is the camera.
 *
 * Reliable + premium by construction: driven by typography, light and motion,
 * not fragile real-time 3D. Drop real cinematic footage into each scene's
 * `decor` later and this becomes Netflix-grade.
 */

type Scene = {
  id: string;
  kicker: string;
  title: string;
  sub?: string;
  bg: string;
  glow: string;
  accent: string;
};

const SCENES: Scene[] = [
  {
    id: 'invisible',
    kicker: 'Select Talent Co',
    title: 'Every legend\nwas once\ninvisible.',
    bg: 'radial-gradient(120% 100% at 50% 30%, #0a0d1a 0%, #000000 70%)',
    glow: 'rgba(120,150,255,0.10)',
    accent: '#8fa8ff',
  },
  {
    id: 'undiscovered',
    kicker: 'The truth',
    title: 'The world is full\nof undiscovered\ngreatness.',
    sub: 'Right now, somewhere, the next icon is waiting to be seen.',
    bg: 'radial-gradient(120% 100% at 30% 40%, #0a1636 0%, #02030a 70%)',
    glow: 'rgba(79,123,255,0.20)',
    accent: '#4f7bff',
  },
  {
    id: 'voice',
    kicker: 'The Voice',
    title: 'A voice that\nmoves millions.',
    sub: 'Singers. Musicians. The sound of a generation.',
    bg: 'radial-gradient(120% 100% at 70% 35%, #2a0a1f 0%, #05030a 70%)',
    glow: 'rgba(255,93,162,0.22)',
    accent: '#ff5da2',
  },
  {
    id: 'rhythm',
    kicker: 'The Rhythm',
    title: 'The drop that\nstops time.',
    sub: 'DJs. Producers. Architects of energy.',
    bg: 'radial-gradient(120% 100% at 30% 40%, #140a2e 0%, #04030c 70%)',
    glow: 'rgba(139,92,246,0.24)',
    accent: '#8b5cf6',
  },
  {
    id: 'motion',
    kicker: 'The Motion',
    title: 'Bodies that speak\nwithout words.',
    sub: 'Dancers. Athletes. Performers.',
    bg: 'radial-gradient(120% 100% at 65% 40%, #04252a 0%, #02080a 70%)',
    glow: 'rgba(66,232,255,0.20)',
    accent: '#42e8ff',
  },
  {
    id: 'frame',
    kicker: 'The Frame',
    title: 'Faces the camera\nnever forgets.',
    sub: 'Models. Actors. Creators. Filmmakers.',
    bg: 'radial-gradient(120% 100% at 40% 35%, #16181d 0%, #050506 70%)',
    glow: 'rgba(225,231,255,0.14)',
    accent: '#e5e7eb',
  },
  {
    id: 'intelligence',
    kicker: 'The Intelligence',
    title: 'AI that sees what\nthe world missed.',
    sub: 'STC reads talent at the scale of a nation — and connects it to the world.',
    bg: 'radial-gradient(120% 100% at 50% 30%, #061033 0%, #01030c 70%)',
    glow: 'rgba(79,123,255,0.22)',
    accent: '#6aa8ff',
  },
  {
    id: 'call',
    kicker: 'Your moment',
    title: 'Be discovered.',
    sub: 'Select Talent Co — the operating system for the global talent economy.',
    bg: 'radial-gradient(120% 100% at 50% 40%, #0a0d1a 0%, #000000 75%)',
    glow: 'rgba(140,168,255,0.16)',
    accent: '#a5b8ff',
  },
];

function SceneStage({ scene, index }: { scene: Scene; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.28, 0.72, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [80, 0, 0, -80]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.08]);
  const blur = useTransform(scrollYProgress, [0, 0.28, 0.72, 1], [10, 0, 0, 10]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  // Slow parallax drift of the light source.
  const glowY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  const last = index === SCENES.length - 1;
  const isOpening = index === 0;

  return (
    <section ref={ref} className="relative h-[150vh]">
      <div
        className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden"
        style={{ background: scene.bg }}
      >
        {/* Drifting cinematic light */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 h-[80vh] w-[80vh] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ background: `radial-gradient(circle, ${scene.glow}, transparent 60%)`, top: glowY }}
        />

        {/* Scene index — subtle film marker */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 font-display text-[11px] tracking-[0.4em] text-white/25">
          {String(index + 1).padStart(2, '0')} / {String(SCENES.length).padStart(2, '0')}
        </div>

        <motion.div
          style={{ opacity, y, scale, filter }}
          className="relative z-10 flex max-w-5xl flex-col items-center px-6 text-center"
        >
          <span
            className="mb-6 text-[11px] font-medium uppercase tracking-[0.45em]"
            style={{ color: scene.accent }}
          >
            {scene.kicker}
          </span>

          <h2
            className="whitespace-pre-line font-display font-light leading-[0.95] tracking-tight text-white"
            style={{
              fontSize: 'clamp(2.6rem, 8.5vw, 8.5rem)',
              textShadow: '0 4px 60px rgba(0,0,0,0.6)',
            }}
          >
            {scene.title}
          </h2>

          {scene.sub && (
            <p className="mt-8 max-w-xl text-base font-light leading-relaxed text-white/60 sm:text-lg">
              {scene.sub}
            </p>
          )}

          {last && <CallToAction accent={scene.accent} />}
        </motion.div>

        {isOpening && <ScrollCue />}
      </div>
    </section>
  );
}

function ScrollCue() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 1 }}
      className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
    >
      <span className="text-[10px] uppercase tracking-[0.4em] text-white/40">
        Scroll to begin
      </span>
      <div className="h-12 w-px overflow-hidden bg-white/15">
        <motion.div
          className="h-5 w-full bg-gradient-to-b from-white/80 to-transparent"
          animate={{ y: [-20, 48] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}

function CallToAction({ accent }: { accent: string }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  return (
    <div className="mt-12 w-full max-w-md">
      {sent ? (
        <p className="text-white/80">You’re on the list. We’ll be in touch.</p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email.includes('@')) setSent(true);
          }}
          className="flex flex-col items-center gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full flex-1 rounded-full border border-white/15 bg-white/[0.05] px-6 py-3.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-white/50"
          />
          <button
            type="submit"
            className="rounded-full px-7 py-3.5 text-sm font-medium text-black transition-transform hover:scale-[1.03]"
            style={{ background: accent }}
          >
            Request Access
          </button>
        </form>
      )}
    </div>
  );
}

/** Fixed film-grade progress bar across the top. */
function ProgressBar({ progress }: { progress: MotionValue<number> }) {
  const scaleX = useTransform(progress, [0, 1], [0, 1]);
  return (
    <motion.div
      className="fixed left-0 top-0 z-50 h-[2px] w-full origin-left bg-gradient-to-r from-electric via-cyan to-violet"
      style={{ scaleX }}
    />
  );
}

export default function CinematicExperience() {
  const { scrollYProgress } = useScroll();
  return (
    <div className="relative bg-black">
      <ProgressBar progress={scrollYProgress} />

      {/* Fixed minimalist mark */}
      <div className="fixed left-8 top-7 z-50 flex items-center gap-2.5">
        <span className="h-2 w-2 rounded-full bg-white" />
        <span className="font-display text-xs font-semibold tracking-[0.3em] text-white/90">
          STC
        </span>
      </div>

      {/* Cinematic letterbox vignette */}
      <div className="pointer-events-none fixed inset-0 z-40 shadow-[inset_0_0_200px_60px_rgba(0,0,0,0.75)]" />

      {SCENES.map((s, i) => (
        <SceneStage key={s.id} scene={s} index={i} />
      ))}
    </div>
  );
}
