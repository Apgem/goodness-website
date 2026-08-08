import LiquidBrand from "@/components/three/LiquidBrand";

export default function BrandOutro() {
  return (
    <section
      aria-label="APGEM"
      className="relative h-[60vh] w-full overflow-hidden bg-[#050508] md:h-[80vh]"
    >
      {/* Static text renders instantly and covers no-JS and
          prefers-reduced-motion visitors (LiquidBrand no-ops for both) — it
          also gives the wordmark a real accessible node instead of only
          living inside a canvas pixel buffer. LiquidBrand's canvas is
          transparent until the effect loads, so this shows through, then
          gets naturally painted over once the canvas starts rendering. */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="display select-none text-[16vw] text-ink/90 md:text-[11rem]">
          APGEM
        </span>
      </div>
      <LiquidBrand />
    </section>
  );
}
