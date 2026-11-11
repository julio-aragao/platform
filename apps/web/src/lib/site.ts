const DEFAULT_ORIGIN = "http://localhost:3000";

/**
 * The public origin of the web app, used as `metadataBase` so canonical and hreflang
 * links are absolute. The env record is passed in from the edge; pages are prerendered,
 * so WEB_ORIGIN is read at build time.
 */
export function siteUrl(env: Record<string, string | undefined>): URL {
  return new URL(env.WEB_ORIGIN || DEFAULT_ORIGIN);
}
