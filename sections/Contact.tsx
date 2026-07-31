import Section from "@/components/ui/Section";
import { RevealText, Reveal } from "@/components/ui/RevealText";
import ContactForm from "@/components/ui/ContactForm";
import { contact, site } from "@/lib/content";

const options = [
  {
    label: "Book a Discovery Call",
    sub: "30 minutes. Free. No pitch.",
    cta: "Book on Calendly",
    href: site.calendly,
  },
  {
    label: "WhatsApp me directly",
    sub: "For quick questions or urgent projects.",
    cta: "Chat on WhatsApp",
    href: site.whatsapp,
  },
  {
    label: "Email me directly",
    sub: site.email,
    cta: "Send an email",
    href: `mailto:${site.email}`,
  },
];

export default function Contact() {
  return (
    <Section id="contact" label={contact.label}>
      <h2 className="text-display display max-w-[16ch]">
        <RevealText as="span" text={contact.headline} stagger={0.06} />
      </h2>
      <Reveal>
        <p className="mt-8 max-w-[52ch] leading-relaxed text-muted">
          {contact.sub}
        </p>
      </Reveal>

      {/* Form gets the larger column — a contact form squeezed into a quarter
          of the row converts badly, whatever the spec's card grid implied. */}
      <div className="mt-20 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <div className="rounded-card border border-line bg-surface p-9 lg:p-11">
            <h3 className="mb-8 font-mono text-xs uppercase tracking-[0.14em] text-muted">
              Send me a message · I reply within 24 hours
            </h3>
            <ContactForm />
          </div>
        </Reveal>

        <div className="flex flex-col gap-6">
          {options.map((option, i) => (
            <Reveal key={option.label} delay={i * 0.08} className="flex-1">
              <a
                href={option.href}
                {...(option.href.startsWith("mailto:")
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
                className="group flex h-full flex-col justify-between rounded-card border border-line bg-surface p-9 transition-colors duration-500 ease-expo hover:border-accent/40 hover:bg-surface-2"
              >
                <div>
                  <h3 className="text-xl display">{option.label}</h3>
                  <p className="mt-3 text-sm text-muted">{option.sub}</p>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-accent">
                  {option.cta}
                  <span
                    aria-hidden
                    className="transition-transform duration-500 ease-expo group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
