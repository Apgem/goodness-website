/**
 * Bakes public/hero.mp4 from a source video: mattes out the studio backdrop,
 * drops the generator watermark, crops to the subject, and packs colour + alpha
 * into one file.
 *
 * WHY A PACKED MATTE, NOT AN ALPHA CODEC
 * WebM/VP9 alpha isn't supported in Safari and HEVC-with-alpha is a pain to
 * encode. Packing colour in the top half and the matte in the bottom half of a
 * plain h264 MP4 works in every browser; the shader recombines them.
 *
 * WHY FLOOD FILL, NOT A COLOUR KEY
 * Measured from the source: backdrop is rgb(28,48,34), his jacket is
 * rgb(32,52,53). The jacket is MORE green-dominant than the backdrop (g-r +23
 * vs +20), so keying on g-r deletes the suit. Keying on g-b keeps the suit but
 * eats shadowed skin around the eyes and jaw, which is also dark and
 * green-biased. No per-pixel colour test separates them.
 *
 * The backdrop is however *connected* and touches the frame border, while his
 * face is not. Flooding inward from the border with a tolerance keeps interior
 * pixels no matter their colour, which is what makes this work.
 *
 * usage: node scripts/prepare-hero-video.mjs <source.mp4>
 */
import sharp from "sharp";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

const FFMPEG = ffmpegInstaller.path;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = process.argv[2];
const OUT = path.join(__dirname, "..", "public", "hero.mp4");
const POSTER = path.join(__dirname, "..", "public", "hero-poster.jpg");

if (!SRC) {
  console.error("usage: node scripts/prepare-hero-video.mjs <source.mp4>");
  process.exit(1);
}

const FPS = 24;
const PAD = 12; // px of breathing room around the subject bbox

// Backdrop test — used only to seed and constrain the flood, never alone.
const isBackdropish = (r, g, b) =>
  g - b > 4 && g - r > 4 && Math.max(r, g, b) < 100;
const TOL = 26; // per-channel manhattan tolerance when expanding the flood

const work = fs.mkdtempSync(path.join(os.tmpdir(), "hero-"));
const framesDir = path.join(work, "frames");
const packedDir = path.join(work, "packed");
fs.mkdirSync(framesDir);
fs.mkdirSync(packedDir);

console.log("1/5  extracting frames…");
execFileSync(FFMPEG, ["-y", "-i", SRC, "-vsync", "0", path.join(framesDir, "%04d.png")], {
  stdio: "pipe",
});
const frameFiles = fs.readdirSync(framesDir).sort();
console.log(`     ${frameFiles.length} frames`);

/** Flood the backdrop inward from the border, then keep only the largest
 *  remaining blob (drops the generator's sparkle watermark and any specks). */
function matteFrame(data, W, H, C) {
  const N = W * H;
  const bg = new Uint8Array(N);
  const stack = new Int32Array(N);
  let sp = 0;

  const rgb = (p) => {
    const i = p * C;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const seed = (p) => {
    if (bg[p]) return;
    const [r, g, b] = rgb(p);
    if (!isBackdropish(r, g, b)) return;
    bg[p] = 1;
    stack[sp++] = p;
  };

  for (let x = 0; x < W; x++) {
    seed(x);
    seed((H - 1) * W + x);
  }
  for (let y = 0; y < H; y++) {
    seed(y * W);
    seed(y * W + W - 1);
  }

  while (sp > 0) {
    const p = stack[--sp];
    const [cr, cg, cb] = rgb(p);
    const x = p % W;
    const y = (p / W) | 0;
    for (let k = 0; k < 4; k++) {
      const nx = x + (k === 0 ? 1 : k === 1 ? -1 : 0);
      const ny = y + (k === 2 ? 1 : k === 3 ? -1 : 0);
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const np = ny * W + nx;
      if (bg[np]) continue;
      const [r, g, b] = rgb(np);
      if (!isBackdropish(r, g, b)) continue;
      if (Math.abs(r - cr) + Math.abs(g - cg) + Math.abs(b - cb) >= TOL) continue;
      bg[np] = 1;
      stack[sp++] = np;
    }
  }

  // Largest connected component of the *kept* pixels = the subject.
  const label = new Int32Array(N).fill(-1);
  let best = -1;
  let bestSize = 0;
  let id = 0;
  for (let p0 = 0; p0 < N; p0++) {
    if (bg[p0] || label[p0] !== -1) continue;
    let size = 0;
    sp = 0;
    stack[sp++] = p0;
    label[p0] = id;
    while (sp > 0) {
      const p = stack[--sp];
      size++;
      const x = p % W;
      const y = (p / W) | 0;
      for (let k = 0; k < 4; k++) {
        const nx = x + (k === 0 ? 1 : k === 1 ? -1 : 0);
        const ny = y + (k === 2 ? 1 : k === 3 ? -1 : 0);
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const np = ny * W + nx;
        if (bg[np] || label[np] !== -1) continue;
        label[np] = id;
        stack[sp++] = np;
      }
    }
    if (size > bestSize) {
      bestSize = size;
      best = id;
    }
    id++;
  }

  const keep = new Uint8Array(N);
  for (let p = 0; p < N; p++) keep[p] = label[p] === best ? 1 : 0;
  return keep;
}

console.log("2/5  matting (flood fill + largest component)…");
const mattes = [];
let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
let W = 0, H = 0, C = 0;

for (let f = 0; f < frameFiles.length; f++) {
  const { data, info } = await sharp(path.join(framesDir, frameFiles[f]))
    .raw()
    .toBuffer({ resolveWithObject: true });
  W = info.width;
  H = info.height;
  C = info.channels;
  const keep = matteFrame(data, W, H, C);
  mattes.push(keep);

  for (let p = 0; p < W * H; p++) {
    if (!keep[p]) continue;
    const x = p % W;
    const y = (p / W) | 0;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  if ((f + 1) % 24 === 0) process.stdout.write(`     ${f + 1}/${frameFiles.length}\r`);
}

// Union bbox across every frame, padded, snapped to even dimensions (h264
// chroma subsampling requires even width/height).
minX = Math.max(0, minX - PAD);
minY = Math.max(0, minY - PAD);
maxX = Math.min(W - 1, maxX + PAD);
maxY = Math.min(H - 1, maxY + PAD);
let cropW = maxX - minX + 1;
let cropH = maxY - minY + 1;
if (cropW % 2) cropW--;
if (cropH % 2) cropH--;
console.log(`\n3/5  crop ${cropW}x${cropH} at (${minX},${minY}) — packed ${cropW}x${cropH * 2}`);

console.log("4/5  packing colour over matte…");
for (let f = 0; f < frameFiles.length; f++) {
  const { data } = await sharp(path.join(framesDir, frameFiles[f]))
    .raw()
    .toBuffer({ resolveWithObject: true });
  const keep = mattes[f];
  const packed = Buffer.alloc(cropW * cropH * 2 * 3);

  for (let y = 0; y < cropH; y++) {
    for (let x = 0; x < cropW; x++) {
      const sp0 = (y + minY) * W + (x + minX);
      const si = sp0 * C;
      const on = keep[sp0];

      // top half: colour (backdrop forced to black so bleed stays invisible)
      const ci = (y * cropW + x) * 3;
      packed[ci] = on ? data[si] : 0;
      packed[ci + 1] = on ? data[si + 1] : 0;
      packed[ci + 2] = on ? data[si + 2] : 0;

      // bottom half: matte
      const mi = ((y + cropH) * cropW + x) * 3;
      const v = on ? 255 : 0;
      packed[mi] = v;
      packed[mi + 1] = v;
      packed[mi + 2] = v;
    }
  }

  await sharp(packed, { raw: { width: cropW, height: cropH * 2, channels: 3 } })
    .png()
    .toFile(path.join(packedDir, String(f + 1).padStart(4, "0") + ".png"));
}

console.log("5/5  encoding…");
execFileSync(
  FFMPEG,
  [
    "-y",
    "-framerate", String(FPS),
    "-i", path.join(packedDir, "%04d.png"),
    "-an", // hero video is silent — never autoplay audio at someone
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "23",
    // Every frame a keyframe. The hero video is scrubbed by scroll position
    // (HeroVideo.tsx sets currentTime), and seeking is only smooth when any
    // frame can be decoded without walking back to a prior keyframe. Costs ~4x
    // the file size; worth it for a jank-free scroll.
    "-g", "1",
    "-keyint_min", "1",
    "-sc_threshold", "0",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    OUT,
  ],
  { stdio: "pipe" },
);

// Poster frame = first frame's colour half, for instant first paint.
await sharp(path.join(packedDir, "0001.png"))
  .extract({ left: 0, top: 0, width: cropW, height: cropH })
  .jpeg({ quality: 80 })
  .toFile(POSTER);

fs.rmSync(work, { recursive: true, force: true });

const size = (fs.statSync(OUT).size / 1024 / 1024).toFixed(2);
console.log(`\ndone — ${OUT} (${size} MB), packed ${cropW}x${cropH * 2}`);
console.log(`crop dims for the shader: ${cropW}x${cropH}`);
