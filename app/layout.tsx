import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import Preloader from "@/components/ui/Preloader";
import Cursor from "@/components/ui/Cursor";
import { site } from "@/lib/content";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Syne is a variable font (400–800) — no `weight` needed.
const syne = Syne({ variable: "--font-syne", subsets: ["latin"], display: "swap" });

// Base URL for resolving the OG image to an absolute link. Vercel injects
// VERCEL_PROJECT_PRODUCTION_URL (the stable production domain) at build time;
// fall back to localhost for `next dev`.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
    siteName: site.name,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0F",
  colorScheme: "dark",
};

// Runs before first paint so `.reveal` elements are hidden only when JS is
// actually available to reveal them again.
const JS_FLAG = `document.documentElement.classList.add('js')`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} h-full antialiased`}
      // The inline script below adds `js` (and Lenis adds its own classes)
      // before React hydrates, so <html>'s className legitimately differs
      // between server and client. Without this React logs a mismatch.
      suppressHydrationWarning
      // NOTE: deliberately no data-scroll-behavior — it re-enables the scroll
      // override that Next 16 removed, which fights Lenis.
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-ink">
        {/* Server-rendered so it's in the HTML, not painted after hydration. */}
        <div id="preloader" aria-hidden="true">
          <div className="bar">
            <i />
          </div>
        </div>
        <Preloader />
        <Cursor />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        {/* Cookieless and privacy-friendly; only reports once deployed to Vercel. */}
        <Analytics />
      </body>
    </html>
  );
}
