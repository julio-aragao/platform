import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import proxy, { config } from "../src/proxy";

function run(path: string, headers: Record<string, string> = {}) {
  return proxy(new NextRequest(`http://localhost:3000${path}`, { headers }));
}

function target(response: Response): string | null {
  const location = response.headers.get("location");
  if (!location) return null;
  const url = new URL(location, "http://localhost:3000");
  return `${url.pathname}${url.search}`;
}

describe("proxy: unprefixed paths", () => {
  it("sends / to pt-br by default", () => {
    const res = run("/");
    expect(res.status).toBe(307);
    expect(target(res)).toBe("/pt-br");
  });

  it("follows Accept-Language", () => {
    const res = run("/", { "accept-language": "en-US,en;q=0.9" });
    expect(res.status).toBe(307);
    expect(target(res)).toBe("/en");
  });

  it("prefers a valid locale cookie over Accept-Language", () => {
    const res = run("/", { cookie: "NEXT_LOCALE=en", "accept-language": "pt-BR" });
    expect(target(res)).toBe("/en");
  });

  it("ignores an invalid locale cookie", () => {
    const res = run("/", { cookie: "NEXT_LOCALE=fr", "accept-language": "en" });
    expect(target(res)).toBe("/en");
  });

  it("falls back to pt-br on junk or wildcard Accept-Language", () => {
    expect(target(run("/", { "accept-language": ";;;,," }))).toBe("/pt-br");
    expect(target(run("/", { "accept-language": "*" }))).toBe("/pt-br");
  });

  it("keeps the query string", () => {
    const res = run("/?utm=x", { "accept-language": "en" });
    expect(res.status).toBe(307);
    expect(target(res)).toBe("/en?utm=x");
  });
});

describe("proxy: legacy URLs", () => {
  it("permanently redirects /entrar to the resolved locale, keeping the query", () => {
    const res = run("/entrar?next=%2Fpainel", { "accept-language": "en" });
    expect(res.status).toBe(308);
    expect(target(res)).toBe("/en/sign-in?next=%2Fpainel");
  });

  it("redirects /painel to the pt-br dashboard slug by default", () => {
    const res = run("/painel");
    expect(res.status).toBe(308);
    expect(target(res)).toBe("/pt-br/painel");
  });

  it("redirects /criar-conta to the English sign-up page", () => {
    const res = run("/criar-conta", { "accept-language": "en" });
    expect(res.status).toBe(308);
    expect(target(res)).toBe("/en/sign-up");
  });
});

describe("proxy: prefixed paths", () => {
  it("lower-cases an upper-case locale segment", () => {
    const res = run("/EN/sign-in?x=1");
    expect(res.status).toBe(307);
    expect(target(res)).toBe("/en/sign-in?x=1");
  });

  it("redirects another language's slug to the canonical one", () => {
    const res = run("/pt-br/sign-in");
    expect([307, 308]).toContain(res.status);
    expect(new URL(res.headers.get("location")!, "http://localhost:3000").pathname).toBe(
      "/pt-br/entrar",
    );
  });

  it("serves a canonical English path without redirecting", () => {
    const res = run("/en/sign-in");
    expect(res.headers.get("location")).toBeNull();
  });

  it("rewrites a localised slug to the internal route", () => {
    const res = run("/pt-br/entrar");
    expect(res.headers.get("location")).toBeNull();
    expect(res.headers.get("x-middleware-rewrite")).toMatch(/\/pt-br\/sign-in$/);
  });

  it("leaves alternate links to page metadata (no Link header)", () => {
    expect(run("/en/sign-in").headers.get("link")).toBeNull();
    expect(run("/pt-br/entrar").headers.get("link")).toBeNull();
  });
});

describe("proxy: cache headers on redirects", () => {
  it("marks an unprefixed redirect private and language-dependent", () => {
    const res = run("/");
    expect(res.headers.get("cache-control")).toBe("private, no-store");
    expect(res.headers.get("vary")).toBe("Cookie, Accept-Language");
  });

  it("marks a legacy redirect private and language-dependent", () => {
    const res = run("/entrar");
    expect(res.headers.get("cache-control")).toBe("private, no-store");
    expect(res.headers.get("vary")).toBe("Cookie, Accept-Language");
  });
});

describe("proxy: matcher", () => {
  // Next anchors the source pattern as a whole-path regular expression.
  const matches = (path: string) => new RegExp(`^${config.matcher[0]}$`).test(path);

  it("skips api, _next, brand and files with an extension", () => {
    for (const path of ["/api/x", "/_next/static/x", "/brand/x.svg", "/favicon.ico"]) {
      expect(matches(path), path).toBe(false);
    }
  });

  it("matches pages whose names merely start like an excluded folder", () => {
    for (const path of ["/apiary", "/branding", "/sign-in"]) {
      expect(matches(path), path).toBe(true);
    }
  });
});
