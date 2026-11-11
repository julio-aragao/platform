import { DEFAULT_LOCALE, LOCALES, type Locale } from "@aurora/shared";
import type { Metadata } from "next";
import type { AppHref } from "./pathnames";
import { getPathname } from "./navigation";

export function pageMetadata(args: {
  locale: Locale;
  href: AppHref;
  title?: string;
  description?: string;
}): Metadata {
  const { locale, href, title, description } = args;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = getPathname({ locale: l, href });
  languages["x-default"] = getPathname({ locale: DEFAULT_LOCALE, href });
  return {
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    alternates: { canonical: getPathname({ locale, href }), languages },
  };
}
