"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, EASE } from "@/lib/gsap";
import { scrollToSection } from "@/components/providers/SmoothScrollProvider";
import Magnetic from "@/components/ui/Magnetic";
import { SlideTabs } from "@/components/ui/slide-tabs";
import { ShinyButton } from "@/components/ui/shiny-button";
import { nav, site } from "@/lib/content";

export default function Navbar() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: "top -40",
        end: "max",
        onUpdate: (self) => setStuck(self.scroll() > 40),
      });

      if (!scrollReduced()) {
        gsap.from(root.current, {
          yPercent: -100,
          opacity: 0,
          duration: 1,
          ease: EASE.expo,
          delay: 0.9, // let the preloader clear first
        });
      }
    }, root);
    return () => ctx.revert();
  }, []);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToSection(href);
  };

  return (
    <header
      ref={root}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ease-expo ${
        stuck
          ? "border-line bg-bg/70 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[88rem] items-center justify-between px-6 md:px-10">
        <a
          href="#top"
          onClick={go("#top")}
          className="display text-lg tracking-tight"
        >
          {site.brandMark}
          <span className="text-accent">{site.brandAccent}</span>
        </a>

        <nav className="hidden md:block">
          <SlideTabs tabs={nav} onSelect={(href, e) => go(href)(e)} />
        </nav>

        <div className="hidden md:block">
          <Magnetic strength={0.4}>
            <ShinyButton href={site.calendly}>Book a Call</ShinyButton>
          </Magnetic>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`block h-px w-6 bg-ink transition-transform duration-300 ${
              open ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-6 bg-ink transition-transform duration-300 ${
              open ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile sheet. max-h-[calc(100dvh-5rem)] (viewport minus the 5rem
          header) instead of a fixed cap — 6 items fit under max-h-96, but the
          7th (added for the qualifier) pushed "Contact" and the CTA button
          off-screen with no way to reach them. overflow-y-auto is the
          fallback if a future item list still doesn't fit a short phone. */}
      <div
        className={`overflow-hidden border-t border-line bg-bg/95 backdrop-blur-xl transition-[max-height] duration-500 ease-expo md:hidden ${
          open ? "max-h-[calc(100dvh-5rem)]" : "max-h-0 border-t-0"
        }`}
      >
        <nav className="flex max-h-[calc(100dvh-5rem)] flex-col gap-1 overflow-y-auto px-6 py-6">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={go(item.href)}
              className="display py-2 text-2xl text-ink"
            >
              {item.label}
            </a>
          ))}
          <ShinyButton href={site.calendly} className="mt-4 justify-center py-3">
            Book a Call
          </ShinyButton>
        </nav>
      </div>
    </header>
  );
}

function scrollReduced() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
