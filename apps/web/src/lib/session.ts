import { cookies } from "next/headers";
import { meResponseSchema, type SessionUser } from "@aurora/shared";

const apiUrl = process.env.API_URL ?? "http://localhost:4000";

/** Server-side session lookup: forwards the browser's cookies to the API. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookie = (await cookies()).toString();
  if (!cookie) return null;
  try {
    const res = await fetch(`${apiUrl}/api/me`, { headers: { cookie }, cache: "no-store" });
    if (!res.ok) return null;
    return meResponseSchema.parse(await res.json()).user;
  } catch {
    return null;
  }
}
