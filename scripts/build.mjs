import { watch } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const entry = join(root, "src", "bahunya.css");
const distDir = join(root, "dist");

export async function bundleCss(file = entry, stack = []) {
  const absolute = resolve(file);
  if (stack.includes(absolute)) {
    throw new Error(`Circular CSS import: ${[...stack, absolute].join(" -> ")}`);
  }

  const source = await readFile(absolute, "utf8");
  const importPattern = /@import\s+["\']([^"\']+)["\'];/g;
  let result = "";
  let lastIndex = 0;

  for (const match of source.matchAll(importPattern)) {
    result += source.slice(lastIndex, match.index);
    const imported = resolve(dirname(absolute), match[1]);
    result += await bundleCss(imported, [...stack, absolute]);
    lastIndex = match.index + match[0].length;
  }

  result += source.slice(lastIndex);
  return result;
}

function stripComments(css) {
  let out = "";
  let quote = null;

  for (let i = 0; i < css.length; i += 1) {
    const char = css[i];
    const next = css[i + 1];

    if (quote) {
      out += char;
      if (char === "\\" && next !== undefined) {
        out += next;
        i += 1;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === "\"" || char === "\'") {
      quote = char;
      out += char;
      continue;
    }

    if (char === "/" && next === "*") {
      const end = css.indexOf("*/", i + 2);
      if (end === -1) throw new Error("Unterminated CSS comment");
      i = end + 1;
      continue;
    }

    out += char;
  }

  return out;
}

export function minifyCss(css) {
  return stripComments(css)
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

export async function build() {
  const bundled = (await bundleCss()).trim() + "\n";
  const minified = minifyCss(bundled) + "\n";

  await mkdir(distDir, { recursive: true });
  await Promise.all([
    writeFile(join(distDir, "bahunya.css"), bundled, "utf8"),
    writeFile(join(distDir, "bahunya.min.css"), minified, "utf8"),
  ]);

  return {
    bundledBytes: Buffer.byteLength(bundled),
    minifiedBytes: Buffer.byteLength(minified),
  };
}

async function run() {
  const size = await build();
  console.log(`Built dist/bahunya.css (${size.bundledBytes} B) and dist/bahunya.min.css (${size.minifiedBytes} B)`);

  if (!process.argv.includes("--watch")) return;

  let timer;
  watch(join(root, "src"), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      try {
        const nextSize = await build();
        console.log(`Rebuilt (${nextSize.minifiedBytes} B minified)`);
      } catch (error) {
        console.error(error);
      }
    }, 50);
  });

  console.log("Watching src/ for changes...");
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await run();
}
