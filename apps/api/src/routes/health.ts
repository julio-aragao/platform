import { Hono } from "hono";
import type { HealthResponse } from "@aurora/shared";

export function healthRoutes() {
  return new Hono().get("/health", (c) => c.json<HealthResponse>({ status: "ok" }));
}
