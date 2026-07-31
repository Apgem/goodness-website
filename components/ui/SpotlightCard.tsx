"use client";

import { useRef } from "react";

/**
 * Card wrapper with a neon spotlight that tracks the cursor and fades in on
 * hover. Pointer position is written to CSS custom properties (--mx/--my) that
 * a `.spotlight::before` radial gradient reads — see globals.css. Doing the
 * gradient in CSS keeps this to one cheap property write per move, no React
 * re-render.
 */
export default function SpotlightCard({
  className = "",
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={`spotlight ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
