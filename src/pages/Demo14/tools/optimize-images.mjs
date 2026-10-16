import { createHash } from "node:crypto";
// Run with SHARP_MODULE pointing to an installed sharp package; no runtime dependency.
import { createRequire } from "node:module";
import { mkdir, stat, writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_MODULE || "sharp");
const root = fileURLToPath(new URL("../../../../public/demo14/", import.meta.url));
const names = [
  "three-doors-hall",
  "final-reveal-bg",
  ...[1, 2, 3].flatMap((i) => [`door${i}-before`, `door${i}-after`]),
];
await mkdir(`${root}optimized`, { recursive: true });
const manifest = {};
for (const name of names) {
  const input = `${root}${name}.png`;
  const { width, height } = await sharp(input).metadata();
  const variants = [];
  for (const target of [...new Set([Math.min(960, width), width])]) {
    const output = `optimized/${name}-${target}.webp`;
    await sharp(input)
      .resize({ width: target, withoutEnlargement: true })
      .webp({ quality: 86, effort: 6 })
      .toFile(`${root}${output}`);
    variants.push({
      src: `/demo14/${output}`,
      width: target,
      bytes: (await stat(`${root}${output}`)).size,
    });
  }
  manifest[`${name}.png`] = {
    width,
    height,
    originalBytes: (await stat(input)).size,
    sourceHash: createHash("sha256")
      .update(await readFile(input))
      .digest("hex"),
    variants,
  };
}
await writeFile(
  new URL("../image-manifest.json", import.meta.url),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
console.log(
  JSON.stringify(
    Object.values(manifest).reduce(
      (sum, image) => ({
        original: sum.original + image.originalBytes,
        desktop: sum.desktop + image.variants.at(-1).bytes,
        mobile: sum.mobile + image.variants[0].bytes,
      }),
      { original: 0, desktop: 0, mobile: 0 },
    ),
  ),
);
