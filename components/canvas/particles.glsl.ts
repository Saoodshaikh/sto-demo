/**
 * Shaders for the morphing talent-particle system.
 *
 * The system stores FIVE precomputed formations per particle (galaxy, dust,
 * neural core, network lattice, globe). A weights[] uniform — driven by scroll —
 * blends between them on the GPU, so morphing millions of particle-updates costs
 * nothing on the CPU. Curl-style noise adds organic life; depth drives color.
 */

export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uWeights[5];
  uniform vec2  uPointer;
  uniform float uScatter;

  attribute vec3  aPosGalaxy;
  attribute vec3  aPosDust;
  attribute vec3  aPosHuman;
  attribute vec3  aPosNet;
  attribute vec3  aPosGlobe;
  attribute float aScale;
  attribute float aSeed;

  varying float vDepth;
  varying float vSeed;
  varying float vRadius;

  // Cheap hash-based 3D noise for organic drift.
  vec3 hash3(float n) {
    return fract(sin(vec3(n, n + 1.7, n + 3.3)) * 43758.5453);
  }

  void main() {
    vec3 pos =
        uWeights[0] * aPosGalaxy +
        uWeights[1] * aPosDust +
        uWeights[2] * aPosHuman +
        uWeights[3] * aPosNet +
        uWeights[4] * aPosGlobe;

    // Organic breathing + drift, scaled by per-particle seed.
    float t = uTime * 0.18 + aSeed * 6.2831;
    vec3 drift = (hash3(aSeed) - 0.5);
    pos += vec3(
      sin(t + drift.x * 4.0),
      cos(t * 1.1 + drift.y * 4.0),
      sin(t * 0.7 + drift.z * 4.0)
    ) * (0.06 + uScatter * 0.9);

    // Subtle pointer parallax — the whole field leans toward the cursor.
    pos.xy += uPointer * (2.2 + aScale * 1.5);

    vRadius = length(pos.xz);
    vSeed = aSeed;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vDepth = -mvPosition.z;

    gl_Position = projectionMatrix * mvPosition;
    // Perspective size attenuation with a per-particle scale.
    gl_PointSize = uSize * aScale * (14.0 / vDepth);
  }
`;

export const fragmentShader = /* glsl */ `
  uniform float uTime;

  varying float vDepth;
  varying float vSeed;
  varying float vRadius;

  void main() {
    // Soft circular sprite.
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d);
    alpha = pow(alpha, 1.8);

    // Palette: electric blue → cyan → soft violet, shifted by depth + seed.
    vec3 electric = vec3(0.31, 0.48, 1.0);
    vec3 cyan     = vec3(0.26, 0.91, 1.0);
    vec3 violet   = vec3(0.55, 0.36, 0.96);

    float mixA = clamp(vRadius * 0.05 + vSeed * 0.4, 0.0, 1.0);
    vec3 color = mix(electric, cyan, mixA);
    color = mix(color, violet, smoothstep(6.0, 22.0, vDepth) * 0.6);

    // Twinkle.
    float tw = 0.75 + 0.25 * sin(uTime * 2.0 + vSeed * 30.0);
    color *= tw;

    // Fade very distant particles into the void for depth.
    float depthFade = smoothstep(46.0, 10.0, vDepth);

    gl_FragColor = vec4(color, alpha * depthFade);
  }
`;
