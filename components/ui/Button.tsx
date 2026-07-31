import Link from "next/link";

type Variant = "primary" | "ghost";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-control px-6 py-3.5 font-mono text-xs uppercase tracking-[0.14em] whitespace-nowrap transition-colors duration-300 ease-expo focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-bg hover:bg-ink",
  ghost: "border border-line-strong text-ink hover:border-accent hover:text-accent",
};

interface Common {
  variant?: Variant;
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

const cx = (variant: Variant = "primary", className = "") =>
  `${base} ${variants[variant]} ${className}`;

export default function Button(props: LinkProps | ButtonProps) {
  // `"href" in props` narrows the union; a truthiness check on props.href does
  // not, which is what the previous shape got wrong.
  if ("href" in props && props.href) {
    const { variant, className, children, href, ...rest } = props;
    const external = /^https?:/.test(href);
    return (
      <Link
        href={href}
        className={cx(variant, className)}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  const { variant, className, children, href, ...rest } = props as ButtonProps;
  return (
    <button className={cx(variant, className)} {...rest}>
      {children}
    </button>
  );
}
