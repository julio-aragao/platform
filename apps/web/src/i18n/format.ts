import type { Locale } from "@aurora/shared";

const INTL_LOCALE: Record<Locale, string> = { "pt-br": "pt-BR", en: "en-US" };

export function formatNumber(locale: Locale, value: number): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale]).format(value);
}

export function formatShortDate(locale: Locale, date: Date): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatMonthYear(locale: Locale, date: Date): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
