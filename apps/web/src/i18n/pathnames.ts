export const pathnames = {
  "/": "/",
  "/admin-sign-in": { en: "/admin-sign-in", "pt-br": "/adm-entrar" },
  "/admin-sign-up": { en: "/admin-sign-up", "pt-br": "/criar-conta-adm" },
  "/dashboard": { en: "/dashboard", "pt-br": "/painel" },
} as const;

export type AppHref = keyof typeof pathnames;
