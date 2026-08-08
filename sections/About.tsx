import Section from "@/components/ui/Section";
import { RevealText } from "@/components/ui/RevealText";
import { MagicText } from "@/components/ui/magic-text";
import { about } from "@/lib/content";

export default function About() {
  return (
    <Section id="about" label={about.label}>
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <h2 className="text-display display lg:sticky lg:top-28 lg:self-start">
          <RevealText as="span" text={about.headline} stagger={0.05} />
        </h2>

        <div className="max-w-[62ch] space-y-8">
          {about.body.map((para, i) => (
            <MagicText
              key={i}
              text={para}
              className="text-base font-normal leading-relaxed text-muted md:text-lg"
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
