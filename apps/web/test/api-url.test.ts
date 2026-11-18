import { describe, expect, it } from "vitest";
import { apiUrl } from "../src/lib/api-url";

describe("apiUrl", () => {
  it("defaults to the local API when API_URL is unset", () => {
    expect(apiUrl({})).toBe("http://localhost:4000");
  });

  it("uses API_URL when set", () => {
    expect(apiUrl({ API_URL: "http://api.test" })).toBe("http://api.test");
  });
});
