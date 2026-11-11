import { type AppHref, pathnames } from "./pathnames";

type LegacyTarget = Exclude<AppHref, "/">;

const LEGACY_SLUGS = new Map<string, LegacyTarget>(
  (Object.keys(pathnames) as AppHref[])
    .filter((href): href is LegacyTarget => href !== "/")
    .map((href) => [pathnames[href]["pt-br"], href]),
);

/** Maps an unprefixed pt-br slug (trailing slash tolerated) to its canonical route. */
export function legacyRedirectTarget(pathname: string): LegacyTarget | null {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return LEGACY_SLUGS.get(normalized) ?? null;
}
