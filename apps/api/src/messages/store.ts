import { LOCALES, isLocale, type Locale, type MessageMap } from "@aurora/shared";

export interface MessageRecord {
  name: string;
  message: string;
  locale: string;
}

export interface MessageStore {
  forLocale(locale: Locale): Promise<MessageMap>;
}

export interface ClearableMessageStore extends MessageStore {
  /** Drops the cache so the next read reloads (for a future message edit page). */
  clear(): void;
}

type ByLocale = Record<Locale, Record<string, string>>;

function groupByLocale(rows: ReadonlyArray<MessageRecord>): ByLocale {
  const grouped = Object.fromEntries(LOCALES.map((locale) => [locale, {}])) as ByLocale;
  for (const row of rows) {
    if (isLocale(row.locale)) grouped[row.locale][row.name] = row.message;
  }
  return grouped;
}

/**
 * Loads every message lazily on first use and keeps it in memory. A failed load and an empty load
 * (zero rows, e.g. the API started before the seed) are never cached, so the next call asks again.
 */
export function createCachedMessageStore(
  load: () => Promise<ReadonlyArray<MessageRecord>>,
): ClearableMessageStore {
  let cached: Promise<ByLocale> | null = null;

  return {
    async forLocale(locale) {
      if (!cached) {
        const pending: Promise<ByLocale> = load().then((rows) => {
          if (rows.length === 0 && cached === pending) cached = null;
          return groupByLocale(rows);
        });
        cached = pending;
        pending.catch(() => {
          if (cached === pending) cached = null;
        });
      }
      return (await cached)[locale];
    },
    clear() {
      cached = null;
    },
  };
}
