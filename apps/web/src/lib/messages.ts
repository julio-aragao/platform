import { apiUrl } from "./api-url";
import { type Locale, type MessageMap, messagesResponseSchema } from "@aurora/shared";

type FetchMessagesOptions = { apiUrl?: string; fetchImpl?: typeof fetch };

/**
 * Loads one locale's messages (flat, dotted names) from the API. There is no fallback to the
 * catalog files: a failed call, an unexpected body or an empty set throws so the page fails visibly.
 */
export async function fetchMessages(
  locale: Locale,
  { apiUrl: baseUrl = apiUrl(process.env), fetchImpl = fetch }: FetchMessagesOptions = {},
): Promise<MessageMap> {
  const res = await fetchImpl(`${baseUrl}/api/messages?locale=${encodeURIComponent(locale)}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Loading messages for "${locale}" failed with status ${res.status}`);
  const { messages } = messagesResponseSchema.parse(await res.json());
  if (Object.keys(messages).length === 0) {
    throw new Error(`The API returned no messages for "${locale}"; run \`pnpm db:seed\` to load them`);
  }
  return messages;
}
