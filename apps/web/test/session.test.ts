import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: async () => ({ toString: () => "better-auth.session_token=abc" }),
}));

const { getCurrentUser } = await import("../src/lib/session");

const USER = { id: "u1", name: "Ada", email: "ada@example.com" };

function stubFetch(impl: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>) {
  const fetchMock = vi.fn(impl);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

describe("getCurrentUser", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends the page language as Accept-Language", async () => {
    const fetchMock = stubFetch(async () => json({ user: USER }));
    await getCurrentUser("en");
    const [, init] = fetchMock.mock.calls[0]!;
    expect(new Headers(init?.headers).get("accept-language")).toBe("en");
  });

  it("returns the user for a valid 200 response", async () => {
    stubFetch(async () => json({ user: USER }));
    expect(await getCurrentUser("pt-br")).toEqual(USER);
  });

  it("returns null for a 401", async () => {
    stubFetch(async () => json({ error: { code: "UNAUTHORIZED", message: "no" } }, 401));
    expect(await getCurrentUser("en")).toBeNull();
  });

  it("returns null when the network call throws", async () => {
    stubFetch(async () => {
      throw new TypeError("fetch failed");
    });
    expect(await getCurrentUser("en")).toBeNull();
  });

  it("returns null when the body does not match the response schema", async () => {
    stubFetch(async () => json({ user: { id: "u1" } }));
    expect(await getCurrentUser("en")).toBeNull();
  });
});
