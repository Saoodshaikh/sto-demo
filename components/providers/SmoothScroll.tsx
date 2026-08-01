'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { scroll } from '@/lib/scroll-store';

/**
 * Drives Lenis momentum-based smooth scrolling and publishes global scroll
 * progress + velocity into the shared store consumed by the WebGL scene.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !prefersReduced,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    lenis.on('scroll', (e: { progress: number; velocity: number }) => {
      scroll.progress = e.progress;
      scroll.velocity = e.velocity;
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Pointer tracking (normalized -1..1) for parallax + magnetic effects.
    const onPointer = (e: PointerEvent) => {
      scroll.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      scroll.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onPointer);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
