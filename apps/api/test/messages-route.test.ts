import { afterEach, describe, expect, it, vi } from "vitest";
import { errorResponseSchema, messagesResponseSchema, webCatalogs } from "@aurora/shared";
import { createCachedMessageStore } from "../src/messages/store";
import { buildTestApp, fakeAuth } from "./helpers";

describe("GET /api/messages", () => {
  const app = buildTestApp();

  it("serves the messages of a locale without caching", async () => {
    const res = await app.request("/api/messages?locale=en");
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");
    const body = messagesResponseSchema.parse(await res.json());
    expect(body.locale).toBe("en");
    expect(body.messages["error.unauthorized"]).toBe("Sign in to your account to continue.");
    expect(body.messages["home.heroTitle"]).toBe(webCatalogs.en.home.heroTitle);
  });

  it.each([["?locale=fr"], [""]])("answers 400 bad_request for %j", async (query) => {
    const res = await app.request(`/api/messages${query}`);
    expect(res.status).toBe(400);
    expect(errorResponseSchema.parse(await res.json()).error.code).toBe("bad_request");
  });

  describe("when the messages cannot load", () => {
    afterEach(() => vi.restoreAllMocks());

    it("answers 500 internal_error with the message key as text and logs the failures", async () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      const failing = createCachedMessageStore(async () => {
        throw new Error("db down");
      });
      const res = await buildTestApp(fakeAuth(), failing).request("/api/messages?locale=en");
      expect(res.status).toBe(500);
      const { error } = errorResponseSchema.parse(await res.json());
      expect(error.code).toBe("internal_error");
      expect(error.message).toBe("error.internal");
      expect(spy).toHaveBeenCalled();
    });
  });
});
