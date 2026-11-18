import { describe, expect, it } from "vitest";
import { messagesQuerySchema, messagesResponseSchema } from "../src/messages-api";

describe("messagesQuerySchema", () => {
  it("accepts a supported locale", () => {
    expect(messagesQuerySchema.safeParse({ locale: "en" }).success).toBe(true);
  });

  it("rejects an unsupported or missing locale", () => {
    expect(messagesQuerySchema.safeParse({ locale: "fr" }).success).toBe(false);
    expect(messagesQuerySchema.safeParse({}).success).toBe(false);
  });
});

describe("messagesResponseSchema", () => {
  it("accepts a locale with a flat message map", () => {
    expect(
      messagesResponseSchema.safeParse({ locale: "en", messages: { "a.b": "x" } }).success,
    ).toBe(true);
  });
});
