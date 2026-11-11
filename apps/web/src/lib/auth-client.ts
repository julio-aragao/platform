import type { Locale } from "@aurora/shared";
import { createAuthClient } from "better-auth/react";

export type AuthClient = ReturnType<typeof createAuthClient>;

/**
 * Better Auth browser client that sends the page language as Accept-Language on every call,
 * so API messages match the page. Same-origin by default: /api/auth/* is proxied by next.config.ts.
 */
export function createLocaleAuthClient(opts: {
  locale: Locale;
  baseURL?: string;
  fetchImpl?: typeof fetch;
}): AuthClient {
  const { locale, baseURL, fetchImpl } = opts;
  return createAuthClient({
    ...(baseURL !== undefined && { baseURL }),
    fetchOptions: {
      headers: { "Accept-Language": locale },
      ...(fetchImpl !== undefined && { customFetchImpl: fetchImpl }),
    },
  });
}
