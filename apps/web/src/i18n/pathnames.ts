export const pathnames = {
  "/": "/",
  "/sign-in": { en: "/sign-in", "pt-br": "/entrar" },
  "/sign-up": { en: "/sign-up", "pt-br": "/criar-conta" },
  "/dashboard": { en: "/dashboard", "pt-br": "/painel" },
} as const;

export type AppHref = keyof typeof pathnames;
