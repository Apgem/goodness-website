"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { Reveal, RevealText } from "@/components/ui/RevealText";
import { TextReveal } from "@/components/ui/cascade-text";
import { ShinyButton } from "@/components/ui/shiny-button";
import { gsap } from "@/lib/gsap";
import { scroll } from "@/lib/scroll-store";
import { services, site } from "@/lib/content";

const PANEL_COUNT = services.items.length;

export default function Services() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const runway = runwayRef.current;
    const stage = stageRef.current;
    const panels = panelRefs.current.filter((p): p is HTMLDivElement => p !== null);
    if (!runway || !stage || panels.length !== PANEL_COUNT) return;

    const ctx = gsap.context(() => {
      if (scroll.reduced) {
        // Collapse the whole absolute-stack rig back into a normal flowing
        // list: no JS-driven layout should ever be a hard requirement for
        // reading the content, and a stack of overlapping full-screen
        // panels with no animation to separate them would otherwise leave
        // everything but the last one invisible to sighted users.
        gsap.set(runway, { height: "auto" });
        gsap.set(stage, { position: "static", height: "auto", overflow: "visible" });
        gsap.set(panels, { position: "relative", yPercent: 0, scale: 1 });
        return;
      }

      // All panels but the first start pushed below the viewport; the
      // timeline below slides each one up in turn while the panel it's
      // covering recedes (scales down, drops back visually) — real depth
      // hierarchy instead of an instant pin-swap. No brightness/opacity
      // fade on the receding panel — just the scale.
      gsap.set(panels.slice(1), { yPercent: 100 });

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
        const prev = panels[i - 1];
        tl.to(prev, { scale: 0.92 }, i - 1).to(panel, { yPercent: 0 }, i - 1);
      });
    }, runway);

    return () => ctx.revert();
  }, []);

  return (
    // Not wrapped in the shared `Section` component on purpose: the sticky
    // header below needs to share a containing block with the stage that
    // follows it, so its pin duration spans the whole scroll region and the
    // first panel — later in the DOM, above it in the stage — covers it.
    <div id="services" className="relative bg-bg pt-24 md:pt-32">
      <div className="sticky top-20 mx-auto flex w-full max-w-[88rem] flex-col gap-8 bg-bg px-6 pb-12 md:top-28 md:px-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Reveal y={12}>
            <p className="eyebrow mb-10 flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-accent" />
              {services.label}
            </p>
          </Reveal>
          <h2 className="text-display display max-w-[16ch]">
            <RevealText as="span" text={services.headline[0]} className="block" />
            <TextReveal
              as="span"
              text={services.headline[1]}
              className="block text-faint"
              delay={0.08}
            />
          </h2>
        </div>
        <Reveal>
          <p className="max-w-[32ch] font-mono text-xs uppercase leading-relaxed tracking-[0.12em] text-muted">
            {services.sub}
          </p>
        </Reveal>
      </div>

      {/* The runway is the scroll "track": its height sets how much scroll
          distance the whole sequence takes. The stage is the single sticky
          viewport-sized window; every panel lives inside it, absolutely
          stacked, and GSAP slides/scales/dims them per the timeline above —
          one sticky element total, not five independently pinned ones, which
          is what made the earlier version fragile. */}
      <div ref={runwayRef} className="relative" style={{ height: `${PANEL_COUNT * 100}dvh` }}>
        <div ref={stageRef} className="sticky top-0 h-dvh overflow-hidden">
          {services.items.map((service, i) => {
            const bg = ["bg-bg", "bg-surface", "bg-surface-2"][i % 3];
            return (
              <div
                key={service.title}
                ref={(node) => {
                  panelRefs.current[i] = node;
                }}
                style={{ zIndex: i + 1 }}
                className={`absolute inset-0 flex items-start overflow-hidden rounded-t-[2.5rem] pt-28 pb-32 shadow-[0_-25px_60px_-15px_rgba(0,0,0,0.55)] md:pt-32 md:pb-40 ${bg}`}
              >
                <div className="mx-auto grid w-full max-w-[88rem] gap-10 px-6 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
                  <div>
                    <span className="display text-2xl text-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-4 text-title display uppercase">{service.title}</h3>
                    <p className="mt-4 max-w-[52ch] text-base leading-snug text-muted">
                      {service.body}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {service.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-line px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-faint"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <ShinyButton href={site.calendly}>Book a Discovery Call</ShinyButton>
                    </div>
                  </div>

                  <div className="relative hidden flex-col items-center overflow-hidden lg:flex">
                    <span
                      aria-hidden
                      className="display select-none text-[6rem] leading-none text-line-strong"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Sized to always leave the numeral, image, and CTA
                        room to fit above the panel's own bottom padding —
                        the giant numeral + a tall image + the longest
                        description was tight enough to risk the button or
                        image getting clipped on shorter viewports. */}
                    {"image" in service && service.image ? (
                      <div className="relative mt-4 aspect-[16/9] w-full max-w-xs overflow-hidden rounded-2xl border border-line">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          sizes="320px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="mt-4 flex aspect-[16/9] w-full max-w-xs items-center justify-center rounded-2xl border border-line bg-surface-2">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="h-10 w-10 text-faint"
                          aria-hidden
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                          <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                          <path
                            d="M21 15l-5-5-4 4-2-2-5 5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
