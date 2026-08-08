"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { scroll } from "@/lib/scroll-store";

/**
 * Scroll-scrubbed word-by-word opacity reveal — words dim until the
 * viewport scrolls past them, then light up in sequence.
 */
export function MagicText({
  text,
  className = "text-3xl font-semibold",
}: {
  text: string;
  className?: string;
}) {
  const container = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useLayoutEffect(() => {
    const el = container.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const wordEls = el.querySelectorAll<HTMLElement>("[data-word]");
      if (!wordEls.length) return;

      if (scroll.reduced) {
        gsap.set(wordEls, { opacity: 1 });
        return;
      }

      gsap.set(wordEls, { opacity: 0.2 });
      gsap.to(wordEls, {
        opacity: 1,
        stagger: 0.05,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          end: "bottom 40%",
          scrub: 0.5,
        },
      });
    }, container);

    return () => ctx.revert();
  }, [text]);

  return (
    <p ref={container} className={`flex flex-wrap gap-x-[0.3em] gap-y-1 ${className}`}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} data-word className="opacity-20">
          {word}
        </span>
      ))}
    </p>
  );
}
