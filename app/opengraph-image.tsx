import { ImageResponse } from "next/og";
import { site } from "@/lib/content";

// Rendered once at build time into a static asset.
export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Link preview card. Without this, pasting the URL into WhatsApp, LinkedIn or
 * an Upwork proposal renders a bare grey box — which is the first impression
 * for most visitors, since the link gets shared before it gets clicked.
 *
 * No custom font is loaded on purpose: Satori requires real font data (it
 * can't use system fonts), and fetching Syne at build time would add a network
 * dependency to every build for a marginal gain.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0A0F",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* accent glow, bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: -280,
            left: -180,
            width: 760,
            height: 760,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(0,212,255,0.22) 0%, rgba(0,212,255,0) 70%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>
            <span style={{ color: "#F0F0F8" }}>{site.brandMark}</span>
            <span style={{ color: "#00D4FF" }}>{site.brandAccent}</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.06,
              letterSpacing: -2.5,
              color: "#F0F0F8",
            }}
          >
            <span>Production SaaS,</span>
            <span style={{ color: "#00D4FF" }}>not prototypes.</span>
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 26,
              color: "#8888A8",
              letterSpacing: -0.3,
            }}
          >
            {/* Single expression, not `{var} text` — Satori counts the latter
                as two children and then demands display:flex on the div. */}
            {`${site.person} · Full Stack SaaS & Claude AI Development`}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            fontSize: 20,
            color: "#555570",
            borderTop: "1px solid rgba(255,255,255,0.09)",
            paddingTop: 26,
          }}
        >
          <span>Next.js</span><span>·</span>
          <span>Supabase</span><span>·</span>
          <span>Claude API</span><span>·</span>
          <span>Stripe</span><span>·</span>
          <span>RAG Agents</span>
        </div>
      </div>
    ),
    size,
  );
}
