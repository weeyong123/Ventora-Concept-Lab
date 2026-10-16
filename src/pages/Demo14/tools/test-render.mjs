import { build } from "rolldown";
import { tmpdir } from "node:os";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
const dir = await mkdtemp(join(tmpdir(), "demo14-render-"));
try {
  const output = join(dir, "test.mjs");
  await build({
    input: fileURLToPath(new URL("../render.test.jsx", import.meta.url)),
    platform: "node",
    transform: { jsx: "react-jsx", define: { "import.meta.env.DEV": "false" } },
    output: { file: output, format: "esm" },
  });
  const result = spawnSync(process.execPath, [output], { stdio: "inherit" });
  process.exitCode = result.status ?? 1;
} finally {
  await rm(dir, { recursive: true, force: true });
}
