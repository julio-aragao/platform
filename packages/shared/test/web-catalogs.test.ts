import { describe, expect, it } from "vitest";
import { DEFAULT_LOCALE, LOCALES, webCatalogs, type Locale, type MessageTree } from "../src/i18n";

const en = webCatalogs.en;

function flatten(tree: MessageTree, prefix = ""): Map<string, string> {
  const entries = new Map<string, string>();
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") entries.set(path, value);
    else for (const [k, v] of flatten(value, path)) entries.set(k, v);
  }
  return entries;
}

function placeholders(message: string): string[] {
  return [...message.matchAll(/\{(\w+)\}/g)].map((m) => m[1]!).sort();
}

const catalogs = Object.fromEntries(
  LOCALES.map((locale) => [locale, flatten(webCatalogs[locale])] as const),
) as Record<Locale, Map<string, string>>;
const reference = catalogs[DEFAULT_LOCALE];

describe("message catalogs", () => {
  it("have the same keys", () => {
    for (const locale of LOCALES) {
      expect([...catalogs[locale].keys()].sort(), locale).toEqual([...reference.keys()].sort());
    }
  });

  it("have no empty values", () => {
    for (const catalog of Object.values(catalogs)) {
      for (const [key, value] of catalog) expect(value.trim(), key).not.toBe("");
    }
  });

  it("use the same placeholders per key", () => {
    for (const locale of LOCALES) {
      for (const [key, value] of reference) {
        expect(placeholders(catalogs[locale].get(key) ?? ""), `${locale}:${key}`).toEqual(placeholders(value));
      }
    }
  });

  it("define exactly the common keys", () => {
    expect(Object.keys(en.common).sort()).toEqual(
      ["accountNavLabel", "brandHomeLabel", "landing", "languageSwitcherLabel", "signIn", "signOut", "signUp"].sort(),
    );
  });
});
