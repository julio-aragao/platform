import { describe, expect, it } from "vitest";
import { fieldErrorsFromIssues } from "../src/lib/form-errors";

const localize = (message: string) => `L:${message}`;

describe("fieldErrorsFromIssues", () => {
  it("keys each issue by its first path segment and localizes its message", () => {
    const errors = fieldErrorsFromIssues(localize, [
      { path: ["email"], message: "validation.email.invalid" },
      { path: ["password", 0], message: "validation.password.required" },
    ]);
    expect(errors).toEqual({
      email: "L:validation.email.invalid",
      password: "L:validation.password.required",
    });
  });

  it("returns no errors for no issues", () => {
    expect(fieldErrorsFromIssues(localize, [])).toEqual({});
  });
});
