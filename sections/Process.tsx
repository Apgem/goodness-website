"use client";

import { useLayoutEffect, useRef } from "react";
import Section from "@/components/ui/Section";
import { RevealText, Reveal } from "@/components/ui/RevealText";
import { gsap } from "@/lib/gsap";
import { scroll } from "@/lib/scroll-store";
import { process } from "@/lib/content";

// Increasing top-offset per card is what makes each one stack on top of the
// last instead of just replacing it — the previous card's edge stays peeking
// out above, so the deck reads as cards, not a slideshow.
const TOP_OFFSET_REM = 1.25;

export default function Process() {
  const stackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const stack = stackRef.current;
    const cards = cardRefs.current.filter((c): c is HTMLDivElement => c !== null);
    if (!stack || cards.length < 2 || scroll.reduced) return;

    // Sticky stacking is plain CSS and needs no JS at all — only the
    // recede-into-depth polish (scale down, dim, sink back in Z) on the card
    // a new one is about to cover is driven by GSAP, scrubbed to the exact
    // scroll span where the next card is arriving.
    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        const next = cards[i + 1];
        gsap.to(card, {
          scale: 0.94,
          z: -60,
          filter: "brightness(0.6)",
          ease: "none",
          scrollTrigger: {
            trigger: next,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      });
    }, stack);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="process" label={process.label}>
      <h2 className="text-display display max-w-[16ch]">
        <RevealText as="span" text={process.headline[0]} className="block" />
        <RevealText
          as="span"
          text={process.headline[1]}
          className="block text-accent"
          delay={0.08}
        />
      </h2>

      <div
        ref={stackRef}
        className="relative mt-20 md:mt-28"
        style={{ perspective: "1600px" }}
      >
        {process.steps.map((step, i) => (
          <div
            key={step.n}
            ref={(node) => {
              cardRefs.current[i] = node;
            }}
            className="sticky mb-6 origin-top will-change-transform [backface-visibility:hidden] md:mb-8"
            style={{ top: `calc(6rem + ${i * TOP_OFFSET_REM}rem)`, zIndex: i + 1 }}
          >
            <Reveal delay={i * 0.05} y={20}>
              <div className="flex min-h-[58vh] flex-col justify-between rounded-3xl border border-line bg-surface p-8 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.65)] md:min-h-[62vh] md:p-14">
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div className="flex items-start gap-5 md:gap-7">
                    <span className="display text-4xl text-line-strong md:text-6xl">
                      {step.n}
                    </span>
                    <div>
                      <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent">
                        {step.when}
                      </p>
                      <h3 className="mt-2 text-2xl display md:text-4xl">{step.title}</h3>
                    </div>
                  </div>
                  <span className="hidden h-px flex-1 self-center bg-line md:block" />
                </div>

                <p className="mt-10 max-w-[62ch] text-base leading-relaxed text-muted md:mt-16 md:text-lg">
                  {step.body}
                </p>
              </div>
            </Reveal>
          </div>
        ))}
      </div>
    </Section>
  );
}
