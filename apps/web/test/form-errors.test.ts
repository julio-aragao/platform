import { catalogs } from "@aurora/shared";
import { describe, expect, it } from "vitest";
import { fieldErrorsFromIssues } from "../src/lib/form-errors";

describe("fieldErrorsFromIssues", () => {
  it("translates a known key into the page language", () => {
    expect(fieldErrorsFromIssues("en", [{ path: ["email"], message: "validation.email.invalid" }])).toEqual({
      email: "Enter a valid email address.",
    });
  });

  it("interpolates the minimum password length", () => {
    const errors = fieldErrorsFromIssues("pt-br", [
      { path: ["password"], message: "validation.password.tooShort" },
    ]);
    expect(errors.password).toContain("8");
  });

  it("falls back to the generic bad-request message for an unknown message", () => {
    expect(fieldErrorsFromIssues("pt-br", [{ path: ["email"], message: "Something unexpected" }])).toEqual({
      email: catalogs["pt-br"]["error.badRequest"],
    });
  });

  it("keys each issue by its field", () => {
    const errors = fieldErrorsFromIssues("en", [
      { path: ["email"], message: "validation.email.invalid" },
      { path: ["password"], message: "validation.password.required" },
    ]);
    expect(errors).toEqual({
      email: catalogs.en["validation.email.invalid"],
      password: catalogs.en["validation.password.required"],
    });
  });
});
