import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { findPortuguese } from "./support/portuguese";

describe("findPortuguese", () => {
  it("flags accented text", () => {
    expect(findPortuguese("Informe seu nome. Revis\u00e3o")).not.toEqual([]);
  });

  it("flags denylisted Portuguese identifiers", () => {
    expect(findPortuguese('className="btn-primario"')).not.toEqual([]);
  });

  it("accepts English text", () => {
    expect(findPortuguese("Enter your name.")).toEqual([]);
  });

  it("skips text between the ignore markers", () => {
    const text = [
      "<!-- i18n-guard:ignore-start -->",
      "Revis\u00e3o da marca",
      "<!-- i18n-guard:ignore-end -->",
    ].join("\n");
    expect(findPortuguese(text)).toEqual([]);
  });

  it("reports an ignore-start marker that is never closed", () => {
    const text = ["<!-- i18n-guard:ignore-start -->", "Revis\u00e3o da marca"].join("\n");
    expect(findPortuguese(text)).not.toEqual([]);
  });
});

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

const SKIPPED_DIRS = new Set(["node_modules", "dist", "generated", "docs"]);
const SKIPPED_PATHS = new Set([
  "pnpm-lock.yaml",
  "apps/api/prisma/migrations",
  "apps/web/src/i18n/messages",
  "apps/web/src/i18n/pathnames.ts",
  // The guard itself, and tests asserting Portuguese route slugs (translation data).
  "apps/web/test/i18n-guard.test.ts",
  "apps/web/test/support/portuguese.ts",
  "apps/web/test/i18n-routing.test.ts",
  "apps/web/test/proxy.test.ts",
]);
const SCANNED = /\.(ts|tsx|mjs|mts|js|json|css|md|yml|yaml|prisma|sql)$|(^|\/)\.env\.example$/;

function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = relative(root, full).split(sep).join("/");
    const isDir = statSync(full).isDirectory();
    if (isDir && (name.startsWith(".") || SKIPPED_DIRS.has(name) || name === "catalogs")) continue;
    if (SKIPPED_PATHS.has(rel)) continue;
    if (isDir) yield* walk(full);
    else if (SCANNED.test(rel)) yield full;
  }
}

describe("repository is English", () => {
  it("contains no Portuguese outside catalogs and translation data", () => {
    const findings: string[] = [];
    for (const file of walk(root)) {
      for (const hit of findPortuguese(readFileSync(file, "utf8"))) {
        findings.push(`${relative(root, file)}:${hit}`);
      }
    }
    expect(findings, findings.join("\n")).toEqual([]);
  });
});
