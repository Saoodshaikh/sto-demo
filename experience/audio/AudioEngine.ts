/**
 * Procedural multi-instrument audio engine for The Stage.
 * Each "act" (singer / guitarist / musician / dj) has its own timbre, melody
 * pattern and drum feel, all synthesized in-browser — no asset files, no
 * licensing. Exposes analyser bands, a beat pulse, and a time-domain waveform
 * so the whole scene reacts to whatever is playing.
 *
 * NOTE: real sung vocals require a licensed recording; the "singer" act plays a
 * melodic vocal-style lead as a stand-in until an mp3 is supplied.
 */

export type ActId =
  | 'singer' | 'guitarist' | 'musician' | 'dj'
  | 'dancer' | 'actor' | 'model' | 'creator' | 'influencer'
  | 'athlete' | 'anchor' | 'photographer' | 'filmmaker' | 'performer';
type Timbre = 'pluck' | 'lead' | 'piano' | 'bass';
type Drums = 'full' | 'hat' | 'soft' | 'none';

interface Pattern {
  timbre: Timbre;
  drums: Drums;
  drone: boolean;
  dur: number;
  seq: number[]; // 16 eighth-note steps, Hz (0 = rest)
}

// Note frequencies (Hz).
const N = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, E5: 659.25,
};

// Reusable melodic/rhythmic phrases (16 eighth-note steps).
const LEAD = [N.E4, 0, N.G4, 0, N.A4, 0, N.G4, N.E4, N.D4, 0, N.E4, 0, N.C4, 0, 0, 0];
const ARP = [N.A3, N.C4, N.E4, N.C4, N.G3, N.B3, N.D4, N.B3, N.C4, N.E4, N.G4, N.E4, N.F3, N.A3, N.C4, N.A3];
const PIANO = [N.C4, N.E4, N.G4, N.C5, N.B4, N.G4, N.E4, N.G4, N.A4, N.C5, N.E5, N.C5, N.G4, N.E4, N.C4, 0];
const DJB = [55, 0, 55, 0, 82.4, 0, 55, 0, 49, 0, 49, 0, 73.4, 0, 65.4, 0];
const DANCE = [55, 55, 0, 110, 82.4, 0, 55, 110, 49, 49, 0, 98, 73.4, 0, 65.4, 0];
const ATH = [55, 0, 55, 55, 82.4, 0, 82.4, 0, 49, 0, 49, 49, 73.4, 0, 73.4, 0];
const CINE = [N.C4, 0, 0, 0, N.G3, 0, 0, 0, N.A3, 0, 0, 0, N.F3, 0, 0, 0];
const CHIC = [N.E4, 0, N.D4, 0, N.C4, 0, N.D4, 0, N.A3, 0, N.B3, 0, N.C4, 0, 0, 0];
const BROAD = [N.C4, 0, 0, 0, 0, 0, 0, 0, N.G3, 0, 0, 0, 0, 0, 0, 0];

const PATTERNS: Record<ActId, Pattern> = {
  singer: { timbre: 'lead', drums: 'soft', drone: true, dur: 0.5, seq: LEAD },
  musician: { timbre: 'piano', drums: 'soft', drone: true, dur: 0.42, seq: PIANO },
  guitarist: { timbre: 'pluck', drums: 'hat', drone: false, dur: 0.4, seq: ARP },
  dj: { timbre: 'bass', drums: 'full', drone: true, dur: 0.36, seq: DJB },
  dancer: { timbre: 'bass', drums: 'full', drone: true, dur: 0.3, seq: DANCE },
  actor: { timbre: 'piano', drums: 'none', drone: true, dur: 0.8, seq: CINE },
  model: { timbre: 'pluck', drums: 'hat', drone: true, dur: 0.45, seq: CHIC },
  creator: { timbre: 'lead', drums: 'hat', drone: true, dur: 0.4, seq: CHIC },
  influencer: { timbre: 'lead', drums: 'hat', drone: false, dur: 0.4, seq: CHIC },
  athlete: { timbre: 'bass', drums: 'full', drone: true, dur: 0.32, seq: ATH },
  anchor: { timbre: 'lead', drums: 'soft', drone: true, dur: 0.6, seq: BROAD },
  photographer: { timbre: 'piano', drums: 'soft', drone: true, dur: 0.6, seq: BROAD },
  filmmaker: { timbre: 'piano', drums: 'none', drone: true, dur: 0.8, seq: CINE },
  performer: { timbre: 'bass', drums: 'full', drone: true, dur: 0.34, seq: DANCE },
};

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private freq = new Uint8Array(0);
  private timeData = new Uint8Array(0);

  private schedTimer: number | null = null;
  private nextNoteTime = 0;
  private step = 0;
  private readonly bpm = 120;
  private lastKick = -1;
  private drone: { osc: OscillatorNode[]; gain: GainNode } | null = null;

  act: ActId = 'dj';
  started = false;
  muted = false;

  // Only one engine may ever be audible at a time — prevents overlapping tracks.
  private static current: AudioEngine | null = null;

  async start(act: ActId = 'dj') {
    this.act = act;
    if (this.started) {
      if (this.ctx?.state === 'suspended') await this.ctx.resume();
      return;
    }
    // Tear down any other engine still playing before we begin.
    if (AudioEngine.current && AudioEngine.current !== this) {
      AudioEngine.current.dispose();
    }
    AudioEngine.current = this;
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new Ctx();
    await this.ctx.resume();

    this.master = this.ctx.createGain();
    this.master.gain.value = 0.0;
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 512;
    this.analyser.smoothingTimeConstant = 0.8;
    this.freq = new Uint8Array(this.analyser.frequencyBinCount);
    this.timeData = new Uint8Array(this.analyser.fftSize);

    this.master.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
    this.master.gain.linearRampToValueAtTime(0.85, this.ctx.currentTime + 2.0);

    this.startDrone();
    this.applyDrone();

    this.nextNoteTime = this.ctx.currentTime + 0.08;
    this.step = 0;
    this.scheduler();
    this.started = true;
  }

  setAct(act: ActId) {
    this.act = act;
    this.applyDrone();
  }

  private startDrone() {
    if (!this.ctx || !this.master) return;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 650;
    const g = this.ctx.createGain();
    g.gain.value = 0.0;
    filter.connect(g);
    g.connect(this.master);
    const oscs: OscillatorNode[] = [];
    [110, 164.81].forEach((f, i) => {
      const o = this.ctx!.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = f;
      o.detune.value = i === 0 ? -6 : 6;
      o.connect(filter);
      o.start();
      oscs.push(o);
    });
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.05;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 240;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    this.drone = { osc: oscs, gain: g };
  }

  private applyDrone() {
    if (!this.drone || !this.ctx) return;
    const on = PATTERNS[this.act].drone ? 0.05 : 0.0;
    this.drone.gain.gain.linearRampToValueAtTime(on, this.ctx.currentTime + 0.4);
  }

  private scheduler = () => {
    if (!this.ctx) return;
    const secPerStep = 60 / this.bpm / 2;
    while (this.nextNoteTime < this.ctx.currentTime + 0.12) {
      this.scheduleStep(this.step, this.nextNoteTime);
      this.nextNoteTime += secPerStep;
      this.step = (this.step + 1) % 16;
    }
    this.schedTimer = window.setTimeout(this.scheduler, 25);
  };

  private scheduleStep(step: number, time: number) {
    if (!this.ctx || !this.master) return;
    const p = PATTERNS[this.act];

    // Drums.
    if (p.drums === 'full') {
      if (step % 2 === 0) { this.kick(time, 1); this.lastKick = time; }
      this.hat(time, step % 2 === 1 ? 0.12 : 0.05);
    } else if (p.drums === 'hat') {
      this.hat(time, step % 2 === 1 ? 0.13 : 0.04);
      if (step % 4 === 0) { this.kick(time, 0.5); this.lastKick = time; }
    } else if (p.drums === 'soft') {
      if (step % 4 === 0) { this.kick(time, 0.55); this.lastKick = time; }
    }

    // Melodic note.
    const f = p.seq[step];
    if (f > 0) this.voice(time, f, p.timbre, p.dur);
  }

  /* ---------- instruments ---------- */

  private kick(time: number, gain: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.setValueAtTime(150, time);
    o.frequency.exponentialRampToValueAtTime(48, time + 0.12);
    g.gain.setValueAtTime(gain, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
    o.connect(g);
    g.connect(this.master!);
    o.start(time);
    o.stop(time + 0.32);
  }

  private hat(time: number, gain: number) {
    const ctx = this.ctx!;
    const n = Math.floor(ctx.sampleRate * 0.05);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 7000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
    src.connect(hp);
    hp.connect(g);
    g.connect(this.master!);
    src.start(time);
    src.stop(time + 0.05);
  }

  private voice(time: number, freq: number, timbre: Timbre, dur: number) {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    g.connect(this.master!);

    if (timbre === 'pluck') {
      const o1 = ctx.createOscillator();
      const o2 = ctx.createOscillator();
      o1.type = 'sawtooth';
      o2.type = 'triangle';
      o1.frequency.value = freq;
      o2.frequency.value = freq;
      o2.detune.value = 7;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(2600, time);
      lp.frequency.exponentialRampToValueAtTime(500, time + dur);
      g.gain.setValueAtTime(0.0, time);
      g.gain.linearRampToValueAtTime(0.32, time + 0.005);
      g.gain.exponentialRampToValueAtTime(0.001, time + dur);
      o1.connect(lp); o2.connect(lp); lp.connect(g);
      o1.start(time); o2.start(time);
      o1.stop(time + dur + 0.02); o2.stop(time + dur + 0.02);
    } else if (timbre === 'lead') {
      const o1 = ctx.createOscillator();
      const o2 = ctx.createOscillator();
      o1.type = 'triangle';
      o2.type = 'sine';
      o1.frequency.value = freq;
      o2.frequency.value = freq;
      // Vibrato.
      const vib = ctx.createOscillator();
      vib.frequency.value = 5.2;
      const vibGain = ctx.createGain();
      vibGain.gain.value = 6;
      vib.connect(vibGain);
      vibGain.connect(o1.detune);
      vibGain.connect(o2.detune);
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 950;
      bp.Q.value = 0.9;
      g.gain.setValueAtTime(0.0, time);
      g.gain.linearRampToValueAtTime(0.3, time + 0.07);
      g.gain.setValueAtTime(0.3, time + dur * 0.6);
      g.gain.exponentialRampToValueAtTime(0.001, time + dur);
      o1.connect(bp); o2.connect(bp); bp.connect(g);
      o1.start(time); o2.start(time); vib.start(time);
      o1.stop(time + dur + 0.02); o2.stop(time + dur + 0.02); vib.stop(time + dur + 0.02);
    } else if (timbre === 'piano') {
      const carrier = ctx.createOscillator();
      const mod = ctx.createOscillator();
      const modGain = ctx.createGain();
      carrier.type = 'sine';
      mod.type = 'sine';
      carrier.frequency.value = freq;
      mod.frequency.value = freq * 2.01;
      modGain.gain.setValueAtTime(freq * 1.4, time);
      modGain.gain.exponentialRampToValueAtTime(1, time + dur);
      mod.connect(modGain);
      modGain.connect(carrier.frequency);
      g.gain.setValueAtTime(0.0, time);
      g.gain.linearRampToValueAtTime(0.3, time + 0.005);
      g.gain.exponentialRampToValueAtTime(0.001, time + dur);
      carrier.connect(g);
      carrier.start(time); mod.start(time);
      carrier.stop(time + dur + 0.02); mod.stop(time + dur + 0.02);
    } else {
      // bass
      const o = ctx.createOscillator();
      const f = ctx.createBiquadFilter();
      o.type = 'sawtooth';
      o.frequency.value = freq;
      f.type = 'lowpass';
      f.frequency.value = 240;
      g.gain.setValueAtTime(0.0, time);
      g.gain.linearRampToValueAtTime(0.3, time + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, time + dur);
      o.connect(f); f.connect(g);
      o.start(time);
      o.stop(time + dur + 0.02);
    }
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.master && this.ctx) {
      this.master.gain.cancelScheduledValues(this.ctx.currentTime);
      this.master.gain.linearRampToValueAtTime(m ? 0 : 0.85, this.ctx.currentTime + 0.3);
    }
  }

  read() {
    if (!this.analyser || !this.ctx) {
      return { bass: 0, mid: 0, treble: 0, level: 0, beat: 0 };
    }
    this.analyser.getByteFrequencyData(this.freq as any);
    const n = this.freq.length;
    const avg = (a: number, b: number) => {
      let s = 0;
      for (let i = a; i < b; i++) s += this.freq[i];
      return s / (b - a) / 255;
    };
    const bass = avg(0, Math.floor(n * 0.08));
    const mid = avg(Math.floor(n * 0.08), Math.floor(n * 0.4));
    const treble = avg(Math.floor(n * 0.4), n);
    const level = (bass + mid + treble) / 3;
    const dt = this.ctx.currentTime - this.lastKick;
    const beat = this.lastKick < 0 ? 0 : Math.max(0, Math.exp(-dt * 7));
    return { bass, mid, treble, level, beat };
  }

  /** Fills `out` with the current time-domain waveform, normalized -1..1. */
  readWave(out: Float32Array) {
    if (!this.analyser) return;
    this.analyser.getByteTimeDomainData(this.timeData as any);
    const src = this.timeData;
    const stepN = src.length / out.length;
    for (let i = 0; i < out.length; i++) {
      out[i] = (src[Math.floor(i * stepN)] - 128) / 128;
    }
  }

  dispose() {
    if (this.schedTimer) clearTimeout(this.schedTimer);
    this.schedTimer = null;
    this.drone?.osc.forEach((o) => { try { o.stop(); } catch {} });
    this.drone = null;
    if (this.ctx) { try { this.ctx.close(); } catch {} }
    this.ctx = null;
    this.started = false;
    if (AudioEngine.current === this) AudioEngine.current = null;
  }
}
