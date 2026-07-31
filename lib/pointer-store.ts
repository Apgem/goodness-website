/**
 * Plain mutable pointer state, in normalized device coords (-1..1, y up).
 *
 * `x/y` are the raw target; consumers damp toward them themselves so each
 * element can drift at its own rate. See lib/math.ts `damp`.
 */
export const pointer = {
  /** raw target, NDC */
  x: 0,
  y: 0,
  /** true once the user has actually moved a fine pointer */
  active: false,
};

let bound = false;

/** Idempotent — safe under StrictMode double-mount. */
export function bindPointer() {
  if (bound || typeof window === "undefined") return () => {};
  bound = true;

  const onMove = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    pointer.active = true;
  };

  // Recentre when the cursor leaves so the scene relaxes instead of freezing
  // mid-drift at the edge.
  const onLeave = () => {
    pointer.x = 0;
    pointer.y = 0;
    pointer.active = false;
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerleave", onLeave);

  return () => {
    window.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerleave", onLeave);
    bound = false;
  };
}
