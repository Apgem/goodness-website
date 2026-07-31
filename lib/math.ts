export const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Frame-rate independent damping. A fixed `lerp(a, b, 0.1)` per frame runs
 * twice as fast on a 120Hz display; this doesn't.
 *
 * @param smoothing fraction of the remaining distance left after 1 second.
 *                  ~0.001 = snappy, ~0.1 = floaty.
 * @param dt        delta seconds (second arg of useFrame)
 */
export const damp = (
  current: number,
  target: number,
  smoothing: number,
  dt: number,
) => lerp(current, target, 1 - Math.pow(smoothing, dt));

export const mapRange = (
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) => outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin);

/** Smooth 0→1 ramp over [edge0, edge1]. */
export const smoothstep = (edge0: number, edge1: number, v: number) => {
  const t = clamp((v - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};
