import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import {
  errorCodeMessageKey,
  localizeMessage,
  type ErrorCode,
  type ErrorResponse,
  type MessageKey,
} from "@aurora/shared";
import { requestLocale } from "./locale";

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
    messageKey: MessageKey = errorCodeMessageKey[code],
  ) {
    super(messageKey);
  }
}

/** The one place that builds the shared `{error: {code, message}}` response, translated per request. */
export function errorResponse(c: Context, code: ErrorCode, messageKey?: MessageKey) {
  const key = messageKey ?? errorCodeMessageKey[code];
  const body: ErrorResponse = {
    error: { code, message: localizeMessage(requestLocale(c), key, errorCodeMessageKey[code]) },
  };
  return c.json(body, STATUS_CODES[code]);
}
