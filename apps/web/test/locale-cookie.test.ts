import { describe, expect, it } from "vitest";
import { serializeLocaleCookie } from "../src/i18n/locale-cookie";

describe("serializeLocaleCookie", () => {
  it("serializes without Secure", () => {
    expect(serializeLocaleCookie("en", { secure: false })).toBe(
      "NEXT_LOCALE=en; Path=/; Max-Age=31536000; SameSite=Lax",
    );
  });

  it("appends Secure", () => {
    expect(serializeLocaleCookie("en", { secure: true }).endsWith("; Secure")).toBe(true);
  });
});
