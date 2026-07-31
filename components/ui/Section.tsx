import { Reveal } from "./RevealText";

/**
 * Shared section shell: consistent id/anchor, container width, vertical
 * rhythm, and the eyebrow label treatment.
 */
export default function Section({
  id,
  label,
  children,
  className = "",
}: {
  id: string;
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative py-section ${className}`}>
      <div className="mx-auto w-full max-w-[88rem] px-6 md:px-10">
        {label ? (
          <Reveal y={12}>
            <p className="eyebrow mb-10 flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-accent" />
              {label}
            </p>
          </Reveal>
        ) : null}
        {children}
      </div>
    </section>
  );
}
