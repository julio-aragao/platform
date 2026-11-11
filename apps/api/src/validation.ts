import type { Context } from "hono";
import type { $ZodError } from "zod/v4/core";
import { isMessageKey } from "@aurora/shared";
import { errorResponse } from "./errors";

/** zValidator hook: a 400 in the shared error shape, translated when the issue carries a message key. */
export function zodValidationHook(
  result: { success: boolean; error?: $ZodError },
  c: Context,
): Response | undefined {
  if (result.success) return undefined;
  const message = result.error?.issues[0]?.message;
  return errorResponse(c, "bad_request", isMessageKey(message) ? message : "error.badRequest");
}
