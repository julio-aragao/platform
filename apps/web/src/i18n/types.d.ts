import type { Locale } from "@aurora/shared";
import type en from "./messages/en.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof en;
  }
}
