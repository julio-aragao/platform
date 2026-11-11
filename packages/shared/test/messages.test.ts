import { describe, expect, it } from "vitest";
import {
  LOCALES,
  LOCALE_NAMES,
  catalogs,
  isMessageKey,
  localizeMessage,
  translate,
} from "../src/i18n";
import { authErrorMessageKey } from "../src/auth-errors";
import { errorCodeMessageKey, errorCodeSchema } from "../src/errors";
import { signInInputSchema, signUpInputSchema } from "../src/auth";

const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

describe("catalogs", () => {
  const enKeys = Object.keys(catalogs.en).sort();
  for (const l of LOCALES) {
    it(`${l} has the same keys, non-empty values and placeholders as en`, () => {
      expect(Object.keys(catalogs[l]).sort()).toEqual(enKeys);
      for (const k of enKeys) {
        const v = (catalogs[l] as Record<string, string>)[k];
        expect(v.length).toBeGreaterThan(0);
        expect(placeholders(v)).toEqual(placeholders((catalogs.en as Record<string, string>)[k]));
      }
    });
  }
  it("names locales", () => {
    expect(LOCALE_NAMES.en).toBe("English");
  });
});

describe("translate", () => {
  it("interpolates", () => {
    expect(translate("en", "validation.password.tooShort", { min: 8 })).toBe(
      "The password must be at least 8 characters long.",
    );
    const pt = translate("pt-br", "validation.password.tooShort", { min: 8 });
    expect(pt).toContain("8");
    expect(pt).not.toContain("{");
  });
});

describe("localizeMessage", () => {
  it("handles keys and unknown text", () => {
    expect(localizeMessage("en", "validation.email.invalid")).toBe(catalogs.en["validation.email.invalid"]);
    expect(localizeMessage("pt-br", "Invalid input: expected string")).toBe(
      catalogs["pt-br"]["error.badRequest"],
    );
    expect(localizeMessage("en", "validation.password.tooShort")).toContain("8");
  });
});

describe("schemas carry keys", () => {
  it("sign-up", () => {
    const r = signUpInputSchema.safeParse({});
    expect(r.success).toBe(false);
    if (!r.success) for (const i of r.error.issues) expect(isMessageKey(i.message)).toBe(true);
    expect(
      signUpInputSchema.safeParse({ name: "Ann", email: "a@b.co", password: "12345678" }).success,
    ).toBe(true);
  });
  it("sign-in", () => {
    const r = signInInputSchema.safeParse({ email: "x", password: "" });
    expect(r.success).toBe(false);
    if (!r.success) for (const i of r.error.issues) expect(isMessageKey(i.message)).toBe(true);
  });
});

describe("error keys", () => {
  it("maps auth codes", () => {
    expect(authErrorMessageKey("INVALID_EMAIL_OR_PASSWORD")).toBe("auth.invalidCredentials");
    for (const c of ["SOMETHING_NEW", null, undefined]) expect(authErrorMessageKey(c)).toBe("auth.fallback");
  });
  it("covers every error code", () => {
    for (const c of errorCodeSchema.options) expect(isMessageKey(errorCodeMessageKey[c])).toBe(true);
  });
});
