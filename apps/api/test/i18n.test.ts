import { describe, expect, it, vi } from "vitest";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { catalogs, errorResponseSchema, signUpInputSchema } from "@aurora/shared";
import { buildTestApp, fakeAuth } from "./helpers";
import { localeMiddleware, type AppEnv } from "../src/locale";
import { zodValidationHook } from "../src/validation";

async function message(res: Response) {
  return errorResponseSchema.parse(await res.json()).error.message;
}

describe("localised errors", () => {
  const app = buildTestApp();

  it("answers 401 in English", async () => {
    const res = await app.request("/api/me", { headers: { "accept-language": "en" } });
    expect(res.status).toBe(401);
    expect(await message(res)).toBe("Sign in to your account to continue.");
  });

  it.each([["pt-BR"], [undefined], ["fr"]])("answers 401 in pt-br for %s", async (lang) => {
    const headers: Record<string, string> = lang ? { "accept-language": lang } : {};
    const res = await app.request("/api/me", { headers });
    expect(await message(res)).toBe(catalogs["pt-br"]["error.unauthorized"]);
  });

  it("answers 404 in English", async () => {
    const res = await app.request("/api/nope", { headers: { "accept-language": "en" } });
    expect(res.status).toBe(404);
    expect(await message(res)).toBe("Route not found.");
  });

  it("answers 500 in English", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const failing = buildTestApp({
      ...fakeAuth(),
      getUser: async () => {
        throw new Error("boom");
      },
    });
    const res = await failing.request("/api/me", { headers: { "accept-language": "en" } });
    expect(res.status).toBe(500);
    expect(await message(res)).toBe("Something went wrong. Try again.");
    spy.mockRestore();
  });
});

describe("zodValidationHook", () => {
  const mini = new Hono<AppEnv>()
    .use("*", localeMiddleware())
    .post("/signup", zValidator("json", signUpInputSchema, zodValidationHook), (c) => c.json({ ok: true }))
    .post("/num", zValidator("json", z.object({ n: z.number() }), zodValidationHook), (c) =>
      c.json({ ok: true }),
    );
  const post = (path: string, body: unknown, lang: string) =>
    mini.request(path, {
      method: "POST",
      headers: { "content-type": "application/json", "accept-language": lang },
      body: JSON.stringify(body),
    });
  const bad = { name: "a", email: "x", password: "1" };

  it("translates a key-carrying issue to English", async () => {
    const res = await post("/signup", bad, "en");
    expect(res.status).toBe(400);
    const body = errorResponseSchema.parse(await res.json());
    expect(body.error.code).toBe("bad_request");
    expect(body.error.message).toBe("Enter your name.");
  });

  it("translates a key-carrying issue to pt-br", async () => {
    const res = await post("/signup", bad, "pt-BR");
    expect(await message(res)).toBe(catalogs["pt-br"]["validation.name.required"]);
  });

  it("falls back to the generic message for plain zod issues", async () => {
    const res = await post("/num", { n: "x" }, "pt-BR");
    expect(res.status).toBe(400);
    expect(await message(res)).toBe(catalogs["pt-br"]["error.badRequest"]);
  });
});
