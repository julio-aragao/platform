import type { SessionUser } from "@aurora/shared";
import { createApp } from "../src/app";
import type { AuthPort } from "../src/auth";

export const testUser: SessionUser = { id: "u1", name: "Maria Silva", email: "maria@aurora.test" };

/** Fake auth honouring the AuthPort contract: signed in only when the cookie says so. */
export function fakeAuth(): AuthPort {
  return {
    handler: async () => new Response(JSON.stringify({ ok: true }), { status: 200 }),
    getUser: async (headers) => (headers.get("cookie")?.includes("session=ok") ? testUser : null),
  };
}

export function buildTestApp(auth: AuthPort = fakeAuth()) {
  return createApp({ auth });
}
