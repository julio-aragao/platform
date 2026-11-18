import { describe, expect, it } from "vitest";
import { LOCALES, buildSeedRows, catalogs, flattenMessages, unflattenMessages, webCatalogs } from "../src/i18n";

const rows = buildSeedRows();

describe("buildSeedRows", () => {
  it("returns every web and shared message for every locale", () => {
    expect(rows).toHaveLength(134);
  });

  it("has unique ids of the form locale:name", () => {
    expect(new Set(rows.map((r) => r.id)).size).toBe(rows.length);
    for (const row of rows) expect(row.id).toBe(`${row.locale}:${row.name}`);
  });

  it("has unique (name, locale) pairs", () => {
    expect(new Set(rows.map((r) => `${r.name}\u0000${r.locale}`)).size).toBe(rows.length);
  });

  it("reproduces each locale's web tree merged with the shared catalog", () => {
    for (const locale of LOCALES) {
      const flat = Object.fromEntries(
        rows.filter((r) => r.locale === locale).map((r) => [r.name, r.message]),
      );
      const expected = unflattenMessages({ ...flattenMessages(webCatalogs[locale]), ...catalogs[locale] });
      expect(unflattenMessages(flat), locale).toEqual(expected);
    }
  });

  it("keeps placeholders byte for byte", () => {
    const min = rows.find((r) => r.id === "en:validation.password.tooShort");
    expect(min?.message).toBe(catalogs.en["validation.password.tooShort"]);
    expect(min?.message).toContain("{min}");
  });
});
