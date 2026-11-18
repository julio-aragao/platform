import { describe, expect, it } from "vitest";
import { createLocalizer, type Translate } from "../src/lib/localize-message";

function recordingTranslate() {
  const calls: Array<[string, Record<string, string | number> | undefined]> = [];
  const t: Translate = (key, values) => {
    calls.push([key, values]);
    return `T:${key}`;
  };
  return { t, calls };
}

describe("createLocalizer", () => {
  it("translates a catalog key with the minimum password length", () => {
    const { t, calls } = recordingTranslate();
    expect(createLocalizer(t)("validation.password.tooShort")).toBe("T:validation.password.tooShort");
    expect(calls).toEqual([["validation.password.tooShort", { min: 8 }]]);
  });

  it("falls back to the generic bad-request message for any other text", () => {
    const { t, calls } = recordingTranslate();
    expect(createLocalizer(t)("Something unexpected")).toBe("T:error.badRequest");
    expect(calls).toEqual([["error.badRequest", undefined]]);
  });
});
