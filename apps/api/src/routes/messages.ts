import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { messagesQuerySchema, type MessagesResponse } from "@aurora/shared";
import type { MessageStore } from "../messages/store";
import { zodValidationHook } from "../validation";

export function messageRoutes(store: MessageStore) {
  return new Hono().get("/messages", zValidator("query", messagesQuerySchema, zodValidationHook), async (c) => {
    const { locale } = c.req.valid("query");
    c.header("Cache-Control", "no-store");
    return c.json<MessagesResponse>({ locale, messages: await store.forLocale(locale) });
  });
}
