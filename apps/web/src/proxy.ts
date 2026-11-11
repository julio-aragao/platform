import { isLocale, resolveLocale } from "@aurora/shared";
import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { legacyRedirectTarget } from "./i18n/legacy-redirects";
import { LOCALE_COOKIE_NAME } from "./i18n/locale-cookie";
import { getPathname } from "./i18n/navigation";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

function redirectTo(request: NextRequest, pathname: string, status: 307 | 308): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  const response = NextResponse.redirect(url, status);
  // The target depends on the visitor's language, so it must never be cached or shared.
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Vary", "Cookie, Accept-Language");
  return response;
}

/**
 * Locale routing. Unprefixed and legacy URLs are resolved here (URL, then cookie, then
 * Accept-Language, then pt-br); already-prefixed requests are handed to next-intl.
 */
export default function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const [, first = "", ...rest] = pathname.split("/");
  const lowered = first.toLowerCase();

  if (isLocale(lowered)) {
    if (first !== lowered) return redirectTo(request, ["", lowered, ...rest].join("/"), 307);
    return intlMiddleware(request);
  }

  const resolved = resolveLocale({
    cookie: request.cookies.get(LOCALE_COOKIE_NAME)?.value,
    acceptLanguage: request.headers.get("accept-language"),
  });

  const legacyHref = legacyRedirectTarget(pathname);
  if (legacyHref) return redirectTo(request, getPathname({ locale: resolved, href: legacyHref }), 308);

  return redirectTo(request, pathname === "/" ? `/${resolved}` : `/${resolved}${pathname}`, 307);
}

export const config = { matcher: ["/((?!api/|_next/|brand/|.*\\..*).*)"] };
