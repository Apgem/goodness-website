import { marquee } from "@/lib/content";

/**
 * Infinite scrolling strip under the hero. Keeps "Goodness Augustine" present
 * on first screen now that the logo is the APGEM brand mark.
 *
 * Pure CSS, no JS: the track holds two identical copies and translates by
 * exactly -50%, so the loop is seamless. `aria-hidden` on the duplicate stops
 * screen readers announcing everything twice.
 */
export default function Marquee() {
  const items = [...marquee, ...marquee];

  return (
    <div className="relative overflow-hidden border-y border-line bg-surface/40 py-5 select-none">
      {/* Fade the ends so items enter and leave rather than popping. */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to right, var(--color-bg) 0%, transparent 12%, transparent 88%, var(--color-bg) 100%)",
        }}
      />
      <div className="marquee-track flex w-max items-center gap-10">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-10"
            aria-hidden={i >= marquee.length}
          >
            <span
              className={`display whitespace-nowrap text-2xl md:text-3xl ${
                i % 2 === 0 ? "text-ink" : "text-faint"
              }`}
            >
              {item}
            </span>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          </div>
        ))}
      </div>
    </div>
  );
}
