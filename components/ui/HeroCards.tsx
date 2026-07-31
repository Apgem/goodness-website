"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { pointer } from "@/lib/pointer-store";
import { damp } from "@/lib/math";

/**
 * Floating glassmorphic product cards in the hero — the signature "premium
 * SaaS" element from the reference. Content is drawn from Goodness's REAL
 * products (LeadCore lead scoring, InsureTrack renewal radar), so it reads as
 * genuine product surface rather than lorem dashboard chrome.
 *
 * Desktop only: on a phone these would cover his face and clutter the hero.
 * Each card drifts on its own CSS timer AND parallaxes toward the cursor at a
 * depth-dependent rate, driven off the shared gsap ticker.
 */

type Card = {
  // position within the hero, kept to the lower band + right edge so his face
  // (center-right) stays clear
  pos: string;
  depth: number; // parallax strength; larger = moves more = reads closer
  floatDur: string;
  floatDelay: string;
  floatAmp: string;
  node: React.ReactNode;
};

// All cards live in the right ~40% of the hero, clear of the left text column
// (the headline occupies the left ~58% — see Hero's lg:pr-[42%]). Keeping them
// out of that band is what stops a card ever covering the headline.
const cards: Card[] = [
  {
    pos: "right-[2%] top-[24%]",
    depth: 26,
    floatDur: "7s",
    floatDelay: "0s",
    floatAmp: "-14px",
    node: (
      <div className="w-56">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-faint">
            Lead scored
          </span>
          <span className="rounded-full bg-accent-dim px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-accent">
            High intent
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="display text-3xl text-ink">92</span>
          <span className="font-mono text-xs text-faint">/ 100</span>
        </div>
        {/* score bar */}
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-line">
          <div className="h-full w-[92%] rounded-full bg-accent" />
        </div>
        <p className="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-faint">
          Auto-routed to a human rep
        </p>
      </div>
    ),
  },
  {
    pos: "right-[15%] bottom-[30%]",
    depth: 40,
    floatDur: "5.5s",
    floatDelay: "0.8s",
    floatAmp: "-10px",
    node: (
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink">
          AI live
        </span>
        <span className="font-mono text-[0.62rem] tracking-[0.04em] text-faint">
          · 3 leads today
        </span>
      </div>
    ),
  },
  {
    pos: "right-[4%] bottom-[15%]",
    depth: 32,
    floatDur: "6.5s",
    floatDelay: "1.4s",
    floatAmp: "-16px",
    node: (
      <div className="w-52">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-faint">
          Renewal radar
        </span>
        <p className="mt-2 text-sm leading-snug text-ink">
          Client due in <span className="text-accent">30 days</span>
        </p>
        <div className="mt-3 flex gap-1">
          {[100, 68, 40].map((h, i) => (
            <span
              key={i}
              className="h-6 flex-1 rounded-sm bg-line"
              style={{
                background: `linear-gradient(to top, var(--color-accent) ${h}%, var(--color-line) ${h}%)`,
                opacity: 0.35 + i * 0.25,
              }}
            />
          ))}
        </div>
        <p className="mt-2.5 font-mono text-[0.58rem] uppercase tracking-[0.1em] text-faint">
          30 · 60 · 90 day windows
        </p>
      </div>
    ),
  },
];

export default function HeroCards() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(
      el.querySelectorAll<HTMLElement>("[data-depth]"),
    ).map((node) => ({ node, x: 0, y: 0 }));

    const tick = (_t: number, deltaMs: number) => {
      const dt = Math.min(deltaMs / 1000, 1 / 30);
      for (const it of items) {
        const depth = Number(it.node.dataset.depth);
        it.x = damp(it.x, pointer.x * depth, 0.008, dt);
        it.y = damp(it.y, -pointer.y * depth, 0.008, dt);
        // translate the wrapper; the inner element keeps its own float anim
        it.node.style.transform = `translate3d(${it.x}px, ${it.y}px, 0)`;
      }
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <div
      ref={root}
      className="pointer-events-none absolute inset-0 z-10 hidden lg:block"
      aria-hidden
    >
      {cards.map((card, i) => (
        <div
          key={i}
          data-depth={card.depth}
          className={`absolute ${card.pos} will-change-transform`}
        >
          <div
            className="float-card reveal-card rounded-2xl border border-line-strong bg-surface/70 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl"
            style={
              {
                "--float-dur": card.floatDur,
                "--float-delay": card.floatDelay,
                "--float-amp": card.floatAmp,
                animationDelay: `${card.floatDelay}`,
              } as React.CSSProperties
            }
          >
            {card.node}
          </div>
        </div>
      ))}
    </div>
  );
}
