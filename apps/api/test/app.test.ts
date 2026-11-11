import { describe, expect, it } from "vitest";
import { errorResponseSchema, healthResponseSchema, meResponseSchema } from "@aurora/shared";
import { buildTestApp, testUser } from "./helpers";

describe("app", () => {
  const app = buildTestApp();

  it("answers the health check", async () => {
    const res = await app.request("/api/health");
    expect(res.status).toBe(200);
    expect(healthResponseSchema.parse(await res.json())).toEqual({ status: "ok" });
  });

  it("returns the signed-in user", async () => {
    const res = await app.request("/api/me", { headers: { cookie: "session=ok" } });
    expect(res.status).toBe(200);
    expect(meResponseSchema.parse(await res.json()).user).toEqual(testUser);
  });

  it("rejects /api/me without a session using the shared error shape", async () => {
    const res = await app.request("/api/me");
    expect(res.status).toBe(401);
    expect(errorResponseSchema.parse(await res.json()).error.code).toBe("unauthorized");
  });

  it("uses the shared error shape for unknown routes", async () => {
    const res = await app.request("/api/nope");
    expect(res.status).toBe(404);
    expect(errorResponseSchema.parse(await res.json()).error.code).toBe("not_found");
  });

  it("delegates /api/auth/* to the auth handler", async () => {
    const res = await app.request("/api/auth/anything", { method: "POST" });
    expect(res.status).toBe(200);
  });
});
