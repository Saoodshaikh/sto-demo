import * as THREE from 'three';

export interface TalentCard {
  name: string;
  role: string;
  match: number;
  tag: string;
  hueA: string;
  hueB: string;
}

/** The talent the AI is surfacing — real roles across STC's verticals. */
export const TALENT: TalentCard[] = [
  { name: 'Aarav Mehta', role: 'Playback Vocalist', match: 98, tag: 'Music', hueA: '#4f7bff', hueB: '#8b5cf6' },
  { name: 'Meera Nair', role: 'Fashion Model', match: 96, tag: 'Fashion', hueA: '#42e8ff', hueB: '#4f7bff' },
  { name: 'Kabir Rao', role: 'Cinematographer', match: 97, tag: 'Film', hueA: '#8b5cf6', hueB: '#42e8ff' },
  { name: 'Ananya Iyer', role: 'Contemporary Dancer', match: 95, tag: 'Performance', hueA: '#4f7bff', hueB: '#42e8ff' },
  { name: 'Rohan Das', role: 'Lead Actor', match: 94, tag: 'Theatre', hueA: '#42e8ff', hueB: '#8b5cf6' },
];

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Renders a glassmorphic talent profile card onto a canvas and returns it as a
 * texture — crisp, theme-matched, and dependency-free (no image assets).
 */
export function createCardTexture(card: TalentCard): THREE.CanvasTexture {
  const W = 680;
  const H = 400;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d')!;

  const pad = 30;
  const cw = W - pad * 2;
  const ch = H - pad * 2;

  // Card body — dark glass.
  roundRect(ctx, pad, pad, cw, ch, 40);
  const bg = ctx.createLinearGradient(pad, pad, pad, pad + ch);
  bg.addColorStop(0, 'rgba(18,24,42,0.94)');
  bg.addColorStop(1, 'rgba(9,12,24,0.94)');
  ctx.fillStyle = bg;
  ctx.fill();

  // Border + top highlight.
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(140,165,255,0.35)';
  ctx.stroke();
  roundRect(ctx, pad + 2, pad + 2, cw - 4, ch * 0.4, 38);
  const hi = ctx.createLinearGradient(0, pad, 0, pad + ch * 0.4);
  hi.addColorStop(0, 'rgba(255,255,255,0.10)');
  hi.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = hi;
  ctx.fill();

  // Avatar disc with gradient + initials.
  const ax = pad + 70;
  const ay = pad + 90;
  const ar = 52;
  const grad = ctx.createLinearGradient(ax - ar, ay - ar, ax + ar, ay + ar);
  grad.addColorStop(0, card.hueA);
  grad.addColorStop(1, card.hueB);
  ctx.beginPath();
  ctx.arc(ax, ay, ar, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.font = '600 44px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const initials = card.name.split(' ').map((s) => s[0]).join('');
  ctx.fillText(initials, ax, ay + 2);

  // Verified badge dot.
  ctx.beginPath();
  ctx.arc(ax + ar - 6, ay + ar - 10, 12, 0, Math.PI * 2);
  ctx.fillStyle = '#42e8ff';
  ctx.fill();

  // Name + role.
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 42px Inter, system-ui, sans-serif';
  ctx.fillText(card.name, pad + 150, pad + 74);
  ctx.fillStyle = 'rgba(159,180,255,0.9)';
  ctx.font = '400 30px Inter, system-ui, sans-serif';
  ctx.fillText(card.role, pad + 150, pad + 118);

  // Tag chip.
  ctx.font = '500 24px Inter, system-ui, sans-serif';
  const tagW = ctx.measureText(card.tag).width + 40;
  roundRect(ctx, pad + 40, pad + ch - 84, tagW, 46, 23);
  ctx.fillStyle = 'rgba(79,123,255,0.16)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(120,150,255,0.35)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = 'rgba(200,214,255,0.95)';
  ctx.fillText(card.tag, pad + 60, pad + ch - 54);

  // AI match pill (right).
  const pillW = 190;
  const pillX = W - pad - pillW - 24;
  const pillY = pad + ch - 84;
  roundRect(ctx, pillX, pillY, pillW, 46, 23);
  const pg = ctx.createLinearGradient(pillX, 0, pillX + pillW, 0);
  pg.addColorStop(0, '#4f7bff');
  pg.addColorStop(1, '#42e8ff');
  ctx.fillStyle = pg;
  ctx.fill();
  ctx.fillStyle = '#04060d';
  ctx.font = '700 26px Inter, system-ui, sans-serif';
  ctx.fillText(`AI ${card.match}% MATCH`, pillX + 20, pillY + 25);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.needsUpdate = true;
  return tex;
}
