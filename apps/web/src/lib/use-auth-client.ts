import { useLocale } from "next-intl";
import { useMemo } from "react";
import { type AuthClient, createLocaleAuthClient } from "./auth-client";

/** The auth client for the current page language. */
export function useAuthClient(): AuthClient {
  const locale = useLocale();
  return useMemo(() => createLocaleAuthClient({ locale }), [locale]);
}
