"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { scroll } from "@/lib/scroll-store";

/**
 * Cycles through a word list in place, letters blurring/sliding out then
 * back in. Built on the site's own GSAP setup (not framer-motion) to stay
 * consistent with every other reveal in the codebase.
 */
export function FlipWords({
  words,
  duration = 2600,
  className = "",
}: {
  words: readonly string[];
  duration?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const wordRef = useRef<HTMLSpanElement>(null);

  // Advance to the next word: animate the current letters out, then swap.
  useEffect(() => {
    if (scroll.reduced || words.length < 2) return;

    const id = setTimeout(() => {
      const el = wordRef.current;
      const letters = el?.querySelectorAll<HTMLElement>("[data-letter]");
      if (!letters?.length) {
        setIndex((i) => (i + 1) % words.length);
        return;
      }
      gsap.to(letters, {
        opacity: 0,
        y: -10,
        filter: "blur(6px)",
        duration: 0.25,
        ease: "power2.in",
        stagger: 0.015,
        onComplete: () => setIndex((i) => (i + 1) % words.length),
      });
    }, duration);

    return () => clearTimeout(id);
  }, [index, duration, words.length]);

  // Animate the newly-set word's letters in.
  useEffect(() => {
    const el = wordRef.current;
    if (!el) return;

    const letters = el.querySelectorAll<HTMLElement>("[data-letter]");
    const ctx = gsap.context(() => {
      if (scroll.reduced) {
        gsap.set(letters, { opacity: 1, y: 0, filter: "blur(0px)" });
        return;
      }
      gsap.fromTo(
        letters,
        { opacity: 0, y: 12, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.025,
        },
      );
    }, wordRef);

    return () => ctx.revert();
  }, [index]);

  const current = words[index];

  return (
    <span ref={wordRef} className={`relative inline-flex ${className}`}>
      {current.split("").map((letter, i) => (
        <span key={`${current}-${i}`} data-letter className="inline-block whitespace-pre">
          {letter}
        </span>
      ))}
    </span>
  );
}
