# Select Talent Co — STC

> The operating system for the global talent economy.
> India's AI-powered Talent Discovery, Artist Management and Talent Commerce platform.

A cinematic, WebGL-driven marketing experience built with **Next.js 14 (App Router)**,
**React Three Fiber**, **GSAP-grade motion (Framer Motion)** and **Lenis** smooth scroll.

The centerpiece is a single **GPU particle system** (~16k particles, one draw call)
that morphs — driven entirely by scroll — through five procedurally-generated
formations that carry the narrative:

`galaxy → scattered dust → neural core → network lattice → planetary globe`

All morphing happens on the GPU by blending five position attributes with a
scroll-driven `weights[]` uniform, so the CPU stays free and the field holds 60fps.

At the **climax**, the particles resolve into a **holographic AI Earth**: dotted
continents (procedural land-mask, no texture assets), **India lit first**, and
**AI connection beams** arcing along great-circle paths from India to twelve
global talent hubs — each carrying a live pulse of light travelling India → hub.
This is the product made literal: intelligence connecting talent to the world.

---

## Quick start

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Build for production with `npm run build && npm start`.

> Requires Node 18.18+ (Node 20 LTS recommended).

---

## Architecture

```
STO/
├─ app/
│  ├─ layout.tsx            # Fonts (Sora/Inter), metadata, <body> shell
│  ├─ page.tsx              # Composition: Scene backdrop + all sections
│  └─ globals.css           # Design tokens, glass, aurora, grain, cursor
│
├─ components/
│  ├─ canvas/               # WebGL layer
│  │  ├─ Scene.tsx           # <Canvas>, camera rig, bloom + vignette
│  │  ├─ ParticleField.tsx   # Geometry, per-frame scroll→weights morphing
│  │  ├─ particles.glsl.ts   # Particle shaders (morph, twinkle, glow)
│  │  ├─ HolographicEarth.tsx# Fresnel shell + dotted continents + India beacon
│  │  ├─ ConnectionArcs.tsx  # Great-circle AI beams w/ travelling data pulses
│  │  └─ holographic.glsl.ts # Shell / dots / arc shaders
│  ├─ providers/
│  │  └─ SmoothScroll.tsx   # Lenis; publishes progress/velocity/pointer
│  ├─ ui/                   # Loader, Cursor, Navbar, ScrollRail, MagneticButton, Reveal
│  └─ sections/             # Hero, Story, Intelligence, Journeys, Ecosystem,
│                           #   TechSecurity, Roadmap, Vision, CTA, Footer
│
└─ lib/
   ├─ scroll-store.ts       # Module-level store shared DOM ⇄ render loop
   ├─ phases.ts             # Scroll→phase anchors + blend weights (single source)
   ├─ formations.ts         # 5 procedural particle formations (deterministic)
   ├─ geo.ts                # Lat/lon math, procedural continents, hubs, arcs
   └─ content.ts            # All real STC copy — no lorem
```

### Why a module-level store, not React state?

The 3D scene reads scroll progress, velocity and pointer **every frame**. Pushing
that through React state would trigger 60 re-renders/second. Instead
`lib/scroll-store.ts` is a plain mutated object: Lenis writes to it, `useFrame`
reads from it. React only re-renders for genuine UI changes.

---

## The scroll → 3D mapping

| Scroll | Formation | Narrative beat                        |
| -----: | --------- | ------------------------------------- |
|  0.00  | Galaxy    | Genesis / hero                        |
|  0.12  | Dust      | Millions undiscovered                 |
|  0.22  | Core      | Intelligence awakens                  |
|  0.34  | Network   | Connections form                      |
|  0.46  | Globe     | Holographic AI Earth + connection beams reveal |

Anchors live in `lib/phases.ts` and are shared by the particles, the Earth and
the arcs, so everything stays in lock-step. `computeWeights()` smoothstep-blends
the two nearest formations; `Scene.CameraRig` dollies from z≈34 (darkness)
inward. The Earth + beams ease in on `globeWeight(progress)` — resolving as the
story's climax, over the transparent story background, then holding as the
reader continues.

---

## Interaction & motion system

- **Lenis** momentum smooth-scroll (respects `prefers-reduced-motion`).
- **Custom cursor** — precise dot + lagging ring that expands over `[data-hover]`.
- **Magnetic buttons** — element + label drift toward the pointer, spring back.
- **Pointer parallax** — the whole particle field leans toward the cursor.
- **Reveal** — scroll-triggered rises with `cubic-bezier(0.22,1,0.36,1)` easing.
- **Story panels** — per-panel `useScroll` drives fade + blur + drift (title-sequence feel).

---

## Performance

- WebGL scene is `dynamic(..., { ssr: false })` — never blocks first paint.
- One `THREE.Points` draw call; additive blending; `depthWrite=false`.
- DPR clamped `[1, 1.6]`; mobile/low-memory devices drop to 7k particles + DPR 1.3.
- `antialias:false` (bloom hides aliasing); `mipmapBlur` bloom is cheap.
- Bloom + vignette disabled entirely under `prefers-reduced-motion`.

---

## Assets list

This build is **100% procedural + typographic** — no binary assets required to run.
Recommended additions for a production launch:

| Asset            | Purpose                          | Suggested source        |
| ---------------- | -------------------------------- | ----------------------- |
| `og-image.png`   | Social share card (1200×630)     | Export a hero frame     |
| `favicon.ico`    | Browser tab / PWA icon           | STC mark                |
| Sora / Inter     | Display + body type              | Loaded via `next/font`  |
| Optional HDRI    | Reflections if you add glass 3D  | polyhaven.com           |
| Optional Spline  | Embeddable 3D vignette per stack | spline.design           |

---

## Extending

- **New narrative beat** → add a formation in `lib/formations.ts`, a new
  `aPos*` attribute + weight slot in the shader, and an anchor in `ANCHORS`.
- **New section** → drop a component in `components/sections/` and mount it in
  `app/page.tsx`; wrap content in `<Reveal>` for consistent motion.
- **Wire the waitlist** → `components/sections/CTA.tsx` `submit()` is the hook point.

---

## Tech stack

Next.js 14 · React 18 · TypeScript · React Three Fiber · @react-three/postprocessing ·
Three.js · Framer Motion · Lenis · TailwindCSS.

> Note: pinned to React 18 for React Three Fiber v8 stability. R3F v9 (React 19)
> is a drop-in upgrade once you're ready — no scene code changes required.
