import { z } from "zod";
import { LOCALES } from "./i18n/locales";

export const messagesQuerySchema = z.object({ locale: z.enum(LOCALES) });
export type MessagesQuery = z.infer<typeof messagesQuerySchema>;

export const messagesResponseSchema = z.object({
  locale: z.enum(LOCALES),
  messages: z.record(z.string(), z.string()),
});
export type MessagesResponse = z.infer<typeof messagesResponseSchema>;
