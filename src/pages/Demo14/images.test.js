import { createHash } from "node:crypto";
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";

const manifest = JSON.parse(
  readFileSync(new URL("./image-manifest.json", import.meta.url)),
);
test("responsive images retain every source, valid dimensions and smaller downloads", () => {
  assert.equal(Object.keys(manifest).length, 8);
  for (const [name, image] of Object.entries(manifest)) {
    assert.equal(
      statSync(`public/demo14/${name}`).size,
      image.originalBytes,
      `Regenerate optimized images after replacing ${name}`,
    );
    assert.equal(
      createHash("sha256")
        .update(readFileSync(`public/demo14/${name}`))
        .digest("hex"),
      image.sourceHash,
      `Regenerate optimized images after replacing ${name}`,
    );
    assert(image.width > 0 && image.height > 0);
    assert(image.variants.length >= 1);
    assert(image.variants[0].width <= 960);
    assert.equal(image.variants.at(-1).width, image.width);
    for (const variant of image.variants) {
      assert.equal(statSync(`public${variant.src}`).size, variant.bytes);
      assert(variant.bytes < image.originalBytes);
    }
  }
});
