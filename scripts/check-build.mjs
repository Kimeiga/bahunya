import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { bundleCss, minifyCss } from "./build.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const bundled = (await bundleCss()).trim() + "\n";
const minified = minifyCss(bundled) + "\n";

const [committed, committedMin] = await Promise.all([
  readFile(join(root, "dist", "bahunya.css"), "utf8"),
  readFile(join(root, "dist", "bahunya.min.css"), "utf8"),
]);

assert.equal(committed, bundled, "dist/bahunya.css is out of date; run npm run build");
assert.equal(committedMin, minified, "dist/bahunya.min.css is out of date; run npm run build");
assert.ok(!bundled.includes("@import"), "Bundled CSS still contains @import");
assert.ok(!bundled.includes("svg-load("), "Bundled CSS contains an unresolved PostCSS function");

console.log("Generated CSS is current.");
