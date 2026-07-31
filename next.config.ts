import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // There are stray package-lock.json files in parent directories, and
  // Turbopack was inferring C:\Users\user as the workspace root. Pin it.
  turbopack: {
    root: path.resolve(__dirname),
  },
  // React Compiler stays OFF: auto-memoization breaks useFrame closures and
  // GSAP ref mutation, which is most of the animation layer.

  images: {
    // Next 16 defaults this to [75] and silently coerces anything else. The
    // portfolio shots are UI screenshots with small text, which 75 visibly
    // softens, so 90 is allowed explicitly.
    qualities: [75, 90],
  },
};

export default nextConfig;
