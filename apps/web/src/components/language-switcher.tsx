"use client";

import { htmlLang, LOCALE_NAMES, type Locale } from "@aurora/shared";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Suspense } from "react";
import { serializeLocaleCookie } from "@/i18n/locale-cookie";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type Query = Record<string, string | string[]>;

function toQuery(params: URLSearchParams): Query {
  const query: Query = {};
  for (const key of new Set(params.keys())) {
    const values = params.getAll(key);
    query[key] = values.length === 1 ? values[0]! : values;
  }
  return query;
}

function rememberLocale(locale: Locale) {
  document.cookie = serializeLocaleCookie(locale, { secure: location.protocol === "https:" });
}

function LocaleLinks({ query }: { query: Query }) {
  const t = useTranslations("common");
  const current = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label={t("languageSwitcherLabel")} className="flex items-center">
      {routing.locales.map((locale) => {
        const active = locale === current;
        return (
          <Link
            key={locale}
            href={{ pathname, query }}
            locale={locale}
            lang={htmlLang(locale)}
            hrefLang={htmlLang(locale)}
            aria-current={active ? "true" : undefined}
            onClick={() => rememberLocale(locale)}
            className={`inline-flex min-h-11 items-center px-2 text-sm ${
              active ? "font-semibold text-navy underline underline-offset-4" : "text-slate hover:text-navy"
            }`}
          >
            {LOCALE_NAMES[locale]}
          </Link>
        );
      })}
    </nav>
  );
}

function LocaleLinksWithQuery() {
  return <LocaleLinks query={toQuery(useSearchParams())} />;
}

/** Links to the current page in every language; the query survives the switch. */
export function LanguageSwitcher() {
  return (
    <Suspense fallback={<LocaleLinks query={{}} />}>
      <LocaleLinksWithQuery />
    </Suspense>
  );
}
