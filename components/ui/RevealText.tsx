"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, EASE } from "@/lib/gsap";
import { scroll } from "@/lib/scroll-store";

/**
 * Word-by-word masked reveal for display headings.
 *
 * Word-level rather than line-level on purpose: real line splitting requires
 * measuring after fonts load and re-measuring on every resize, and gets it
 * wrong often enough to be a liability. Masked words read nearly identically.
 */
export function RevealText({
  text,
  className = "",
  as: Tag = "span",
  delay = 0,
  stagger = 0.055,
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

    // gsap.context + revert is mandatory: React 19 StrictMode double-mounts
    // effects in dev and would otherwise leave a duplicate ScrollTrigger behind.
    const ctx = gsap.context(() => {
      const words = el.querySelectorAll<HTMLElement>("[data-word]");
      if (!words.length) return;

      if (scroll.reduced) {
        gsap.set(words, { yPercent: 0, opacity: 1 });
        gsap.set(el, { opacity: 1 });
        return;
      }

      gsap.set(el, { opacity: 1 });
      gsap.from(words, {
        yPercent: 118,
        duration: 1.1,
        ease: EASE.expo,
        stagger,
        delay,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    }, root);

    return () => ctx.revert();
  }, [text, delay, stagger]);

  return (
    <Tag ref={root as never} className={`reveal ${className}`}>
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden py-[0.06em] align-bottom">
          <span data-word className="inline-block will-change-transform">
            {word}
          </span>
          {/* Non-breaking space keeps word spacing inside inline-block spans. */}
          {i < text.split(" ").length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}

/** Generic fade-and-rise for blocks (paragraphs, cards, rows). */
export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 26,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (scroll.reduced) {
        gsap.set(el, { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: EASE.power,
          delay,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [delay, y]);

  return (
    <div ref={root} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
