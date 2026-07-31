import Section from "@/components/ui/Section";
import { RevealText, Reveal } from "@/components/ui/RevealText";
import { testimonials, proof } from "@/lib/content";

function Stars() {
  return (
    <span aria-label="5 out of 5 stars" className="text-accent">
      {"★★★★★"}
    </span>
  );
}

export default function Testimonials() {
  // Nothing to show and nothing to verify — render nothing rather than an
  // empty section. Paste reviews into lib/content.ts and it appears.
  if (testimonials.length === 0 && !proof.profileUrl) return null;

  return (
    <Section id="testimonials" label="What clients say">
      <h2 className="text-display display">
        <RevealText as="span" text="Real Clients. Real Results." stagger={0.06} />
      </h2>

      {/* Verifiable proof bar — the ratings claim in the hero is only worth
          anything if a stranger can click through and check it. */}
      <Reveal>
        <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4 rounded-card border border-line bg-surface px-8 py-6">
          <span className="flex items-baseline gap-2">
            <Stars />
            <span className="display text-xl">{proof.rating}</span>
          </span>
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted">
            {proof.jobSuccess} Job Success
          </span>
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted">
            {proof.badge}
          </span>
          {proof.profileUrl ? (
            <a
              href={proof.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-accent transition-opacity duration-300 hover:opacity-70"
            >
              Verify on Upwork <span aria-hidden>→</span>
            </a>
          ) : null}
        </div>
      </Reveal>

      {testimonials.length > 0 ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={(i % 2) * 0.08}>
              <figure className="flex h-full flex-col rounded-card border border-line bg-surface p-9 lg:p-11">
                <Stars />
                <blockquote className="mt-6 text-lg leading-relaxed text-ink">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-auto pt-8">
                  <span className="block border-t border-line pt-6 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-faint">
                    {t.name} · {t.role}
                    {t.company ? ` · ${t.company}` : ""}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      ) : null}
    </Section>
  );
}
