"use client";

import { useSyncExternalStore } from "react";

export type RenderTier = "high" | "low" | "none";

export interface TierSettings {
  particles: number;
  dpr: [number, number];
  octaves: number;
  backdrop: boolean;
  pointSize: number;
}

export const TIER_SETTINGS: Record<Exclude<RenderTier, "none">, TierSettings> = {
  high: { particles: 65_000, dpr: [1, 1.75], octaves: 3, backdrop: true, pointSize: 2.0 },
  // Fewer but larger points read as denser, not sparser — don't just cut count.
  low: { particles: 14_000, dpr: [1, 1], octaves: 1, backdrop: false, pointSize: 3.0 },
};

interface Nav {
  hardwareConcurrency?: number;
  deviceMemory?: number;
}

export function detectTier(): RenderTier {
  if (typeof window === "undefined") return "none";

  // ?nogl=1 forces the fallback so it can actually be reviewed.
  if (new URLSearchParams(window.location.search).has("nogl")) return "none";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "none";

  let gl: RenderingContext | null = null;
  try {
    const c = document.createElement("canvas");
    gl = c.getContext("webgl2") ?? c.getContext("webgl");
    // Release the probe context immediately — browsers cap total contexts and
    // an abandoned one counts against that budget.
    const lose = (gl as WebGLRenderingContext | null)
      ?.getExtension("WEBGL_lose_context");
    lose?.loseContext();
  } catch {
    return "none";
  }
  if (!gl) return "none";

  const nav = navigator as Navigator & Nav;
  const cores = nav.hardwareConcurrency ?? 4;
  const mem = nav.deviceMemory;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 768;

  if (cores <= 4 || (mem !== undefined && mem <= 4) || (coarse && narrow)) {
    return "low";
  }
  return "high";
}

// Probed once per page load. useSyncExternalStore's getSnapshot must return a
// referentially stable value or React loops forever, hence the cache.
let cached: RenderTier | null = null;
const subscribe = () => () => {};
const getSnapshot = () => (cached ??= detectTier());
const getServerSnapshot = () => null;

/**
 * `null` on the server and during hydration, then the real tier. Expressed as
 * an external store rather than setState-in-effect: it's a read of a browser
 * capability, not React state, and this avoids a cascading render.
 *
 * The null phase is exactly why Scene must be mounted with `ssr: false`.
 */
export function useRenderTier(): RenderTier | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
