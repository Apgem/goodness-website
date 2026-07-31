import Section from "@/components/ui/Section";
import { RevealText, Reveal } from "@/components/ui/RevealText";
import { process } from "@/lib/content";

export default function Process() {
  return (
    <Section id="process" label={process.label}>
      <h2 className="text-display display max-w-[16ch]">
        <RevealText as="span" text={process.headline[0]} className="block" />
        <RevealText
          as="span"
          text={process.headline[1]}
          className="block text-accent"
          delay={0.08}
        />
      </h2>

      <div className="relative mt-24">
        {/* Connecting rule behind the steps — horizontal on desktop, vertical
            on mobile where the steps stack. */}
        <span
          aria-hidden
          className="absolute left-0 top-6 hidden h-px w-full bg-line lg:block"
        />
        <span
          aria-hidden
          className="absolute left-3 top-0 h-full w-px bg-line lg:hidden"
        />

        <ol className="grid gap-14 lg:grid-cols-4 lg:gap-8">
          {process.steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.1}>
              <li className="relative pl-12 lg:pl-0">
                <span className="absolute left-0 top-0 grid h-6 w-6 place-items-center rounded-full border border-accent bg-bg font-mono text-[0.6rem] text-accent lg:relative lg:mb-8">
                  {i + 1}
                </span>

                <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-faint lg:mt-0">
                  {step.when}
                </p>
                <h3 className="mt-3 text-2xl display">{step.title}</h3>
                <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-muted">
                  {step.body}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
