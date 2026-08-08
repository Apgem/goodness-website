/**
 * Pill CTA with a dark circular arrow badge. At rest the badge sits on the
 * right and the arrow points up-right; on hover the badge slides to the
 * left and the arrow straightens to point right — one icon, just rotated,
 * so the two states are a single smooth transform rather than a swap.
 */
export function ButtonWithIcon({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative inline-flex h-14 items-center rounded-full bg-ink pl-6 pr-[4.25rem] font-mono text-xs uppercase tracking-[0.14em] text-bg transition-[padding] duration-500 ease-expo hover:pl-[4.25rem] hover:pr-6 ${className}`}
    >
      <span className="whitespace-nowrap">{children}</span>
      <span className="absolute left-[calc(100%-3.5rem)] top-1 bottom-1 aspect-square rounded-full bg-bg transition-[left] duration-500 ease-expo group-hover:left-1">
        <ArrowIcon className="absolute inset-0 m-auto h-4 w-4 -rotate-45 text-ink transition-transform duration-500 ease-expo group-hover:rotate-0" />
      </span>
    </button>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path
        d="M3 8H13M13 8L9 4M13 8L9 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
