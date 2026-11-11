import { PASSWORD_MIN_LENGTH } from "../auth";
import { en, type MessageKey } from "./catalogs/en";
import { ptBr } from "./catalogs/pt-br";
import type { Locale } from "./locales";

export type { MessageKey };
export { LOCALE_NAMES } from "./catalogs/locale-names";

export const catalogs: Record<Locale, Record<MessageKey, string>> = { en, "pt-br": ptBr };

export function isMessageKey(value: unknown): value is MessageKey {
  return typeof value === "string" && Object.hasOwn(en, value);
}

export function translate(
  locale: Locale,
  key: MessageKey,
  params?: Record<string, string | number>,
): string {
  const template = catalogs[locale][key];
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

export function localizeMessage(locale: Locale, message: string, fallbackKey?: MessageKey): string {
  if (isMessageKey(message)) return translate(locale, message, { min: PASSWORD_MIN_LENGTH });
  return translate(locale, fallbackKey ?? "error.badRequest");
}
