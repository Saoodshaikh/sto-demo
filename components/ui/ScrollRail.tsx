'use client';

import { useEffect, useState } from 'react';
import { scroll, SCENES } from '@/lib/scroll-store';

/** A minimalist vertical rail marking narrative scenes and live progress. */
export default function ScrollRail() {
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    let last = -1;
    const loop = () => {
      // Throttle React updates: only re-render on meaningful change.
      if (Math.abs(scroll.progress - last) > 0.004) {
        last = scroll.progress;
        setP(scroll.progress);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const active = Math.min(
    SCENES.length - 1,
    Math.floor(p * SCENES.length + 0.0001)
  );

  return (
    <div className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 lg:flex">
      {SCENES.map((s, i) => (
        <div key={s.id} className="group flex items-center gap-3">
          <span
            className={`text-[10px] uppercase tracking-[0.25em] transition-all duration-500 ${
              i === active ? 'text-white/80' : 'text-white/0 group-hover:text-white/62'
            }`}
          >
            {s.label}
          </span>
          <span className="relative flex h-2 w-2 items-center justify-center">
            <span
              className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
                i === active
                  ? 'scale-150 bg-cyan shadow-[0_0_12px_2px_rgba(66,232,255,0.8)]'
                  : 'bg-white/25'
              }`}
            />
          </span>
        </div>
      ))}
    </div>
  );
}
