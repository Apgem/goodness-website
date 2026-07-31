"use client";

/* eslint-disable react-hooks/immutability -- see note */
// This component imperatively drives a WebGL video texture: every frame it
// scrubs `video.currentTime` to the scroll position and flags
// `texture.needsUpdate` to re-upload the decoded frame. React Compiler's
// immutability rule treats the useMemo'd video/texture as pure values and
// flags these mutations, but they mutate external GPU/DOM objects by design —
// the standard react-three-fiber pattern. The rule is a false positive here.

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scroll } from "@/lib/scroll-store";
import { pointer } from "@/lib/pointer-store";
import { damp } from "@/lib/math";

// Source crop from scripts/prepare-hero-video.mjs. The file is packed
// double-height: colour on top, matte below.
const SRC_W = 906;
const SRC_H = 716;
const ASPECT = SRC_W / SRC_H;
const PLANE_H = 6.4;

const vert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const frag = /* glsl */ `
precision highp float;

uniform sampler2D uTex;
uniform float uOpacity;
uniform float uHover;
uniform vec2  uPointer;   // cursor in local plane space (-0.5..0.5)
uniform vec3  uAccent;

varying vec2 vUv;

void main() {
  // three's VideoTexture flips Y, so uv.y = 1 is the TOP of the source frame.
  // Colour lives in the top half, matte in the bottom half; the +0.5 offset is
  // the only difference between the two lookups.
  vec2 colourUv = vec2(vUv.x, vUv.y * 0.5 + 0.5);
  vec2 matteUv  = vec2(vUv.x, vUv.y * 0.5);

  vec3 col = texture2D(uTex, colourUv).rgb;
  float a  = texture2D(uTex, matteUv).r;

  // Soften the baked hard edge by a pixel or so — a 1px hard cut reads cheap.
  a = smoothstep(0.32, 0.68, a);

  // The source frame is cropped at his chest, so the plane's bottom edge is a
  // hard horizontal cut. Fade it out so he dissolves into the page instead.
  a *= smoothstep(0.0, 0.22, vUv.y);

  // Accent rim toward the cursor: subtle grade, keeps him tied to the palette
  // without recolouring his face.
  float d = distance(vUv - 0.5, uPointer);
  float prox = exp(-d * d * 6.0) * uHover;
  col = mix(col, col * 0.6 + uAccent * 0.45, prox * 0.55);

  gl_FragColor = vec4(col, a * uOpacity);
  if (gl_FragColor.a < 0.01) discard;
}
`;

export default function HeroVideo() {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const damped = useRef({ progress: 0, px: 0, py: 0, hover: 0, rx: 0, ry: 0 });

  // Plain element rather than <video> in the DOM: it's a texture source, it
  // must never be visible or focusable. Created once; then driven imperatively
  // (currentTime scrubbed, texture re-uploaded) in useFrame — see the
  // file-level eslint note above.
  const video = useMemo(() => {
    if (typeof document === "undefined") return null;
    const el = document.createElement("video");
    el.src = "/hero.mp4";
    el.loop = false; // scrubbed by scroll, not played — see useFrame
    el.muted = true; // required for the priming autoplay
    el.playsInline = true;
    el.preload = "auto";
    el.crossOrigin = "anonymous";
    return el;
  }, []);

  const texture = useMemo(() => {
    if (!video) return null;
    const t = new THREE.VideoTexture(video);
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.generateMipmaps = false;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [video]);

  useEffect(() => {
    if (!video || !texture) return;
    // The video is SCRUBBED by scroll (currentTime is driven in useFrame), not
    // played. But a never-played video decodes no frames, so its texture stays
    // black. Prime it: play just long enough to decode, then pause and rewind.
    // muted+playsInline makes the autoplay permissible; a refusal is harmless
    // because setting currentTime below still forces a decode.
    const prime = () => {
      video
        .play()
        .then(() => {
          video.pause();
          video.currentTime = 0;
        })
        .catch(() => {
          // Autoplay refused — nudge currentTime to force a first-frame decode.
          video.currentTime = 0.001;
        });
    };
    if (video.readyState >= 2) prime();
    else video.addEventListener("loadeddata", prime, { once: true });

    return () => {
      video.removeEventListener("loadeddata", prime);
      video.pause();
      video.removeAttribute("src");
      video.load();
      texture.dispose();
    };
  }, [video, texture]);

  const uniforms = useMemo(
    () => ({
      uTex: { value: texture },
      uOpacity: { value: 0 },
      uHover: { value: 0 },
      uPointer: { value: new THREE.Vector2(9, 9) },
      uAccent: { value: new THREE.Color("#00d4ff") },
    }),
    [texture],
  );

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 1 / 30);
    const d = damped.current;
    const m = material.current;
    if (!m) return;

    // Hero-local, not document-wide — see scroll.heroProgress.
    d.progress = damp(d.progress, scroll.heroProgress, 0.02, dt);
    d.px = damp(d.px, pointer.x, 0.0015, dt);
    d.py = damp(d.py, pointer.y, 0.0015, dt);
    d.hover = damp(d.hover, pointer.active ? 1 : 0, 0.05, dt);

    const { width, height } = state.viewport;
    const wide = width > 9;
    const offsetX = wide ? width * 0.24 : 0;
    const offsetY = wide ? -0.2 : height * 0.14;

    m.uniforms.uHover.value = d.hover;
    m.uniforms.uPointer.value.set(
      (d.px * width) / 2 / (PLANE_H * ASPECT) - offsetX / (PLANE_H * ASPECT),
      (d.py * height) / 2 / PLANE_H - offsetY / PLANE_H,
    );

    // --- scrub playback by scroll -------------------------------------------
    // Scroll drives the video's frame: still at the top, playing forward as you
    // scroll down, reversing as you scroll up. The video is all-keyframes so
    // each seek is instant. Map the scrub over the first ~55% of the hero
    // scroll so the whole clip plays before he drifts away and fades.
    if (video && texture && video.duration) {
      const SCRUB_END = 0.55;
      const t =
        THREE.MathUtils.clamp(d.progress / SCRUB_END, 0, 1) * video.duration;
      // Only seek on a meaningful delta — micro-seeks every frame stall decode.
      if (Math.abs(video.currentTime - t) > 1 / 48) {
        video.currentTime = t;
      }
      // Force the freshly-decoded frame onto the texture (paused videos don't
      // auto-update).
      texture.needsUpdate = true;
    }

    // Leave the hero cleanly instead of shaking apart: hold opaque through the
    // scrub, then fade before the marquee/About scrolls under him. No noise,
    // no jitter, no dispersion.
    const fade = 1 - THREE.MathUtils.smoothstep(d.progress, 0.55, 0.78);
    m.uniforms.uOpacity.value = fade;

    if (group.current) {
      // Gentle parallax tilt toward the cursor — heavily damped so it drifts.
      d.ry = damp(d.ry, d.px * 0.16, 0.004, dt);
      d.rx = damp(d.rx, -d.py * 0.1, 0.004, dt);
      group.current.rotation.y = d.ry;
      group.current.rotation.x = d.rx;

      group.current.position.x = offsetX + d.px * 0.12;
      // Rises gently as you scroll away, plus a slow idle float.
      group.current.position.y =
        offsetY + d.progress * 2.2 + Math.sin(state.clock.elapsedTime * 0.35) * 0.04;
      group.current.visible = fade > 0.005;
    }
  });

  if (!texture) return null;

  return (
    <group ref={group}>
      <mesh>
        <planeGeometry args={[PLANE_H * ASPECT, PLANE_H]} />
        <shaderMaterial
          ref={material}
          vertexShader={vert}
          fragmentShader={frag}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
