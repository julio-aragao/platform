import type { Locale } from "@aurora/shared";

export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";
const ONE_YEAR_SECONDS = 31536000;

export function serializeLocaleCookie(locale: Locale, options: { secure: boolean }): string {
  const parts = [
    `${LOCALE_COOKIE_NAME}=${locale}`,
    "Path=/",
    `Max-Age=${ONE_YEAR_SECONDS}`,
    "SameSite=Lax",
  ];
  if (options.secure) parts.push("Secure");
  return parts.join("; ");
}
