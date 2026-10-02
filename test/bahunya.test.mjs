import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { bundleCss, minifyCss } from "../scripts/build.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

test("navbar styles only target primary body/header navigation", async () => {
  const css = await bundleCss();
  assert.match(css, /body > nav:first-of-type/);
  assert.match(css, /body > header:first-child > nav/);
  assert.doesNotMatch(css, /body nav:first-of-type/);
});

test("navbar needs no Bahunya-specific class or ID hooks", async () => {
  const [css, index, readme] = await Promise.all([
    bundleCss(),
    readFile(join(root, "index.html"), "utf8"),
    readFile(join(root, "README.md"), "utf8"),
  ]);

  assert.doesNotMatch(css, /#brand/);
  assert.doesNotMatch(index, /id="brand"/);
  assert.match(css, /> a:first-of-type/);
  assert.match(css, /> ul > li:first-child/);
  assert.match(readme, /no Bahunya-specific class or ID is required/);
});

test("nested navigation is keyboard accessible", async () => {
  const css = await bundleCss();
  assert.match(css, /:focus-within > ul/);
  assert.match(css, /a:focus-visible/);
});

test("select menus use browser-aware dark controls and explicit option colors", async () => {
  const css = await bundleCss();
  assert.match(css, /color-scheme: dark/);
  assert.match(css, /option,\s*optgroup/);
  assert.doesNotMatch(css, /svg-load\(/);
});

test("light theme is available without changing the dark default", async () => {
  const css = await bundleCss();
  assert.match(css, /:root\[data-theme="light"\]/);
  assert.match(css, /color-scheme: light/);
});

test("project metadata and docs point at the public Bahunya site", async () => {
  const [pkgText, index, readme] = await Promise.all([
    readFile(join(root, "package.json"), "utf8"),
    readFile(join(root, "index.html"), "utf8"),
    readFile(join(root, "README.md"), "utf8"),
  ]);
  const pkg = JSON.parse(pkgText);

  assert.equal(pkg.homepage, "https://kimeiga.github.io/bahunya/");
  assert.match(index, /https:\/\/kimeiga\.github\.io\/bahunya\//);
  assert.doesNotMatch(index, /TODO:/);
  assert.match(readme, /data-theme="light"/);
});

test("visual system stays responsive, touch-friendly, and classless", async () => {
  const [css, index, demo] = await Promise.all([
    bundleCss(),
    readFile(join(root, "index.html"), "utf8"),
    readFile(join(root, "demo.html"), "utf8"),
  ]);

  assert.match(css, /--control-height: 2\.75rem/);
  assert.match(css, /--radius-lg: 1\.25rem/);
  assert.match(css, /font-size: clamp\(1\.75rem,/);
  assert.match(css, /font-size: 1rem;/);
  assert.match(css, /position: fixed/);
  assert.match(css, /min-height: var\(--control-height\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(index, /width="192" height="192"/);
  assert.doesNotMatch(demo, /\sclass="/);
});

test("minifier preserves nested at-rule closing braces", () => {
  const source = "@media (x){a{color:red;}}b{color:blue;}";
  const minified = minifyCss(source);

  assert.equal(minified, "@media (x){a{color:red}}b{color:blue}");
});

test("navbar keeps the fixed edge-to-edge blurred header contract", async () => {
  const css = await bundleCss();

  assert.match(css, /position: fixed/);
  assert.match(css, /top: 0/);
  assert.match(css, /left: 0/);
  assert.match(css, /right: 0/);
  assert.match(css, /background: var\(--nav-background\)/);
  assert.match(css, /backdrop-filter: saturate\(180%\) blur\(20px\)/);
  assert.match(css, /border-radius: 0/);
  assert.match(css, /body:has\(> nav:first-of-type\)/);
});

test("document content uses flat hierarchy rather than cards", async () => {
  const css = await bundleCss();

  assert.match(css, /article \{[\s\S]*background: transparent;[\s\S]*border: 0;/);
  assert.match(css, /blockquote \{[\s\S]*background: transparent;[\s\S]*border-left: 4px solid var\(--border-bright\);/);
  assert.match(css, /table \{[\s\S]*background: transparent;[\s\S]*border: 0;/);
});

test("mobile navigation is vertically centered and touch-toggleable", async () => {
  const [css, demo] = await Promise.all([
    bundleCss(),
    readFile(join(root, "demo.html"), "utf8"),
  ]);

  assert.match(css, /height: 3rem/);
  assert.match(css, /align-items: center/);
  assert.match(css, /details\[open\] > ul/);
  assert.match(css, /position: fixed/);
  assert.doesNotMatch(css, /display: none !important/);
  assert.match(demo, /<details>/);
  assert.match(demo, /<summary>Text<\/summary>/);
  assert.doesNotMatch(demo, /\sclass="/);
});

test("heading scale stays close to the compact mobile reference", async () => {
  const css = await bundleCss();

  assert.match(css, /h1 \{[\s\S]*font-size: clamp\(1\.75rem,/);
  assert.match(css, /h2 \{[\s\S]*font-size: clamp\(1\.375rem,/);
  assert.match(css, /h3 \{[\s\S]*font-size: clamp\(1\.1875rem,/);
  assert.match(css, /body \{[\s\S]*font-size: 1rem;/);
  assert.match(css, /line-height: 1\.5/);
});

test("desktop dropdowns are compact hover menus with inset highlighting", async () => {
  const css = await bundleCss();

  assert.match(css, /@media \(hover: hover\) and \(pointer: fine\)/);
  assert.match(css, /details:hover > ul/);
  assert.match(css, /top: 100%/);
  assert.match(css, /padding: 0\.25rem 0\.375rem/);
  assert.match(css, /border-radius: var\(--radius-sm\)/);
  assert.match(css, /min-height: 2\.125rem/);
  assert.match(css, /details > ul > li,[\s\S]*width: 100%/);
});

test("mobile dropdowns remain tap-open with larger touch targets", async () => {
  const css = await bundleCss();

  assert.match(css, /details\[open\] > ul,[\s\S]*display: flex/);
  assert.match(css, /position: fixed;[\s\S]*top: 3rem/);
  assert.match(css, /min-height: 2\.75rem/);
});

test("package build is dependency-free", async () => {
  const pkg = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
  assert.equal(pkg.devDependencies, undefined);
  assert.equal(pkg.dependencies, undefined);
  assert.equal(pkg.scripts.build, "node scripts/build.mjs");
});
