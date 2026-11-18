import { unflattenMessages } from "@aurora/shared";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { fetchMessages } from "@/lib/messages";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  return { locale, messages: unflattenMessages(await fetchMessages(locale)) };
});
