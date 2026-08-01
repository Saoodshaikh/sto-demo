/**
 * Frame-shared audio + pointer state for the experience. Written once per frame
 * by ExperienceRoot from the AudioEngine, read by every stagecraft element in
 * useFrame — mutating a plain object instead of triggering React renders.
 */
export const audio = {
  bass: 0,
  mid: 0,
  treble: 0,
  level: 0,
  beat: 0,
  /** Seconds since the experience started (drives fallback motion). */
  time: 0,
  pointerX: 0,
  pointerY: 0,
  /** Time-domain waveform of whatever act is playing, normalized -1..1. */
  wave: new Float32Array(128),
};
