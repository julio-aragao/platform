import { z } from "zod";
import type { MessageKey } from "./i18n/messages";

export const errorCodeSchema = z.enum([
  "bad_request",
  "unauthorized",
  "forbidden",
  "not_found",
  "internal_error",
]);
export type ErrorCode = z.infer<typeof errorCodeSchema>;

/** Every API error response (except Better Auth's own /api/auth/* routes). */
export const errorResponseSchema = z.object({
  error: z.object({ code: errorCodeSchema, message: z.string() }),
});
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export const errorCodeMessageKey: Record<ErrorCode, MessageKey> = {
  bad_request: "error.badRequest",
  unauthorized: "error.unauthorized",
  forbidden: "error.forbidden",
  not_found: "error.notFound",
  internal_error: "error.internal",
};
