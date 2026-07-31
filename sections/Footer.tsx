import { nav, site, footer } from "@/lib/content";

// Empty entries are TODO placeholders in lib/content.ts — filtered out so the
// footer never renders a link to nowhere.
const socials = Object.entries(site.socials).filter(([, href]) => href);

export default function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto w-full max-w-[88rem] px-6 py-16 md:px-10">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="display text-2xl">
              {site.brandMark}
              <span className="text-accent">{site.brandAccent}</span>
            </p>
            <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-faint">
              {site.person}
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted transition-colors duration-300 hover:text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {socials.length > 0 ? (
            <div className="flex gap-6">
              {socials.map(([name, href]) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted transition-colors duration-300 hover:text-accent"
                >
                  {name}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-faint">
            {footer.copyright}
          </p>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-faint">
            {footer.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
