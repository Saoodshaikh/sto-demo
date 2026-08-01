/**
 * A tiny module-level store shared between the DOM tree and the R3F render loop.
 * We deliberately avoid React state here: the WebGL scene reads these values
 * every frame via useFrame, so mutating a plain object is far cheaper than
 * triggering React re-renders 60x/second.
 */
export const scroll = {
  /** Normalized page scroll progress, 0 (top) → 1 (bottom). */
  progress: 0,
  /** Instantaneous scroll velocity, used for motion-reactive effects. */
  velocity: 0,
  /** Pointer in normalized device coords, -1..1 on each axis. */
  pointerX: 0,
  pointerY: 0,
};

/**
 * The narrative is divided into "scenes". Each scene owns a slice of the total
 * scroll range and maps to a target state of the particle system. The 3D scene
 * interpolates between these as the user scrolls.
 */
export const SCENES = [
  { id: 'hero', label: 'Genesis' },
  { id: 'problem', label: 'Undiscovered Talent' },
  { id: 'intelligence', label: 'Talent Discovered' },
  { id: 'network', label: 'Talent × Recruiters' },
  { id: 'ecosystem', label: 'Global Network' },
  { id: 'future', label: 'The Future' },
] as const;
