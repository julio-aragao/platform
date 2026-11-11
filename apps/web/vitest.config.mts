import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // next-intl imports "next/navigation" without an extension; inline it so Vite resolves it.
    server: { deps: { inline: ["next-intl"] } },
  },
});
