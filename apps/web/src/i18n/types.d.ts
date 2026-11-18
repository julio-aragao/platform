import type { Locale, WebMessages } from "@aurora/shared";

declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: WebMessages;
  }
}
