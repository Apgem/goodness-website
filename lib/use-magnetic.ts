"use client";

import { useEffect, useRef } from "react";
import { gsap, EASE } from "@/lib/gsap";

/**
 * Pulls an element toward the cursor when it gets close.
 *
 * Gated behind `(pointer: fine)` — on touch, pointer events leave the element
 * stuck offset after a tap, which looks like a rendering bug.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35, radius = 90) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // quickTo keeps a single tween alive instead of allocating one per event.
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: EASE.quick });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: EASE.quick });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      // Activation zone is the element plus `radius` of slack around it.
      const withinX = Math.abs(dx) < r.width / 2 + radius;
      const withinY = Math.abs(dy) < r.height / 2 + radius;

      if (withinX && withinY) {
        xTo(dx * strength);
        yTo(dy * strength);
      } else {
        xTo(0);
        yTo(0);
      }
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [strength, radius]);

  return ref;
}
