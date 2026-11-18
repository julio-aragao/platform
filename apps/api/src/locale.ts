import type { Context, MiddlewareHandler } from "hono";
import { negotiateLocale, type MessageMap } from "@aurora/shared";
import type { MessageStore } from "./messages/store";

export type AppEnv = { Variables: { messages: MessageMap } };

/**
 * Resolves the request language from `Accept-Language` and loads its messages once per request.
 * When the messages cannot load, or the locale has none, the request still proceeds with an empty map,
 * so text falls back to the key.
 */
export function localeMiddleware(store: MessageStore): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const locale = negotiateLocale(c.req.header("accept-language"));
    try {
      const messages = await store.forLocale(locale);
      if (Object.keys(messages).length === 0) {
        console.error(`No messages found for locale "${locale}"; falling back to message keys. Run pnpm db:seed.`);
      }
      c.set("messages", messages);
    } catch (error) {
      console.error("Could not load messages; falling back to message keys.", error);
      c.set("messages", {});
    }
    await next();
  };
}

export function requestMessages(c: Context): MessageMap {
  return (c.get("messages") as MessageMap | undefined) ?? {};
}
