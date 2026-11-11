import { Hono } from "hono";
import type { AuthPort } from "./auth";
import { ApiError, errorResponse } from "./errors";
import { healthRoutes } from "./routes/health";
import { meRoutes } from "./routes/me";

export interface AppDeps {
  auth: AuthPort;
}

export function createApp({ auth }: AppDeps) {
  const app = new Hono();

  // Better Auth owns /api/auth/* and its own error format.
  app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw));

  app.route("/api", healthRoutes());
  app.route("/api", meRoutes(auth));

  app.notFound((c) => errorResponse(c, "not_found", "Rota não encontrada."));
  app.onError((err, c) => {
    if (err instanceof ApiError) return errorResponse(c, err.code, err.message);
    console.error(err);
    return errorResponse(c, "internal_error", "Algo deu errado. Tente novamente.");
  });

  return app;
}
