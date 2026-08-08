"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { scroll } from "@/lib/scroll-store";

interface LiquidApp {
  liquidPlane: {
    material: { metalness: number; roughness: number };
    uniforms: { displacementScale: { value: number } };
    setImage(texture: THREE.Texture | null): void;
  };
  setRain(enabled: boolean): void;
  dispose(): void;
}

/** Renders the APGEM wordmark straight to a canvas using the site's own
 * display font, instead of a hosted image — keeps the effect self-contained
 * and on-brand rather than depending on a baked-in raster of someone else's
 * logo. */
function buildWordmarkTexture(): THREE.CanvasTexture {
  const probe = document.createElement("span");
  probe.className = "display";
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  document.body.appendChild(probe);
  const family = getComputedStyle(probe).fontFamily;
  document.body.removeChild(probe);

  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#050508";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f0f0f8";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 360px ${family}`;
  ctx.fillText("APGEM", canvas.width / 2, canvas.height / 2 + 20);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Liquid-metal displacement plane, lazily loaded: the module is a large
 * self-contained Three.js bundle and this section sits at the very bottom of
 * the page, so nothing is fetched until a visitor actually scrolls this far.
 */
export default function LiquidBrand() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root || scroll.reduced) return;

    let app: LiquidApp | null = null;
    let cancelled = false;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || app || cancelled) return;
        io.disconnect();

        void (async () => {
          const mod = await import(
            /* webpackIgnore: false */ "threejs-components/build/backgrounds/liquid1.min.js"
          );
          if (cancelled) return;
          const LiquidBackground = mod.default as (c: HTMLCanvasElement) => LiquidApp;

          await document.fonts.ready;
          if (cancelled) return;

          app = LiquidBackground(canvas);
          app.liquidPlane.setImage(buildWordmarkTexture());
          app.liquidPlane.material.metalness = 0.75;
          app.liquidPlane.material.roughness = 0.25;
          app.liquidPlane.uniforms.displacementScale.value = 5;
          app.setRain(false);
        })();
      },
      { rootMargin: "200px" },
    );
    io.observe(root);

    return () => {
      cancelled = true;
      io.disconnect();
      app?.dispose();
    };
  }, []);

  return (
    <div ref={rootRef} className="absolute inset-0">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
