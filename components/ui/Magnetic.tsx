"use client";

import { useMagnetic } from "@/lib/use-magnetic";

export default function Magnetic({
  children,
  strength,
  radius,
  className = "inline-block",
}: {
  children: React.ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}) {
  const ref = useMagnetic<HTMLSpanElement>(strength, radius);
  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
