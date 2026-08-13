"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Section from "@/components/ui/Section";
import { RevealText, Reveal } from "@/components/ui/RevealText";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { portfolio } from "@/lib/content";

type Project = (typeof portfolio.projects)[number];

const PANEL_COUNT = portfolio.projects.length;
// Cycled per panel instead of the reference's loud flat colors — keeps the
// story-scroll interaction but stays inside the site's own dark palette.
const PANEL_BG = ["bg-bg", "bg-surface", "bg-surface-2"] as const;
// Subtler than the 30° in the reference: these panels carry real product
// screenshots and fine print, and a bold spin over that reads as gimmicky
// rather than premium.
const ROTATE_FROM = 14;

function Tags({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-7 flex flex-wrap gap-2">
      {items.map((tech) => (
        <li
          key={tech}
          className="rounded-full border border-line px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-faint"
        >
          {tech}
        </li>
      ))}
    </ul>
  );
}

function Outcome({ project }: { project: Project }) {
  if (!project.outcome.value) return null;
  return (
    <div className="mt-8 flex items-baseline gap-4 border-t border-line pt-7">
      <span className="display text-4xl leading-none text-accent lg:text-5xl">
        {project.outcome.value}
      </span>
      <span className="max-w-[24ch] text-sm leading-snug text-muted">
        {project.outcome.label}
      </span>
    </div>
  );
}

function Cta({ project }: { project: Project }) {
  if (!project.url) return null;
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-ink transition-colors duration-300 hover:text-accent"
    >
      {project.cta}
      <span aria-hidden className="transition-transform duration-500 ease-expo group-hover:translate-x-1">
        →
      </span>
    </a>
  );
}

/**
 * One story panel. On mobile it's just a normal stacked card (no min-height,
 * no absolute positioning — plain flow, nothing to clip). At `lg` and above,
 * GSAP takes over: the panel becomes a full-viewport layer inside the sticky
 * stage below, and its `inner` wrapper starts tilted and rotates flat as it
 * arrives, covering the previous panel.
 */
function Panel({
  project,
  index,
  flip,
  panelRef,
  innerRef,
}: {
  project: Project;
  index: number;
  flip: boolean;
  panelRef: (el: HTMLDivElement | null) => void;
  innerRef: (el: HTMLDivElement | null) => void;
}) {
  const bg = PANEL_BG[index % PANEL_BG.length];
  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      ref={panelRef}
      style={{ zIndex: index + 1 }}
      className={`relative mb-6 overflow-hidden rounded-2xl border border-line last:mb-0 lg:absolute lg:inset-0 lg:m-0 lg:flex lg:items-center lg:rounded-none lg:border-0 ${bg}`}
    >
      <div
        ref={innerRef}
        className={`mx-auto flex w-full max-w-[88rem] flex-col gap-10 px-6 py-12 md:px-10 lg:flex-row lg:items-center lg:gap-16 lg:py-24 ${
          flip ? "lg:flex-row-reverse" : ""
        }`}
        style={{ transformOrigin: "bottom left" }}
      >
        <div className="lg:w-[46%]">
          {project.featured ? (
            <span className="mb-6 inline-block rounded-full border border-accent/40 bg-accent-dim px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-accent">
              Featured Build
            </span>
          ) : null}

          <span className="font-mono text-xs uppercase tracking-[0.2em] text-faint">
            {num} — {project.tagline}
          </span>
          <h3 className="mt-5 text-display display">{project.name}</h3>
          <p className="mt-7 max-w-[52ch] leading-relaxed text-muted">{project.body}</p>

          <Tags items={project.stack} />
          <Outcome project={project} />

          <p className="mt-9 border-t border-line pt-6 font-mono text-[0.65rem] uppercase leading-relaxed tracking-[0.1em] text-faint">
            {project.result}
          </p>
          <Cta project={project} />
        </div>

        <div className="relative min-h-[16rem] flex-1 overflow-hidden rounded-2xl border border-line lg:min-h-[26rem]">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              quality={90}
              sizes="(max-width: 1024px) 100vw, 54vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-surface-2">
              <span className="display select-none text-[7rem] text-line-strong lg:text-[9rem]">
                {num}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const runway = runwayRef.current;
    const panels = panelRefs.current.filter((p): p is HTMLDivElement => p !== null);
    if (!runway || panels.length !== PANEL_COUNT) return;

    // Same architecture as the Services stage: one sticky viewport-sized
    // window plus a single scrubbed timeline, rather than N independent
    // ScrollTrigger pins. An earlier version of this used raw GSAP `pin` per
    // panel alongside a separate rotation tween on the same trigger element —
    // the two fought each other (cropped content, panels that scrolled
    // instead of holding). This mirrors the proven, already-shipped pattern
    // instead of reinventing pinning.
    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)": () => {
          gsap.set(runway, { height: `${PANEL_COUNT * 100}dvh` });

          // Static z-index means the last panel sits on top of every earlier
          // one unconditionally — nothing about scroll position affects
          // stacking order. Rotation alone doesn't stop it from covering the
          // whole stack from the very start, so every panel but the first
          // ALSO starts pushed fully below the viewport (yPercent: 100) and
          // only slides up into place during its own scroll segment — same
          // trick Services uses, rotation is just added on top of it.
          gsap.set(panels.slice(1), { yPercent: 100 });
          panels.forEach((_panel, i) => {
            if (i === 0) return;
            const inner = innerRefs.current[i];
            if (inner) gsap.set(inner, { rotation: ROTATE_FROM });
          });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: runway,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.5,
            },
            defaults: { ease: "power2.inOut", duration: 1 },
          });

          panels.forEach((panel, i) => {
            if (i === 0) return;
            const inner = innerRefs.current[i];
            tl.to(panel, { yPercent: 0 }, i - 1);
            if (inner) tl.to(inner, { rotation: 0 }, i - 1);
          });

          return () => {
            gsap.set(runway, { clearProps: "height" });
            gsap.set(panels, { clearProps: "yPercent" });
            innerRefs.current.forEach((inner) => {
              if (inner) gsap.set(inner, { clearProps: "rotation,transformOrigin" });
            });
          };
        },
      });
    }, runway);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Section id="portfolio" label={portfolio.label}>
        <h2 className="text-display display">
          <RevealText as="span" text={portfolio.headline} stagger={0.07} />
        </h2>
        <Reveal>
          <p className="mt-8 max-w-[46ch] leading-relaxed text-muted">{portfolio.sub}</p>
        </Reveal>
      </Section>

      <div
        ref={runwayRef}
        className="relative mx-auto mt-20 w-full max-w-[88rem] px-6 md:px-10 lg:mx-0 lg:max-w-none lg:px-0"
      >
        <div ref={stageRef} className="lg:sticky lg:top-0 lg:h-dvh lg:overflow-hidden">
          {portfolio.projects.map((project, i) => (
            <Panel
              key={project.name}
              project={project}
              index={i}
              flip={i % 2 === 1}
              panelRef={(el) => {
                panelRefs.current[i] = el;
              }}
              innerRef={(el) => {
                innerRefs.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
