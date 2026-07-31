"use client";

import { useLayoutEffect } from "react";
import Lenis from "lenis";
import { runAdvance } from "@/lib/render-loop";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scroll } from "@/lib/scroll-store";
import { bindPointer } from "@/lib/pointer-store";

/** Module-level handle so nav links can drive Lenis without prop drilling. */
let lenisRef: Lenis | null = null;

export function scrollToSection(target: string | HTMLElement) {
  if (lenisRef) lenisRef.scrollTo(target, { offset: -80 });
  else if (typeof target === "string") {
    document.querySelector(target)?.scrollIntoView();
  }
}

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scroll.reduced = reduced;

    const lenis = new Lenis({
      // GSAP's ticker is the single clock — never let Lenis run its own rAF.
      autoRaf: false,
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduced,
      // syncTouch feels wrong on iOS; native inertia is better there.
      syncTouch: false,
    });
    lenisRef = lenis;

    // Lenis runs in default (window-scroll) mode, so ScrollTrigger's normal
    // scroller works and no scrollerProxy is needed. Wrapper mode would
    // require one and is the main source of bugs in this setup.
    lenis.on("scroll", ScrollTrigger.update);

    // gsap.ticker → lenis.raf → (lenis emits scroll) → ScrollTrigger.update
    //   → advance() → useFrame → render.  One clock, zero frame lag.
    // runAdvance is a no-op until Scene registers (tier "none", or before the
    // lazy chunk lands) — see lib/render-loop.ts.
    const tick = (time: number) => {
      const ms = time * 1000; // ticker time is SECONDS; both callees want ms
      lenis.raf(ms);
      runAdvance(ms);
    };
    gsap.ticker.add(tick);
    // Catch-up after a stall desyncs scroll position from the scene.
    gsap.ticker.lagSmoothing(0);

    // Global progress → plain mutable store. ScrollTrigger writes here and
    // nowhere else; useFrame is the sole writer to Object3D properties.
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 0,
      end: "max",
      onUpdate: (self) => {
        scroll.progress = self.progress;
        scroll.velocity = self.getVelocity();
        // Hero-local progress: 0 at the top, 1 once a full viewport has passed.
        scroll.heroProgress = Math.min(1, self.scroll() / window.innerHeight);
      },
    });

    const unbindPointer = bindPointer();

    // Triggers measured before layout settles are off by hundreds of px — but
    // only on a cold cache, so it passes local testing and breaks in the wild.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    window.addEventListener("preloader:done", refresh);

    // Don't burn battery or accumulate a time jump while hidden.
    const onVisibility = () => {
      if (document.hidden) gsap.ticker.sleep();
      else gsap.ticker.wake();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      gsap.ticker.remove(tick);
      lenis.off("scroll", ScrollTrigger.update);
      st.kill();
      lenis.destroy();
      lenisRef = null;
      unbindPointer();
      window.removeEventListener("preloader:done", refresh);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <>{children}</>;
}
