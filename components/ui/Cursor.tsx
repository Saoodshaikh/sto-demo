'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A bespoke two-part cursor: a precise dot and a lagging ring that expands
 * over interactive elements. Disabled automatically on touch devices.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    setEnabled(true);

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pos };
    let hovering = false;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }
      const el = e.target as HTMLElement;
      hovering = !!el.closest('a, button, [data-hover]');
    };

    let raf = 0;
    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      if (ring.current) {
        const s = hovering ? 1.9 : 1;
        ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) scale(${s})`;
        ring.current.style.opacity = hovering ? '1' : '0.6';
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('pointermove', onMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan"
        style={{ mixBlendMode: 'screen' }}
      />
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-9 w-9 rounded-full border border-electric/70"
        style={{ mixBlendMode: 'screen', transition: 'opacity 0.3s' }}
      />
    </>
  );
}
