import { describe, expect, it } from "vitest";
import { loadEnv } from "../src/env";

const valid = {
  DATABASE_URL: "postgresql://x",
  WEB_ORIGIN: "http://localhost:3000",
  BETTER_AUTH_URL: "http://localhost:3000",
  BETTER_AUTH_SECRET: "a".repeat(32),
};

describe("loadEnv", () => {
  it("applies the default port", () => {
    expect(loadEnv(valid).API_PORT).toBe(4000);
  });

  it("rejects a short auth secret", () => {
    expect(() => loadEnv({ ...valid, BETTER_AUTH_SECRET: "short" })).toThrow();
  });
});
