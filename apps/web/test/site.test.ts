import { describe, expect, it } from "vitest";
import { pageMetadata } from "../src/i18n/metadata";
import { siteUrl } from "../src/lib/site";

describe("siteUrl", () => {
  it("reads WEB_ORIGIN", () => {
    expect(siteUrl({ WEB_ORIGIN: "https://aurora.example" }).href).toBe("https://aurora.example/");
  });

  it("falls back to localhost when unset or empty", () => {
    expect(siteUrl({}).href).toBe("http://localhost:3000/");
    expect(siteUrl({ WEB_ORIGIN: "" }).href).toBe("http://localhost:3000/");
  });

  it("makes page alternates absolute when used as metadataBase", () => {
    const base = siteUrl({ WEB_ORIGIN: "https://aurora.example" });
    const { alternates } = pageMetadata({ locale: "en", href: "/sign-in" });
    const resolved = [alternates?.canonical, ...Object.values(alternates?.languages ?? {})].map(
      (path) => new URL(String(path), base).href,
    );
    expect(resolved).toContain("https://aurora.example/en/sign-in");
    expect(resolved.some((href) => href.startsWith("https://aurora.example/pt-br/"))).toBe(true);
    for (const href of resolved) expect(href.startsWith("https://aurora.example/")).toBe(true);
  });
});
