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

/** The messages of one locale, keyed by dotted name (`error.unauthorized`). */
export type MessageMap = Readonly<Record<string, string>>;

/** Looks a key up in a message map; a missing key returns the key itself so the gap is visible. */
export function translate(
  messages: MessageMap,
  key: MessageKey,
  params?: Record<string, string | number>,
): string {
  const template = messages[key] ?? key;
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

export function localizeMessage(
  messages: MessageMap,
  message: string,
  fallbackKey?: MessageKey,
): string {
  if (isMessageKey(message)) return translate(messages, message, { min: PASSWORD_MIN_LENGTH });
  return translate(messages, fallbackKey ?? "error.badRequest");
}
