import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { ErrorCode, ErrorResponse } from "@aurora/shared";

const STATUS_CODES: Record<ErrorCode, ContentfulStatusCode> = {
  bad_request: 400,
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  internal_error: 500,
};

export class ApiError extends Error {
  constructor(
    readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
  }
}

/** The one place that builds the shared `{error: {code, message}}` response. */
export function errorResponse(c: Context, code: ErrorCode, message: string) {
  const body: ErrorResponse = { error: { code, message } };
  return c.json(body, STATUS_CODES[code]);
}
