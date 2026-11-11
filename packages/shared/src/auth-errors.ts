import type { MessageKey } from "./i18n/messages";

const AUTH_ERROR_KEYS: Record<string, MessageKey> = {
  INVALID_EMAIL_OR_PASSWORD: "auth.invalidCredentials",
  USER_ALREADY_EXISTS: "auth.userExists",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "auth.userExists",
  PASSWORD_TOO_SHORT: "auth.passwordTooShort",
};

export function authErrorMessageKey(code: string | null | undefined): MessageKey {
  if (!code || !Object.hasOwn(AUTH_ERROR_KEYS, code)) return "auth.fallback";
  return AUTH_ERROR_KEYS[code] ?? "auth.fallback";
}
