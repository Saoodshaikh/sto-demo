import * as THREE from 'three';

const DEG = Math.PI / 180;

/** Convert geographic coordinates to a point on a sphere of radius r. */
export function latLonToVec3(lat: number, lon: number, r: number): THREE.Vector3 {
  const la = lat * DEG;
  const lo = lon * DEG;
  return new THREE.Vector3(
    r * Math.cos(la) * Math.cos(lo),
    r * Math.sin(la),
    r * Math.cos(la) * Math.sin(lo)
  );
}

/** New Delhi — the point that "glows first". */
export const INDIA = { lat: 28.61, lon: 77.2 };

/** Global talent hubs the AI network connects India to. */
export const HUBS = [
  { name: 'London', lat: 51.5, lon: -0.12 },
  { name: 'New York', lat: 40.71, lon: -74.0 },
  { name: 'Los Angeles', lat: 34.05, lon: -118.24 },
  { name: 'Tokyo', lat: 35.68, lon: 139.69 },
  { name: 'Singapore', lat: 1.35, lon: 103.82 },
  { name: 'Dubai', lat: 25.2, lon: 55.27 },
  { name: 'Sydney', lat: -33.87, lon: 151.21 },
  { name: 'São Paulo', lat: -23.55, lon: -46.63 },
  { name: 'Paris', lat: 48.85, lon: 2.35 },
  { name: 'Berlin', lat: 52.52, lon: 13.4 },
  { name: 'Toronto', lat: 43.65, lon: -79.38 },
  { name: 'Cape Town', lat: -33.92, lon: 18.42 },
];

/**
 * Points along the great-circle path between two coordinates, bowed outward so
 * the arc lifts off the surface (classic "network globe" look). Uses spherical
 * linear interpolation of the unit direction vectors.
 */
export function greatCircleArc(
  aLat: number,
  aLon: number,
  bLat: number,
  bLon: number,
  radius: number,
  segments = 48,
  maxLift = 2.4
): THREE.Vector3[] {
  const va = latLonToVec3(aLat, aLon, 1);
  const vb = latLonToVec3(bLat, bLon, 1);
  const omega = Math.acos(THREE.MathUtils.clamp(va.dot(vb), -1, 1));
  const sinOmega = Math.sin(omega) || 1e-5;
  const out: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const s0 = Math.sin((1 - t) * omega) / sinOmega;
    const s1 = Math.sin(t * omega) / sinOmega;
    const p = va.clone().multiplyScalar(s0).add(vb.clone().multiplyScalar(s1));
    p.normalize();
    // Arc altitude peaks at the midpoint; longer arcs bow higher.
    const lift = Math.sin(Math.PI * t) * maxLift * (0.4 + omega / Math.PI);
    p.multiplyScalar(radius + lift);
    out.push(p);
  }
  return out;
}

/**
 * Procedural continent land-mask. Each continent is approximated as one or more
 * ellipses in lat/lon space — enough to read unmistakably as Earth as a dotted
 * globe, with zero binary texture assets. `latR`/`lonR` are half-extents (deg).
 */
const CONTINENTS = [
  { lat: 45, lon: -100, latR: 24, lonR: 34 }, // North America
  { lat: 60, lon: -95, latR: 12, lonR: 30 }, // Canada north
  { lat: 72, lon: -42, latR: 8, lonR: 16 }, // Greenland
  { lat: -15, lon: -60, latR: 24, lonR: 14 }, // South America
  { lat: 8, lon: 18, latR: 18, lonR: 20 }, // North Africa
  { lat: -18, lon: 25, latR: 18, lonR: 16 }, // Southern Africa
  { lat: 52, lon: 18, latR: 12, lonR: 30 }, // Europe
  { lat: 58, lon: 90, latR: 16, lonR: 60 }, // Siberia / N Asia
  { lat: 34, lon: 100, latR: 14, lonR: 34 }, // Central / East Asia
  { lat: 22, lon: 79, latR: 12, lonR: 11 }, // India subcontinent
  { lat: 5, lon: 112, latR: 12, lonR: 18 }, // SE Asia / Indonesia
  { lat: -25, lon: 134, latR: 12, lonR: 19 }, // Australia
];

const INDIA_REGION = { lat: 22, lon: 79, latR: 13, lonR: 12 };

function inEllipse(lat: number, lon: number, e: typeof CONTINENTS[number]) {
  let dLon = lon - e.lon;
  if (dLon > 180) dLon -= 360;
  if (dLon < -180) dLon += 360;
  const nlat = (lat - e.lat) / e.latR;
  const nlon = dLon / e.lonR;
  return nlat * nlat + nlon * nlon <= 1;
}

/**
 * Builds the dotted continents: positions on the sphere for every land cell in
 * a lat/lon grid, plus a 0/1 flag marking the India region (which glows).
 */
export function landDots(radius: number, step = 2.1) {
  const pos: number[] = [];
  const india: number[] = [];
  for (let lat = -78; lat <= 84; lat += step) {
    for (let lon = -180; lon <= 180; lon += step) {
      let land = false;
      for (const c of CONTINENTS) {
        if (inEllipse(lat, lon, c)) {
          land = true;
          break;
        }
      }
      if (!land) continue;
      // Slight jitter so the grid doesn't read as mechanical.
      const jLat = lat + (Math.sin(lat * 12.9 + lon * 4.7) * 0.5) * step;
      const jLon = lon + (Math.cos(lat * 7.3 + lon * 9.1) * 0.5) * step;
      const v = latLonToVec3(jLat, jLon, radius);
      pos.push(v.x, v.y, v.z);
      india.push(inEllipse(lat, lon, INDIA_REGION) ? 1 : 0);
    }
  }
  return {
    positions: new Float32Array(pos),
    india: new Float32Array(india),
    count: india.length,
  };
}
