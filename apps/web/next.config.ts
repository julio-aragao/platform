import type { NextConfig } from "next";

// Read at the edge: the browser only ever talks to the web origin, which proxies /api to the API.
// That keeps Better Auth's cookies same-origin and removes any need for CORS.
const apiUrl = process.env.API_URL ?? "http://localhost:4000";

const config: NextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${apiUrl}/api/:path*` }];
  },
};

export default config;
