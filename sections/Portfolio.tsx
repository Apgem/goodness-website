import Image from "next/image";
import Section from "@/components/ui/Section";
import { RevealText, Reveal } from "@/components/ui/RevealText";
import { portfolio } from "@/lib/content";

type Project = (typeof portfolio.projects)[number];

function Tags({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-8 flex flex-wrap gap-2">
      {items.map((tech) => (
        <li
          key={tech}
          className="rounded-full border border-line px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-faint"
        >
          {tech}
        </li>
      ))}
    </ul>
  );
}

/** The headline proof number. Renders nothing until a value is filled in
 *  content.ts, so an empty outcome never shows a bare label. */
function Outcome({ project }: { project: Project }) {
  if (!project.outcome.value) return null;
  return (
    <div className="mt-8 flex items-baseline gap-4 border-t border-line pt-8">
      <span className="display text-4xl leading-none text-accent lg:text-5xl">
        {project.outcome.value}
      </span>
      <span className="max-w-[24ch] text-sm leading-snug text-muted">
        {project.outcome.label}
      </span>
    </div>
  );
}

function Cta({ project }: { project: Project }) {
  // Hidden until the URL is filled in lib/content.ts — a dead "View Live App"
  // link is worse than no link.
  if (!project.url) return null;
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-ink transition-colors duration-300 hover:text-accent"
    >
      {project.cta}
      <span
        aria-hidden
        className="transition-transform duration-500 ease-expo group-hover:translate-x-1"
      >
        →
      </span>
    </a>
  );
}

/** Full-width card with the product shot angled off the edge. */
function Showcase({ project, flip }: { project: Project; flip: boolean }) {
  return (
    <article className="group relative overflow-hidden rounded-card border border-line bg-surface transition-colors duration-500 ease-expo hover:border-line-strong">
      <div
        className={`grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-4 ${
          flip ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div className="p-9 lg:p-12">
          {project.featured ? (
            <span className="mb-6 inline-block rounded-full border border-accent/40 bg-accent-dim px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-accent">
              Featured Build
            </span>
          ) : null}

          <h3 className="text-title display">{project.name}</h3>
          <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent">
            {project.tagline}
          </p>
          <p className="mt-7 max-w-[52ch] leading-relaxed text-muted">{project.body}</p>

          <Tags items={project.stack} />

          <Outcome project={project} />

          <p className="mt-9 border-t border-line pt-6 font-mono text-[0.65rem] uppercase leading-relaxed tracking-[0.1em] text-faint">
            {project.result}
          </p>
          <Cta project={project} />
        </div>

        {/* Screenshot: angled, glowing, bleeding off the card edge. The
            container clips it so it reads as a window into the product rather
            than a pasted-in rectangle. */}
        <div className="relative min-h-[18rem] overflow-hidden lg:min-h-[30rem]">
          <div
            className="absolute inset-0 opacity-60 blur-3xl"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgb(0 212 255 / 0.18) 0%, transparent 62%)",
            }}
          />
          <div
            className={`absolute top-1/2 w-[128%] -translate-y-1/2 transition-transform duration-700 ease-expo ${
              flip
                ? "right-[-14%] group-hover:translate-x-[-1.5%]"
                : "left-[-14%] group-hover:translate-x-[1.5%]"
            }`}
            style={{
              transform: `perspective(1800px) rotateY(${flip ? 9 : -9}deg) rotateX(3deg)`,
            }}
          >
            <Image
              src={project.image}
              alt={project.imageAlt}
              width={1800}
              height={832}
              // UI screenshots: fine text softens badly at the default 75.
              quality={90}
              sizes="(max-width: 1024px) 100vw, 70vw"
              className="w-full rounded-lg border border-line-strong shadow-2xl shadow-black/60"
            />
          </div>

          {/* Feather both edges fully into the card surface. Masking the image
              itself doesn't work here: it overflows its container by 14% a
              side, so the mask's fade zone lands outside the clipped area and
              you just see the clip. Opaque surface at 0%/100% hides it for any
              screenshot, light or dark. */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, var(--color-surface) 0%, transparent 18%, transparent 82%, var(--color-surface) 100%)",
            }}
          />
        </div>
      </div>
    </article>
  );
}

/** Compact card for projects that have no screenshot yet. */
function TextCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col rounded-card border border-line bg-surface p-9 transition-colors duration-500 ease-expo hover:border-line-strong lg:p-11">
      <h3 className="text-title display">{project.name}</h3>
      <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent">
        {project.tagline}
      </p>
      <p className="mt-7 leading-relaxed text-muted">{project.body}</p>

      <Tags items={project.stack} />

      <Outcome project={project} />

      {/* mt-auto pins the footer down so cards in a row align. */}
      <div className="mt-auto pt-9">
        <p className="border-t border-line pt-6 font-mono text-[0.65rem] uppercase leading-relaxed tracking-[0.1em] text-faint">
          {project.result}
        </p>
        <Cta project={project} />
      </div>
    </article>
  );
}

export default function Portfolio() {
  const showcases = portfolio.projects.filter((p) => p.image);
  const compact = portfolio.projects.filter((p) => !p.image);

  return (
    <Section id="portfolio" label={portfolio.label}>
      <h2 className="text-display display">
        <RevealText as="span" text={portfolio.headline} stagger={0.07} />
      </h2>
      <Reveal>
        <p className="mt-8 max-w-[46ch] leading-relaxed text-muted">{portfolio.sub}</p>
      </Reveal>

      <div className="mt-20 flex flex-col gap-6">
        {showcases.map((project, i) => (
          <Reveal key={project.name}>
            {/* Alternate sides so two stacked showcases don't read as a column. */}
            <Showcase project={project} flip={i % 2 === 1} />
          </Reveal>
        ))}

        {compact.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {compact.map((project, i) => (
              <Reveal key={project.name} delay={(i % 2) * 0.09}>
                <TextCard project={project} />
              </Reveal>
            ))}
          </div>
        ) : null}
      </div>
    </Section>
  );
}
