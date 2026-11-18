import { cookies } from "next/headers";
import { apiUrl } from "./api-url";
import { type Locale, meResponseSchema, type SessionUser } from "@aurora/shared";

const API_URL = apiUrl(process.env);

/**
 * Server-side session lookup: forwards the browser's cookies to the API with the page language.
 * Any failure (no cookie, non-2xx, network error, unexpected body) counts as signed out.
 */
export async function getCurrentUser(locale: Locale): Promise<SessionUser | null> {
  try {
    const cookie = (await cookies()).toString();
    if (!cookie) return null;
    const res = await fetch(`${API_URL}/api/me`, {
      headers: { cookie, "accept-language": locale },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return meResponseSchema.parse(await res.json()).user;
  } catch {
    return null;
  }
}
