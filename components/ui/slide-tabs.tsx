"use client";

import { useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export interface SlideTab {
  label: string;
  href: string;
}

/**
 * Pill-shaped nav bar with a solid accent capsule that slides beneath
 * whichever item is hovered. Position/size come from getBoundingClientRect,
 * animated with GSAP rather than framer-motion's layout animation — same
 * effect, one animation lib.
 */
export function SlideTabs({
  tabs,
  onSelect,
}: {
  tabs: readonly SlideTab[];
  onSelect: (href: string, e: React.MouseEvent) => void;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const cursorRef = useRef<HTMLLIElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const moveTo = (tab: SlideTab, el: HTMLElement) => {
    const cursor = cursorRef.current;
    const list = listRef.current;
    if (!cursor || !list) return;
    const listRect = list.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    gsap.to(cursor, {
      x: rect.left - listRect.left,
      width: rect.width,
      opacity: 1,
      duration: 0.35,
      ease: "power3.out",
    });
    setHovered(tab.href);
  };

  const reset = () => {
    gsap.to(cursorRef.current, { opacity: 0, duration: 0.25, ease: "power2.out" });
    setHovered(null);
  };

  return (
    <ul
      ref={listRef}
      onMouseLeave={reset}
      className="relative flex items-center rounded-full border border-line bg-surface p-1.5"
    >
      {tabs.map((tab) => (
        <li
          key={tab.href}
          onMouseEnter={(e) => moveTo(tab, e.currentTarget)}
          className="relative z-10 px-4 py-2"
        >
          <a
            href={tab.href}
            onClick={(e) => onSelect(tab.href, e)}
            className={`block whitespace-nowrap font-mono text-xs uppercase tracking-[0.14em] transition-colors duration-300 ${
              hovered === tab.href ? "text-bg" : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </a>
        </li>
      ))}
      <li
        ref={cursorRef}
        aria-hidden
        className="pointer-events-none absolute inset-y-1.5 left-0 z-0 rounded-full bg-accent opacity-0 shadow-[0_0_16px_var(--color-accent)]"
      />
    </ul>
  );
}
