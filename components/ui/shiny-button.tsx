import Link from "next/link";

const base =
  "shiny-btn inline-flex items-center rounded-full px-5 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-ink";

interface Common {
  className?: string;
  children: React.ReactNode;
}

type LinkProps = Common &
  Omit<React.ComponentPropsWithoutRef<typeof Link>, "className" | "children"> & {
    href: string;
  };

type ButtonProps = Common &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: never;
  };

export function ShinyButton(props: LinkProps | ButtonProps) {
  if ("href" in props && props.href) {
    const { className = "", children, href, ...rest } = props;
    const external = /^https?:/.test(href);
    return (
      <Link
        href={href}
        className={`${base} ${className}`}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        <span className="relative z-10">{children}</span>
      </Link>
    );
  }

  const { className = "", children, href, ...rest } = props as ButtonProps;
  return (
    <button className={`${base} ${className}`} {...rest}>
      <span className="relative z-10">{children}</span>
    </button>
  );
}
