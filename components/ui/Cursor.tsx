"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { gsap } from "@/lib/gsap";
import { damp } from "@/lib/math";

// A custom cursor only makes sense with a fine pointer and motion allowed.
// Cached so getSnapshot stays referentially stable.
let cached: boolean | null = null;
const subscribe = () => () => {};
const getSnapshot = () =>
  (cached ??=
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
const getServerSnapshot = () => false;

/**
 * Custom cursor: a small dot tracking 1:1 and a larger ring that lags behind.
 * The lag is the whole effect — if both track exactly it just reads as a
 * broken cursor.
 */
export default function Cursor() {
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    document.documentElement.classList.add("has-cursor");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...target };
    let hovering = false;

    const place = (el: HTMLElement | null, x: number, y: number) => {
      if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      place(dot.current, e.clientX, e.clientY);
    };

    // Grow the ring over anything interactive.
    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const next = !!t?.closest("a, button, [data-cursor-hover]");
      if (next !== hovering) {
        hovering = next;
        ring.current?.classList.toggle("is-hover", next);
      }
    };

    const tick = (_t: number, deltaMs: number) => {
      const dt = Math.min(deltaMs / 1000, 1 / 30);
      ringPos.x = damp(ringPos.x, target.x, 0.0008, dt);
      ringPos.y = damp(ringPos.y, target.y, 0.0008, dt);
      place(ring.current, ringPos.x, ringPos.y);
    };

    place(dot.current, target.x, target.y);
    place(ring.current, target.x, target.y);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    gsap.ticker.add(tick);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      gsap.ticker.remove(tick);
    };
  }, [active]);

  if (!active) return null;

  return (
    <>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-90 h-1.5 w-1.5 rounded-full bg-accent"
      />
      <div
        ref={ring}
        aria-hidden
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-90 h-9 w-9 rounded-full border border-line-strong"
      />
    </>
  );
}
