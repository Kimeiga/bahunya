import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { bundleCss } from "../scripts/build.mjs";

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

test("package build is dependency-free", async () => {
  const pkg = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
  assert.equal(pkg.devDependencies, undefined);
  assert.equal(pkg.dependencies, undefined);
  assert.equal(pkg.scripts.build, "node scripts/build.mjs");
});
