/**
 * Shaders for the holographic AI Earth and its connection beams.
 * All are additive + reveal-gated (uReveal 0..1, driven by scroll) so the whole
 * apparatus fades in exactly as the particle field resolves into the globe.
 */

/* ---------- Fresnel hologram shell ---------- */
export const shellVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vWorld;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    vWorld = position;
    gl_Position = projectionMatrix * mv;
  }
`;

export const shellFragment = /* glsl */ `
  uniform float uTime;
  uniform float uReveal;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vWorld;
  void main() {
    // Rim light — brightest at the silhouette, like a projected hologram.
    float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.6);

    // Horizontal scan bands drifting upward.
    float scan = 0.5 + 0.5 * sin(vWorld.y * 6.0 - uTime * 1.6);
    scan = 0.15 + 0.85 * scan;

    vec3 cyan = vec3(0.26, 0.91, 1.0);
    vec3 electric = vec3(0.31, 0.48, 1.0);
    vec3 col = mix(electric, cyan, fres) * (fres * 1.4 + 0.05 * scan);

    gl_FragColor = vec4(col, (fres * 0.9 + 0.04) * uReveal);
  }
`;

/* ---------- Glowing continent dots ---------- */
export const dotsVertex = /* glsl */ `
  uniform float uTime;
  uniform float uReveal;
  uniform float uSize;
  attribute float aIndia;
  varying float vIndia;
  varying float vTw;
  void main() {
    vIndia = aIndia;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    // India dots pulse a touch brighter — it "glows first".
    float twBase = 0.7 + 0.3 * sin(uTime * 2.0 + position.x * 3.0 + position.z * 2.0);
    float indiaPulse = 0.6 + 0.4 * sin(uTime * 3.0);
    vTw = mix(twBase, indiaPulse, aIndia);
    gl_Position = projectionMatrix * mv;
    float size = uSize * mix(1.0, 1.7, aIndia);
    gl_PointSize = size * (14.0 / -mv.z) * (0.4 + 0.6 * uReveal);
  }
`;

export const dotsFragment = /* glsl */ `
  uniform float uReveal;
  varying float vIndia;
  varying float vTw;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.05, d);

    vec3 land = vec3(0.28, 0.7, 1.0);          // cool electric-cyan
    vec3 indiaGlow = vec3(1.0, 0.86, 0.55);    // warm gold — India first
    vec3 col = mix(land, indiaGlow, vIndia) * (0.7 + vTw);

    gl_FragColor = vec4(col, a * uReveal * (0.65 + 0.35 * vIndia));
  }
`;

/* ---------- Connection beams (data pulses along arcs) ---------- */
export const arcVertex = /* glsl */ `
  attribute float aOffset;
  varying vec2 vUv;
  varying float vOffset;
  void main() {
    vUv = uv;              // uv.x runs 0..1 along the tube length
    vOffset = aOffset;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const arcFragment = /* glsl */ `
  uniform float uTime;
  uniform float uReveal;
  uniform float uSpeed;
  varying vec2 vUv;
  varying float vOffset;
  void main() {
    // Dim base filament so the route is always faintly visible.
    float base = 0.16;

    // A bright packet of "data" travels India -> hub, looping.
    float head = fract(uTime * uSpeed + vOffset);
    float dist = abs(fract(vUv.x - head + 0.5) - 0.5);
    float pulse = smoothstep(0.05, 0.0, dist);
    // Comet trail behind the head.
    float trail = smoothstep(0.22, 0.0, fract(head - vUv.x)) * 0.5;

    vec3 electric = vec3(0.31, 0.48, 1.0);
    vec3 cyan = vec3(0.4, 0.95, 1.0);
    vec3 white = vec3(0.85, 0.97, 1.0);
    vec3 col = mix(electric, cyan, vUv.x);
    col = mix(col, white, pulse);

    float alpha = (base + trail + pulse * 1.4) * uReveal;
    gl_FragColor = vec4(col * (0.6 + pulse + trail), alpha);
  }
`;
