import Section from "@/components/ui/Section";
import { RevealText, Reveal } from "@/components/ui/RevealText";
import { services } from "@/lib/content";

export default function Services() {
  return (
    <Section id="services" label={services.label}>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="text-display display max-w-[16ch]">
          <RevealText as="span" text={services.headline[0]} className="block" />
          <RevealText
            as="span"
            text={services.headline[1]}
            className="block text-faint"
            delay={0.08}
          />
        </h2>
        <Reveal>
          <p className="max-w-[32ch] font-mono text-xs uppercase leading-relaxed tracking-[0.12em] text-muted">
            {services.sub}
          </p>
        </Reveal>
      </div>

      <div className="mt-20 grid gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-2">
        {services.items.map((service, i) => {
          // With an odd number of services the last one would leave a hole in
          // the 2-col grid, so it spans full width — and lays its content out
          // horizontally (title left, body right) rather than as one tall,
          // narrow column with the right half empty.
          const isWide =
            i === services.items.length - 1 && services.items.length % 2 === 1;

          return (
            <Reveal
              key={service.title}
              delay={(i % 2) * 0.08}
              className={`bg-surface ${isWide ? "md:col-span-2" : ""}`}
            >
              <article className="group relative h-full p-9 transition-colors duration-500 ease-expo hover:bg-surface-2 lg:p-11">
                {/* Accent rule that draws in on hover */}
                <span className="absolute left-0 top-0 h-px w-0 bg-accent transition-[width] duration-700 ease-expo group-hover:w-full" />

                {isWide ? (
                  <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                    <div>
                      <span className="display text-sm text-faint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-5 text-title display">{service.title}</h3>
                      <ul className="mt-8 flex flex-wrap gap-2">
                        {service.tags.map((tag) => (
                          <li
                            key={tag}
                            className="rounded-full border border-line px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-faint transition-colors duration-500 group-hover:border-line-strong group-hover:text-muted"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Body fills the wider right column instead of stacking. */}
                    <p className="leading-relaxed text-muted lg:text-lg lg:leading-relaxed">
                      {service.body}
                    </p>
                  </div>
                ) : (
                  <>
                    <span className="display text-sm text-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-5 text-title display">{service.title}</h3>
                    <p className="mt-5 max-w-[46ch] leading-relaxed text-muted">
                      {service.body}
                    </p>
                    <ul className="mt-8 flex flex-wrap gap-2">
                      {service.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-line px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-faint transition-colors duration-500 group-hover:border-line-strong group-hover:text-muted"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
