/**
 * The single source of truth for how scroll progress maps to the narrative
 * "phases". The particle field, the holographic Earth and the connection beams
 * all read from here so the whole scene stays perfectly in sync.
 *
 * Anchors are compressed into the hero + story range (0 → ~0.46) so the Earth
 * resolves as the CLIMAX of the story — over the transparent story background —
 * and then holds as the globe while the reader continues into the content.
 */
export const PHASE = {
  GALAXY: 0,
  DUST: 1,
  HUMAN: 2,
  NETWORK: 3,
  GLOBE: 4,
} as const;

export const ANCHORS = [0.0, 0.12, 0.22, 0.34, 0.46];

export function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

/** Fills `out` (length 5) with blend weights for a given scroll progress. */
export function computeWeights(p: number, out: number[]) {
  out.fill(0);
  if (p <= ANCHORS[0]) {
    out[0] = 1;
    return out;
  }
  const last = ANCHORS.length - 1;
  if (p >= ANCHORS[last]) {
    out[last] = 1;
    return out;
  }
  for (let i = 0; i < last; i++) {
    if (p >= ANCHORS[i] && p < ANCHORS[i + 1]) {
      const local = smoothstep((p - ANCHORS[i]) / (ANCHORS[i + 1] - ANCHORS[i]));
      out[i] = 1 - local;
      out[i + 1] = local;
      return out;
    }
  }
  return out;
}

const scratch = [0, 0, 0, 0, 0];

/** Convenience: how "formed" the network lattice is (0..1). */
export function networkWeight(p: number) {
  computeWeights(p, scratch);
  return scratch[PHASE.NETWORK] + scratch[PHASE.GLOBE];
}

/** Convenience: how "formed" the globe is (0..1). Drives Earth + arcs reveal. */
export function globeWeight(p: number) {
  computeWeights(p, scratch);
  return scratch[PHASE.GLOBE];
}
