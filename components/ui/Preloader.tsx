"use client";

import { useEffect } from "react";

/**
 * Controller only — the overlay markup is server-rendered in layout.tsx and
 * styled without JS, so there's no flash before hydration.
 *
 * Gated on real signals (fonts + a painted frame) with a hard ceiling. A
 * preloader that waits on a fixed timer is the clearest tell of a template.
 */
const CEILING_MS = 1200;

export default function Preloader() {
  useEffect(() => {
    const el = document.getElementById("preloader");
    if (!el) return;

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.classList.add("is-done");
      // ScrollTrigger must re-measure now that the overlay has released layout.
      window.dispatchEvent(new Event("preloader:done"));
    };

    const ready = Promise.all([
      document.fonts.ready,
      // Two rAFs = one actually painted frame.
      new Promise<void>((r) =>
        requestAnimationFrame(() => requestAnimationFrame(() => r())),
      ),
    ]);

    ready.then(finish);
    const ceiling = window.setTimeout(finish, CEILING_MS);

    return () => window.clearTimeout(ceiling);
  }, []);

  return null;
}
