import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Read at the edge: the browser only ever talks to the web origin, which proxies /api to the API.
// That keeps Better Auth's cookies same-origin and removes any need for CORS.
const apiUrl = process.env.API_URL ?? "http://localhost:4000";

const config: NextConfig = {
  // Unmatched URLs render src/app/global-not-found.tsx (the `[locale]` root layout cannot host not-found.tsx).
  experimental: { globalNotFound: true },
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${apiUrl}/api/:path*` }];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(config);
