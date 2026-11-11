export const LOCALES = ["pt-br", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "pt-br";

const MAX_HEADER_LENGTH = 1000;

const PRIMARY_SUBTAG_TO_LOCALE: Record<string, Locale> = {
  en: "en",
  pt: "pt-br",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function htmlLang(locale: Locale): string {
  return locale === "pt-br" ? "pt-BR" : locale;
}

export function negotiateLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage || acceptLanguage.length > MAX_HEADER_LENGTH) return DEFAULT_LOCALE;

  const candidates: { primary: string; q: number; index: number }[] = [];
  acceptLanguage.split(",").forEach((part, index) => {
    const [tag = "", ...params] = part.split(";").map((s) => s.trim());
    if (!tag || tag === "*") return;
    let q = 1;
    for (const param of params) {
      const match = /^q=(\d+(?:\.\d+)?|\.\d+)$/i.exec(param);
      if (match) q = Number(match[1]);
    }
    if (!Number.isFinite(q) || q <= 0) return;
    candidates.push({ primary: tag.split("-")[0]!.toLowerCase(), q, index });
  });

  candidates.sort((a, b) => b.q - a.q || a.index - b.index);
  for (const { primary } of candidates) {
    const locale = PRIMARY_SUBTAG_TO_LOCALE[primary];
    if (locale) return locale;
  }
  return DEFAULT_LOCALE;
}

export function resolveLocale(input: {
  cookie?: string | null;
  acceptLanguage?: string | null;
}): Locale {
  return isLocale(input.cookie) ? input.cookie : negotiateLocale(input.acceptLanguage);
}
