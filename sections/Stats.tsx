import Section from "@/components/ui/Section";
import { RevealText, Reveal } from "@/components/ui/RevealText";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { stats } from "@/lib/content";

const cell =
  "group relative flex flex-col justify-between overflow-hidden rounded-card border border-line bg-surface p-7 transition-colors duration-500 ease-expo hover:border-line-strong";

export default function Stats() {
  return (
    <Section id="stats" label={stats.label}>
      <h2 className="text-display display max-w-[16ch]">
        <RevealText as="span" text={stats.headline} stagger={0.06} />
      </h2>

      {/* Bento: a 3-col grid on desktop. The accent hero card spans two rows in
          the first column; the rest tile around it. auto-rows keeps every cell
          a consistent minimum height so the mosaic stays even. */}
      <div className="mt-14 grid auto-rows-[minmax(10rem,1fr)] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Anchor card — accent, tall */}
        <Reveal className="sm:col-span-2 lg:col-span-1 lg:row-span-2">
          <SpotlightCard
            className="flex h-full flex-col justify-between overflow-hidden rounded-card border border-accent/30 p-8"
            style={{
              background:
                "linear-gradient(160deg, rgb(0 212 255 / 0.16) 0%, rgb(0 212 255 / 0.04) 46%, var(--color-surface) 100%)",
            }}
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl"
              style={{ background: "rgb(0 212 255 / 0.22)" }}
            />
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-accent">
              {stats.hero.label}
            </span>
            <div>
              <div className="display text-7xl leading-none text-ink lg:text-8xl">
                {stats.hero.value}
              </div>
              <p className="mt-5 max-w-[26ch] text-sm leading-relaxed text-muted">
                {stats.hero.note}
              </p>
            </div>
          </SpotlightCard>
        </Reveal>

        {/* Four small stat cells */}
        {stats.items.map((item, i) => (
          <Reveal key={item.label} delay={i * 0.06}>
            <SpotlightCard className={`${cell} h-full`}>
              <div className="flex items-baseline gap-1">
                <span className="display text-4xl text-ink">{item.value}</span>
                {"star" in item && item.star ? (
                  <span className="text-2xl text-accent">★</span>
                ) : null}
              </div>
              <p className="mt-4 font-mono text-[0.64rem] uppercase leading-relaxed tracking-[0.1em] text-faint">
                {item.label}
              </p>
            </SpotlightCard>
          </Reveal>
        ))}

        {/* Stack card — wide */}
        <Reveal className="sm:col-span-2">
          <SpotlightCard className={`${cell} h-full`}>
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-faint">
              {stats.stack.label}
            </span>
            <ul className="mt-5 flex flex-wrap gap-2">
              {stats.stack.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-line px-3 py-1.5 font-mono text-[0.64rem] uppercase tracking-[0.1em] text-muted transition-colors duration-500 group-hover:border-line-strong"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </SpotlightCard>
        </Reveal>

        {/* Reach card */}
        <Reveal>
          <SpotlightCard className={`${cell} h-full`}>
            <span className="display text-2xl text-ink">{stats.reach.value}</span>
            <p className="mt-4 font-mono text-[0.64rem] uppercase leading-relaxed tracking-[0.1em] text-faint">
              {stats.reach.label}
            </p>
          </SpotlightCard>
        </Reveal>
      </div>
    </Section>
  );
}
