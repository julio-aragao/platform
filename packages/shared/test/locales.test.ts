import { describe, expect, it } from "vitest";
import { htmlLang, isLocale, negotiateLocale, resolveLocale } from "../src/i18n";

describe("negotiateLocale", () => {
  it.each([
    ["en-US,en;q=0.9", "en"],
    ["pt-BR,pt;q=0.9,en;q=0.8", "pt-br"],
    ["pt-PT", "pt-br"],
    ["en;q=0.5,pt-BR;q=0.9", "pt-br"],
    ["fr-FR,fr;q=0.9,en;q=0.1", "en"],
  ])("%s -> %s", (header, expected) => {
    expect(negotiateLocale(header)).toBe(expected);
  });

  it.each([null, undefined, "", "*", "fr", "en;q=0", ";;;,,", "x".repeat(2000)])(
    "defaults for %j",
    (header) => {
      expect(negotiateLocale(header)).toBe("pt-br");
    },
  );
});

describe("resolveLocale", () => {
  it("prefers a valid cookie", () => {
    expect(resolveLocale({ cookie: "en", acceptLanguage: "pt-BR" })).toBe("en");
  });
  it("ignores an invalid cookie", () => {
    expect(resolveLocale({ cookie: "fr", acceptLanguage: "en" })).toBe("en");
  });
  it("matches the cookie exactly", () => {
    expect(resolveLocale({ cookie: "EN" })).toBe("pt-br");
  });
  it("defaults", () => {
    expect(resolveLocale({})).toBe("pt-br");
  });
});

describe("helpers", () => {
  it("htmlLang", () => {
    expect(htmlLang("pt-br")).toBe("pt-BR");
    expect(htmlLang("en")).toBe("en");
  });
  it("isLocale is case-sensitive", () => {
    expect(isLocale("pt-BR")).toBe(false);
    expect(isLocale("pt-br")).toBe(true);
  });
});
