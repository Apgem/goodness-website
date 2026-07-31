import Section from "@/components/ui/Section";
import { RevealText, Reveal } from "@/components/ui/RevealText";
import { faq } from "@/lib/content";

/**
 * Native <details>/<summary> rather than a JS accordion: it works before
 * hydration, is keyboard accessible and screen-reader correct for free, and
 * the content stays in the HTML for search engines.
 */
export default function Faq() {
  return (
    <Section id="faq" label={faq.label}>
      <h2 className="text-display display max-w-[18ch]">
        <RevealText as="span" text={faq.headline} stagger={0.05} />
      </h2>

      <div className="mt-16 max-w-[62rem]">
        {faq.items.map((item, i) => (
          <Reveal key={item.q} delay={i * 0.04}>
            <details className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-8 py-7 transition-colors duration-300 hover:text-accent [&::-webkit-details-marker]:hidden">
                <span className="text-lg leading-snug font-display font-semibold tracking-tight md:text-xl">
                  {item.q}
                </span>
                {/* Plus that rotates into a minus when open. */}
                <span
                  aria-hidden
                  className="relative mt-2 h-3 w-3 shrink-0 text-accent"
                >
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                  <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform duration-400 ease-expo group-open:rotate-90 group-open:opacity-0" />
                </span>
              </summary>
              <p className="max-w-[68ch] pb-8 leading-relaxed text-muted">
                {item.a}
              </p>
            </details>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
