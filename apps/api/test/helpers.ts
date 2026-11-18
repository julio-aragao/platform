import { buildSeedRows, type SessionUser } from "@aurora/shared";
import { createApp } from "../src/app";
import type { AuthPort } from "../src/auth";
import { createCachedMessageStore, type MessageStore } from "../src/messages/store";

export const testUser: SessionUser = { id: "u1", name: "Maria Silva", email: "maria@aurora.test" };

/** Fake auth honouring the AuthPort contract: signed in only when the cookie says so. */
export function fakeAuth(): AuthPort {
  return {
    handler: async () => new Response(JSON.stringify({ ok: true }), { status: 200 }),
    getUser: async (headers) => (headers.get("cookie")?.includes("session=ok") ? testUser : null),
  };
}

/** A real cached store fed by the seed rows, so tests need no database. */
export function fakeMessageStore(): MessageStore {
  return createCachedMessageStore(async () => buildSeedRows());
}

export function buildTestApp(auth: AuthPort = fakeAuth(), messages: MessageStore = fakeMessageStore()) {
  return createApp({ auth, messages });
}
