"use client";

import { RevealText, Reveal } from "@/components/ui/RevealText";
import { FlipWords } from "@/components/ui/flip-words";
import { ButtonWithIcon } from "@/components/ui/button-with-icon";
import Magnetic from "@/components/ui/Magnetic";
import { scrollToSection } from "@/components/providers/SmoothScrollProvider";
import { hero, site } from "@/lib/content";

export default function Hero() {
  return (
    <section
      id="top"
      // 100dvh, not 100vh — iOS URL-bar collapse otherwise leaves a gap.
      className="relative flex min-h-[100dvh] items-center overflow-hidden pt-28 pb-20"
    >
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />

      {/* Text is held to the left half on wide screens — the hero video
          occupies the right, offset to viewport*0.24 in HeroVideo. */}
      <div className="relative z-20 mx-auto w-full max-w-[88rem] px-6 md:px-10 lg:max-w-[88rem] lg:pr-[42%]">
        <Reveal delay={1.0} y={14}>
          <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/60 px-4 py-2 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent)]" />
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted">
              {hero.badge}
            </span>
          </span>
        </Reveal>

        <h1 className="mt-9 max-w-[18ch] text-hero display">
          <Reveal as="span" delay={1.05} y={14} className="block">
            {hero.headlineLead} <FlipWords words={hero.audiences} className="text-accent" />
          </Reveal>
          <RevealText as="span" text={hero.headlineSecondLine} delay={1.15} className="block" />
          <RevealText
            as="span"
            text={hero.headlineAccent}
            delay={1.25}
            className="block text-accent"
          />
        </h1>

        <Reveal delay={1.5}>
          <p className="mt-10 max-w-[52ch] text-base leading-relaxed text-muted md:text-lg">
            {hero.sub}
          </p>
        </Reveal>

        <Reveal delay={1.6}>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Magnetic strength={0.4}>
              <a
                href={site.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-control bg-accent px-7 py-4 font-mono text-xs uppercase tracking-[0.14em] text-bg transition-colors duration-300 ease-expo hover:bg-ink"
              >
                {hero.ctaPrimary}
              </a>
            </Magnetic>

            <Magnetic strength={0.3}>
              <ButtonWithIcon onClick={() => scrollToSection("#portfolio")}>
                {hero.ctaSecondary}
              </ButtonWithIcon>
            </Magnetic>
          </div>
        </Reveal>

        <Reveal delay={1.75}>
          <ul className="mt-16 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-line pt-7">
            {hero.trust.map((item) => (
              <li
                key={item}
                className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-faint"
              >
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
