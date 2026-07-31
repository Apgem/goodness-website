"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, EASE } from "@/lib/gsap";
import { scrollToSection } from "@/components/providers/SmoothScrollProvider";
import Magnetic from "@/components/ui/Magnetic";
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

        <nav className="hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={go(item.href)}
              className="font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors duration-300 hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Magnetic strength={0.4}>
            <a
              href={site.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-control bg-accent px-5 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-bg transition-colors duration-300 hover:bg-ink"
            >
              Book a Call
            </a>
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

      {/* Mobile sheet */}
      <div
        className={`overflow-hidden border-t border-line bg-bg/95 backdrop-blur-xl transition-[max-height] duration-500 ease-expo md:hidden ${
          open ? "max-h-96" : "max-h-0 border-t-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-6 py-6">
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
          <a
            href={site.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex justify-center rounded-control bg-accent px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-bg"
          >
            Book a Call
          </a>
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
