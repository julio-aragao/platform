import { DEFAULT_LOCALE, LOCALES } from "@aurora/shared";
import { defineRouting } from "next-intl/routing";
import { pathnames } from "./pathnames";

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
  pathnames,
  localeDetection: false,
  localeCookie: false,
  alternateLinks: false,
});
