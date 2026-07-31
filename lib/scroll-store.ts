/**
 * Plain mutable scroll state. Deliberately NOT React state — this is written
 * every frame and read inside useFrame; going through React would re-render
 * the tree 60x/second.
 *
 * OWNERSHIP RULE: ScrollTrigger writes here and nowhere else. It must never
 * write directly to an Object3D property — useFrame is the sole writer for
 * those. Two writers on one property produces jitter that reads as jank and
 * gets misdiagnosed as a performance problem.
 */
export const scroll = {
  /** 0..1 over the whole document */
  progress: 0,
  /**
   * 0..1 across the FIRST VIEWPORT only.
   *
   * Anything tied to leaving the hero must use this, not `progress`. The page
   * is ~8000px tall, so scrolling clean past the hero moves `progress` by only
   * ~0.05 — driving the hero video's fade from it left him sitting at ~98%
   * opacity on top of the About copy.
   */
  heroProgress: 0,
  /** px/sec, signed. Useful for stretch/turbulence on fast flicks. */
  velocity: 0,
  /** set once by SmoothScrollProvider from prefers-reduced-motion */
  reduced: false,
};

export type ScrollStore = typeof scroll;
