import { describe, expect, it } from "vitest";
import { legacyRedirectTarget } from "../src/i18n/legacy-redirects";
import { pageMetadata } from "../src/i18n/metadata";
import { getPathname } from "../src/i18n/navigation";

describe("getPathname", () => {
  it("localises every route", () => {
    expect(getPathname({ locale: "pt-br", href: "/sign-in" })).toBe("/pt-br/entrar");
    expect(getPathname({ locale: "en", href: "/sign-in" })).toBe("/en/sign-in");
    expect(getPathname({ locale: "pt-br", href: "/" })).toBe("/pt-br");
    expect(getPathname({ locale: "en", href: "/" })).toBe("/en");
    expect(getPathname({ locale: "pt-br", href: "/sign-up" })).toBe("/pt-br/criar-conta");
    expect(getPathname({ locale: "en", href: "/sign-up" })).toBe("/en/sign-up");
    expect(getPathname({ locale: "pt-br", href: "/dashboard" })).toBe("/pt-br/painel");
    expect(getPathname({ locale: "en", href: "/dashboard" })).toBe("/en/dashboard");
  });
});

describe("legacyRedirectTarget", () => {
  it("maps legacy slugs to canonical routes", () => {
    expect(legacyRedirectTarget("/entrar")).toBe("/sign-in");
    expect(legacyRedirectTarget("/criar-conta")).toBe("/sign-up");
    expect(legacyRedirectTarget("/painel/")).toBe("/dashboard");
  });

  it("ignores everything else", () => {
    expect(legacyRedirectTarget("/sign-in")).toBeNull();
    expect(legacyRedirectTarget("/")).toBeNull();
    expect(legacyRedirectTarget("/other")).toBeNull();
  });
});

describe("pageMetadata", () => {
  it("sets canonical and language alternates", () => {
    const meta = pageMetadata({ locale: "en", href: "/sign-in", title: "Sign in" });
    expect(meta.alternates?.canonical).toBe("/en/sign-in");
    expect(meta.alternates?.languages).toEqual({
      "pt-br": "/pt-br/entrar",
      en: "/en/sign-in",
      "x-default": "/pt-br/entrar",
    });
  });
});
