/**
 * Procedural generators for the five particle formations the hero morphs
 * between. Each returns a flat Float32Array of xyz triplets of length count*3,
 * all sharing the same particle ordering so the GPU can blend index-for-index.
 */

type Vec = [number, number, number];

function write(arr: Float32Array, i: number, v: Vec) {
  arr[i * 3] = v[0];
  arr[i * 3 + 1] = v[1];
  arr[i * 3 + 2] = v[2];
}

// Deterministic pseudo-random so SSR and client agree and formations are stable.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A flat-ish spiral galaxy disc — the opening "genesis" state. */
export function galaxy(count: number): Float32Array {
  const rng = mulberry32(1);
  const out = new Float32Array(count * 3);
  const arms = 4;
  for (let i = 0; i < count; i++) {
    const t = rng();
    const radius = Math.pow(t, 0.6) * 16 + 0.4;
    const arm = (i % arms) / arms;
    const spin = radius * 0.55;
    const angle = arm * Math.PI * 2 + spin + (rng() - 0.5) * 0.5;
    const y = (rng() - 0.5) * (2.2 - t * 1.6);
    write(out, i, [
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius,
    ]);
  }
  return out;
}

/** Sparse, wide, dim dust — "millions remain undiscovered". */
export function dust(count: number): Float32Array {
  const rng = mulberry32(2);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 8 + Math.pow(rng(), 0.5) * 26;
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    write(out, i, [
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi) * 0.5,
      r * Math.sin(phi) * Math.sin(theta),
    ]);
  }
  return out;
}

/**
 * A human profile silhouette (head + shoulders — the universal "talent
 * profile" avatar), sampled from a canvas so the particles literally form a
 * PERSON being discovered. Falls back to a sphere if no DOM is available.
 */
export function human(count: number): Float32Array {
  const rng = mulberry32(3);
  const out = new Float32Array(count * 3);

  // SSR / no-canvas guard.
  if (typeof document === 'undefined') {
    for (let i = 0; i < count; i++) {
      const r = 6 * Math.cbrt(0.25 + 0.75 * rng());
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(2 * rng() - 1);
      write(out, i, [
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
      ]);
    }
    return out;
  }

  const W = 190;
  const H = 220;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#fff';

  // Head.
  ctx.beginPath();
  ctx.arc(W / 2, H * 0.3, H * 0.155, 0, Math.PI * 2);
  ctx.fill();
  // Neck.
  ctx.fillRect(W / 2 - W * 0.07, H * 0.4, W * 0.14, H * 0.14);
  // Shoulders / bust — a wide ellipse whose centre sits below the canvas so
  // only the rounded top reads as shoulders.
  ctx.beginPath();
  ctx.ellipse(W / 2, H * 1.06, W * 0.42, H * 0.46, 0, 0, Math.PI * 2);
  ctx.fill();

  // Collect filled pixels.
  const data = ctx.getImageData(0, 0, W, H).data;
  const filled: number[] = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (data[(y * W + x) * 4 + 3] > 128) filled.push(x, y);
    }
  }
  const nFilled = filled.length / 2;

  const worldH = 15;
  const k = worldH / H; // world units per pixel (aspect-preserving)
  const yOffset = 2.6; // lift so the head sits near the centre of frame

  for (let i = 0; i < count; i++) {
    const idx = Math.floor(rng() * nFilled) * 2;
    const px = filled[idx] + (rng() - 0.5) * 1.4;
    const py = filled[idx + 1] + (rng() - 0.5) * 1.4;
    write(out, i, [
      (px - W / 2) * k,
      (H / 2 - py) * k + yOffset,
      (rng() - 0.5) * 1.3, // gentle depth so the bust has volume
    ]);
  }
  return out;
}

/** A torus-knot lattice — reads as an interconnected neural network. */
export function network(count: number): Float32Array {
  const rng = mulberry32(4);
  const out = new Float32Array(count * 3);
  const p = 3;
  const q = 4;
  const R = 8;
  for (let i = 0; i < count; i++) {
    const u = (i / count) * Math.PI * 2 * q;
    const phi = (u * p) / q;
    const cs = 2 + Math.cos(phi);
    // Base curve of the (p,q) torus knot.
    const bx = cs * Math.cos(u) * (R / 3);
    const by = cs * Math.sin(u) * (R / 3);
    const bz = Math.sin(phi) * (R / 3);
    // Cloud around the curve so it reads as a lattice, not a wire.
    const spread = 1.6;
    write(out, i, [
      bx + (rng() - 0.5) * spread,
      by + (rng() - 0.5) * spread,
      bz + (rng() - 0.5) * spread,
    ]);
  }
  return out;
}

/** A hollow globe shell — the planetary talent ecosystem. */
export function globe(count: number): Float32Array {
  const rng = mulberry32(5);
  const out = new Float32Array(count * 3);
  const R = 9;
  for (let i = 0; i < count; i++) {
    // Even distribution via the golden spiral, jittered for organic texture.
    const t = i / count;
    const phi = Math.acos(1 - 2 * t);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const jitter = 1 + (rng() - 0.5) * 0.03;
    write(out, i, [
      R * jitter * Math.sin(phi) * Math.cos(theta),
      R * jitter * Math.cos(phi),
      R * jitter * Math.sin(phi) * Math.sin(theta),
    ]);
  }
  return out;
}

/** Per-particle scale + seed attributes for size variation and twinkle. */
export function attributes(count: number): { scales: Float32Array; seeds: Float32Array } {
  const rng = mulberry32(6);
  const scales = new Float32Array(count);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    scales[i] = 0.5 + Math.pow(rng(), 2.5) * 2.6; // a few large, many small
    seeds[i] = rng();
  }
  return { scales, seeds };
}
