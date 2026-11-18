import { catalogs } from "./messages";
import { webCatalogs } from "./catalogs/web";
import { flattenMessages } from "./flatten";
import { LOCALES, type Locale } from "./locales";

export interface MessageRow {
  id: string;
  name: string;
  message: string;
  locale: Locale;
}

export function buildSeedRows(): MessageRow[] {
  const rows: MessageRow[] = [];
  for (const locale of LOCALES) {
    const seen = new Set<string>();
    const sources = [flattenMessages(webCatalogs[locale]), catalogs[locale]];
    for (const source of sources) {
      for (const [name, message] of Object.entries(source)) {
        if (seen.has(name)) throw new Error(`Duplicate message name "${name}" for locale ${locale}`);
        seen.add(name);
        rows.push({ id: `${locale}:${name}`, name, message, locale });
      }
    }
  }
  return rows;
}
