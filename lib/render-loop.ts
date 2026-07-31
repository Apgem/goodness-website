/**
 * Indirection between the GSAP ticker and R3F's `advance()`.
 *
 * SmoothScrollProvider is in the main bundle and must drive the 3D render, but
 * importing `advance` from @react-three/fiber directly there would pull all of
 * three.js into the initial chunk and defeat the `dynamic(ssr: false)` split on
 * Scene — every visitor would download the 3D stack, including the ones whose
 * tier is "none".
 *
 * Instead Scene (inside the lazy chunk) registers its advance fn here on mount,
 * and the provider calls through this no-op-until-registered slot.
 */
type Advance = (ms: number) => void;

let current: Advance | null = null;

export const setAdvance = (fn: Advance | null) => {
  current = fn;
};

export const runAdvance = (ms: number) => {
  current?.(ms);
};
