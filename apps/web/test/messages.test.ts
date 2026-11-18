import { describe, expect, it, vi } from "vitest";
import { fetchMessages } from "../src/lib/messages";

const API_URL = "http://api.test";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

function stubFetch(impl: () => Promise<Response>) {
  return vi.fn<typeof fetch>(impl);
}

describe("fetchMessages", () => {
  it("requests the locale's messages without caching and returns the map", async () => {
    const messages = { "home.heroTitle": "Hello", "error.badRequest": "Bad request." };
    const fetchImpl = stubFetch(async () => json({ locale: "en", messages }));
    await expect(fetchMessages("en", { apiUrl: API_URL, fetchImpl })).resolves.toEqual(messages);
    const [input, init] = fetchImpl.mock.calls[0]!;
    expect(String(input)).toBe("http://api.test/api/messages?locale=en");
    expect(init?.cache).toBe("no-store");
  });

  it("rejects on a non-2xx status", async () => {
    const fetchImpl = stubFetch(async () => json({ error: { code: "INTERNAL", message: "x" } }, 500));
    await expect(fetchMessages("en", { apiUrl: API_URL, fetchImpl })).rejects.toThrow(/500/);
  });

  it("rejects an empty message set and points at the seed", async () => {
    const fetchImpl = stubFetch(async () => json({ locale: "pt-br", messages: {} }));
    await expect(fetchMessages("pt-br", { apiUrl: API_URL, fetchImpl })).rejects.toThrow(/db:seed/);
  });

  it("rejects a body that does not match the response schema", async () => {
    const fetchImpl = stubFetch(async () => json({ locale: "en", messages: { a: 1 } }));
    await expect(fetchMessages("en", { apiUrl: API_URL, fetchImpl })).rejects.toThrow();
  });

  it("propagates a network error", async () => {
    const fetchImpl = stubFetch(async () => {
      throw new TypeError("fetch failed");
    });
    await expect(fetchMessages("en", { apiUrl: API_URL, fetchImpl })).rejects.toThrow("fetch failed");
  });
});
