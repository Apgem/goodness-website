"use client";

import { useEffect, useState } from "react";
import { Canvas, advance } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import HeroVideo from "./HeroVideo";
import GLSLHills from "./GLSLHills";
import { setAdvance } from "@/lib/render-loop";
import { TIER_SETTINGS, type RenderTier } from "@/lib/use-render-tier";

export default function Scene({ tier }: { tier: Exclude<RenderTier, "none"> }) {
  const settings = TIER_SETTINGS[tier];
  const [dprMax, setDprMax] = useState(settings.dpr[1]);

  // Hand the ticker in SmoothScrollProvider something to call. Registering
  // here — inside the lazily-imported chunk — is what keeps three.js out of
  // the initial bundle.
  useEffect(() => {
    setAdvance(advance);
    return () => setAdvance(null);
  }, []);

  return (
    <Canvas
      // Rendering is driven exclusively by advance() from the GSAP ticker in
      // SmoothScrollProvider, so scroll position and the shader are always in
      // the same frame. If this ever paints blank, switch to "always" and read
      // scroll.progress from the store — the 1-frame lag is invisible because
      // every value is damped anyway.
      frameloop="never"
      dpr={[settings.dpr[0], dprMax]}
      camera={{ position: [0, 0, 9], fov: 45, near: 0.1, far: 100 }}
      gl={{
        antialias: false, // pointless for additive points, costs real ms
        powerPreference: "high-performance",
        alpha: true,
        stencil: false,
        depth: true,
      }}
      // iOS URL-bar collapse otherwise fires a resize storm mid-scroll.
      resize={{ debounce: 200, scroll: false }}
      style={{ pointerEvents: "none" }}
    >
      <PerformanceMonitor
        onDecline={() => setDprMax((d) => Math.max(1, d - 0.25))}
      >
        <GLSLHills />
        <HeroVideo />
      </PerformanceMonitor>
    </Canvas>
  );
}
