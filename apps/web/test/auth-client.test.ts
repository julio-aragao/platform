import type { Locale } from "@aurora/shared";
import { describe, expect, it, vi } from "vitest";
import { createLocaleAuthClient } from "../src/lib/auth-client";

describe("createLocaleAuthClient", () => {
  it.each<Locale>(["en", "pt-br"])("sends Accept-Language: %s on auth calls", async (locale) => {
    const fetchImpl = vi.fn<typeof fetch>(
      async () =>
        new Response(JSON.stringify({ token: "t", user: null }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
    );
    const client = createLocaleAuthClient({ locale, baseURL: "http://localhost", fetchImpl });

    await client.signIn.email({ email: "a@b.co", password: "x" });

    expect(fetchImpl).toHaveBeenCalled();
    const [input, init] = fetchImpl.mock.calls[0]!;
    expect(new Request(input, init).headers.get("accept-language")).toBe(locale);
  });
});
