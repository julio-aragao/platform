import type { Context, MiddlewareHandler } from "hono";
import { DEFAULT_LOCALE, negotiateLocale, type Locale } from "@aurora/shared";

export type AppEnv = { Variables: { locale: Locale } };

/** Resolves the request language from `Accept-Language` once per request. */
export function localeMiddleware(): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    c.set("locale", negotiateLocale(c.req.header("accept-language")));
    await next();
  };
}

export function requestLocale(c: Context): Locale {
  return (c.get("locale") as Locale | undefined) ?? DEFAULT_LOCALE;
}
