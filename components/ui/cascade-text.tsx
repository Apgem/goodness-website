"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, EASE } from "@/lib/gsap";
import { scroll } from "@/lib/scroll-store";

/**
 * Letter-by-letter cascade: each letter drops in from above with a random
 * tilt and a blur-to-sharp focus pull, staggered enough to read as a
 * waterfall rather than RevealText's near-simultaneous word rise. No
 * overflow-hidden mask here on purpose — the letters need room to fall
 * through visually, not slide up from behind a clipped line.
 */
export function TextReveal({
  text,
  className = "",
  as: Tag = "span",
  delay = 0,
  stagger = 0.045,
}: {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
  delay?: number;
  stagger?: number;
}) {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const letters = el.querySelectorAll<HTMLElement>("[data-letter]");
      if (!letters.length) return;

      if (scroll.reduced) {
        gsap.set(letters, { yPercent: 0, opacity: 1, rotate: 0, filter: "blur(0px)" });
        gsap.set(el, { opacity: 1 });
        return;
      }

      gsap.set(el, { opacity: 1 });
      gsap.from(letters, {
        yPercent: -220,
        opacity: 0,
        rotate: () => gsap.utils.random(-18, 18),
        filter: "blur(10px)",
        duration: 0.7,
        ease: EASE.expo,
        stagger,
        delay,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    }, root);

    return () => ctx.revert();
  }, [text, delay, stagger]);

  return (
    <Tag ref={root as never} className={`reveal ${className}`}>
      {text.split("").map((letter, i) => (
        <span key={i} data-letter className="inline-block will-change-transform">
          {letter === " " ? " " : letter}
        </span>
      ))}
    </Tag>
  );
}
