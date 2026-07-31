import Image from "next/image";

/**
 * No-WebGL / reduced-motion path. This has to look deliberate, not broken —
 * it's what reduced-motion users and older GPUs see for the whole visit.
 *
 * Not a client component: it's pure CSS with no hooks, so it can render on the
 * server and fill the first paint while the tier probe resolves.
 */
export default function Fallback2D() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* Soft accent glows echoing where the particle sphere would sit. */}
      <div
        className="absolute left-1/2 top-[38%] h-[52vmax] w-[52vmax] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgb(0 212 255 / 0.16) 0%, rgb(0 212 255 / 0.05) 42%, transparent 68%)",
        }}
      />
      <div
        className="absolute -left-[10vmax] bottom-[-14vmax] h-[42vmax] w-[42vmax] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgb(0 212 255 / 0.10) 0%, transparent 65%)",
        }}
      />

      {/* Vignette so the page content keeps contrast against the glow. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 40%, var(--color-bg) 100%)",
        }}
      />

      {/* Poster frame of the hero video (already matted, transparent-ish on
          black) so reduced-motion and no-WebGL visitors still get the portrait
          rather than an empty gradient. */}
      <Image
        src="/hero-poster.jpg"
        alt=""
        width={906}
        height={716}
        priority={false}
        className="absolute bottom-0 right-[6%] hidden max-h-[72vh] w-auto opacity-90 lg:block"
        style={{ maskImage: "linear-gradient(to bottom, #000 78%, transparent 100%)" }}
      />
    </div>
  );
}
