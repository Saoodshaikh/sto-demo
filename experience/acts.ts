import type { ActId } from './audio/AudioEngine';

export interface ActMeta {
  id: ActId;
  label: string;
  tagline: string;
  accent: string;
}

export const ACTS: ActMeta[] = [
  { id: 'singer', label: 'Singer', tagline: 'Live vocal performance', accent: '#ff5da2' },
  { id: 'musician', label: 'Musician', tagline: 'Keys & melody', accent: '#42e8ff' },
  { id: 'guitarist', label: 'Guitarist', tagline: 'Electric arpeggios', accent: '#ffb454' },
  { id: 'dj', label: 'DJ', tagline: 'Festival mainstage', accent: '#4f7bff' },
  { id: 'dancer', label: 'Dancer', tagline: 'Motion & energy', accent: '#a78bfa' },
  { id: 'actor', label: 'Actor', tagline: 'Cinematic spotlight', accent: '#f472b6' },
  { id: 'model', label: 'Model', tagline: 'Runway & lights', accent: '#e5e7eb' },
  { id: 'creator', label: 'Creator', tagline: 'Studio & stream', accent: '#34d399' },
  { id: 'influencer', label: 'Influencer', tagline: 'Live & social', accent: '#f59e0b' },
  { id: 'athlete', label: 'Athlete', tagline: 'Stadium energy', accent: '#22d3ee' },
  { id: 'anchor', label: 'Anchor', tagline: 'On air', accent: '#60a5fa' },
  { id: 'photographer', label: 'Photographer', tagline: 'Studio flash', accent: '#c084fc' },
  { id: 'filmmaker', label: 'Filmmaker', tagline: 'On set', accent: '#fb7185' },
  { id: 'performer', label: 'Performer', tagline: 'Center stage', accent: '#2dd4bf' },
];

export const ACT_MAP: Record<ActId, ActMeta> = ACTS.reduce(
  (m, a) => ((m[a.id] = a), m),
  {} as Record<ActId, ActMeta>
);

/** Per-act staging — each talent gets a distinct live environment. */
export interface StageConfig {
  fog: string;
  spots: string[];
  ledWall: boolean;
  laserRigs: number;
  amps: boolean;
  notes: boolean;
  stars: boolean;
  booth: boolean;
  waveScale: number;
}

export const STAGE: Record<ActId, StageConfig> = {
  singer: { fog: '#0a0410', spots: ['#ff5da2', '#ffffff', '#ff90c0'], ledWall: false, laserRigs: 0, amps: false, notes: false, stars: true, booth: false, waveScale: 1.7 },
  musician: { fog: '#04080f', spots: ['#42e8ff', '#6aa8ff', '#8be0ff'], ledWall: false, laserRigs: 0, amps: false, notes: true, stars: true, booth: true, waveScale: 1.4 },
  guitarist: { fog: '#0f0a04', spots: ['#ffb454', '#ff7a3c', '#ffcf7a'], ledWall: false, laserRigs: 1, amps: true, notes: false, stars: false, booth: false, waveScale: 1.2 },
  dj: { fog: '#04060f', spots: ['#4f7bff', '#42e8ff', '#8b5cf6', '#42e8ff'], ledWall: true, laserRigs: 3, amps: false, notes: false, stars: false, booth: true, waveScale: 1.0 },
  dancer: { fog: '#0a0614', spots: ['#a78bfa', '#ff5da2', '#42e8ff'], ledWall: false, laserRigs: 2, amps: false, notes: false, stars: false, booth: false, waveScale: 1.3 },
  actor: { fog: '#08060a', spots: ['#ffffff'], ledWall: false, laserRigs: 0, amps: false, notes: false, stars: true, booth: false, waveScale: 1.0 },
  model: { fog: '#0a0a0e', spots: ['#ffffff', '#dfe7ff', '#ffffff'], ledWall: false, laserRigs: 0, amps: false, notes: false, stars: false, booth: false, waveScale: 1.1 },
  creator: { fog: '#04100c', spots: ['#34d399', '#42e8ff'], ledWall: false, laserRigs: 0, amps: false, notes: false, stars: false, booth: true, waveScale: 1.2 },
  influencer: { fog: '#100a04', spots: ['#f59e0b', '#ff5da2'], ledWall: false, laserRigs: 1, amps: false, notes: false, stars: false, booth: false, waveScale: 1.2 },
  athlete: { fog: '#04080f', spots: ['#22d3ee', '#ffffff', '#22d3ee'], ledWall: false, laserRigs: 1, amps: false, notes: false, stars: false, booth: false, waveScale: 1.3 },
  anchor: { fog: '#04070f', spots: ['#60a5fa', '#60a5fa'], ledWall: false, laserRigs: 0, amps: false, notes: false, stars: false, booth: true, waveScale: 1.0 },
  photographer: { fog: '#08080c', spots: ['#ffffff', '#c084fc'], ledWall: false, laserRigs: 0, amps: false, notes: false, stars: true, booth: false, waveScale: 1.0 },
  filmmaker: { fog: '#0a0804', spots: ['#ffb454', '#ffffff'], ledWall: false, laserRigs: 0, amps: false, notes: false, stars: true, booth: false, waveScale: 1.1 },
  performer: { fog: '#0a0410', spots: ['#2dd4bf', '#8b5cf6', '#ff5da2', '#42e8ff'], ledWall: false, laserRigs: 2, amps: false, notes: false, stars: true, booth: false, waveScale: 1.3 },
};
