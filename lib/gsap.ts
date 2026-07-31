"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Single registration point. Registering more than once is harmless but
// scattering the call makes it easy to forget in a new file and get a silent
// no-op ScrollTrigger.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/** Shared easing vocabulary. Vary these per section — uniform easing across a
 *  whole page is what makes an otherwise good build feel mechanical. */
export const EASE = {
  /** long, luxurious settle — hero + section headlines */
  expo: "expo.out",
  /** default reveal */
  power: "power3.out",
  /** short UI feedback (buttons, nav) */
  quick: "power2.out",
} as const;
