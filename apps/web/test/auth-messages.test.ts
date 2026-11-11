import { describe, expect, it } from "vitest";
import { FALLBACK_MESSAGE, authErrorMessage } from "../src/lib/auth-messages";

describe("authErrorMessage", () => {
  it("translates a known Better Auth code", () => {
    expect(authErrorMessage({ code: "INVALID_EMAIL_OR_PASSWORD" })).toMatch(/incorretos/);
  });

  it("falls back for unknown or missing codes", () => {
    expect(authErrorMessage({ code: "SOMETHING_NEW" })).toBe(FALLBACK_MESSAGE);
    expect(authErrorMessage(null)).toBe(FALLBACK_MESSAGE);
  });
});
