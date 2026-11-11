import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/.next/**", "**/generated/**", "**/next-env.d.ts"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["apps/web/src/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "next/link",
              message: "Use Link from @/i18n/navigation so links are localised.",
            },
            {
              name: "next/navigation",
              importNames: ["redirect", "permanentRedirect", "useRouter", "usePathname"],
              message: "Use the localised version from @/i18n/navigation.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["apps/web/src/i18n/navigation.ts"],
    rules: { "no-restricted-imports": "off" },
  },
);
