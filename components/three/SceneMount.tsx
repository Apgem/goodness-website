"use client";

import dynamic from "next/dynamic";
import { useRenderTier } from "@/lib/use-render-tier";
import Fallback2D from "./Fallback2D";

// `ssr: false` is not supported in a Server Component in Next 16 — that's the
// entire reason this thin client wrapper exists. app/page.tsx stays a Server
// Component so metadata works and the copy is server-rendered for LCP.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function SceneMount() {
  const tier = useRenderTier();

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    >
      {/* tier === null while undetermined (first paint) — render the CSS
          fallback so there's never an empty black frame. */}
      {tier === null || tier === "none" ? (
        <Fallback2D />
      ) : (
        <Scene tier={tier} />
      )}
    </div>
  );
}
