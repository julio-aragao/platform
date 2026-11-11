import { z } from "zod";

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
