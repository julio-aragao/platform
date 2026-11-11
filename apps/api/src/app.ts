import { Hono } from "hono";
import type { MessageKey } from "@aurora/shared";
import type { AuthPort } from "./auth";
import { ApiError, errorResponse } from "./errors";
import { localeMiddleware, type AppEnv } from "./locale";
import { healthRoutes } from "./routes/health";
import { meRoutes } from "./routes/me";

export interface AppDeps {
  auth: AuthPort;
}

export function createApp({ auth }: AppDeps) {
  const app = new Hono<AppEnv>();

  app.use("*", localeMiddleware());

  // Better Auth owns /api/auth/* and its own error format.
  app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw));

  app.route("/api", healthRoutes());
  app.route("/api", meRoutes(auth));

  app.notFound((c) => errorResponse(c, "not_found"));
  app.onError((err, c) => {
    if (err instanceof ApiError) return errorResponse(c, err.code, err.message as MessageKey);
    console.error(err);
    return errorResponse(c, "internal_error");
  });

  return app;
}
