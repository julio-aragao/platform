import { Hono } from "hono";
import type { MessageKey } from "@aurora/shared";
import type { AuthPort } from "./auth";
import { ApiError, errorResponse } from "./errors";
import { localeMiddleware, type AppEnv } from "./locale";
import type { MessageStore } from "./messages/store";
import { healthRoutes } from "./routes/health";
import { meRoutes } from "./routes/me";
import { messageRoutes } from "./routes/messages";

export interface AppDeps {
  auth: AuthPort;
  messages: MessageStore;
}

export function createApp({ auth, messages }: AppDeps) {
  const app = new Hono<AppEnv>();

  // These routes do not read the message table, so they are registered before the locale
  // middleware and stay up when messages cannot load.
  // Better Auth owns /api/auth/* and its own error format.
  app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw));
  app.route("/api", healthRoutes());

  app.use("*", localeMiddleware(messages));

  app.route("/api", meRoutes(auth));
  app.route("/api", messageRoutes(messages));

  app.notFound((c) => errorResponse(c, "not_found"));
  app.onError((err, c) => {
    if (err instanceof ApiError) return errorResponse(c, err.code, err.message as MessageKey);
    console.error(err);
    return errorResponse(c, "internal_error");
  });

  return app;
}
