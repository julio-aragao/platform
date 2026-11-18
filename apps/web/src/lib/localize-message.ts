import { isMessageKey, PASSWORD_MIN_LENGTH } from "@aurora/shared";
import { useTranslations } from "next-intl";

export type Translate = (key: string, values?: Record<string, string | number>) => string;

/** Turns a shared message key (from validation or an API error) into text; any other text becomes the generic error. */
export function createLocalizer(t: Translate): (message: string) => string {
  return (message) => (isMessageKey(message) ? t(message, { min: PASSWORD_MIN_LENGTH }) : t("error.badRequest"));
}

export function useLocalizer(): (message: string) => string {
  // next-intl types `t` against the statically known keys; shared keys are checked by `isMessageKey` instead.
  return createLocalizer(useTranslations() as unknown as Translate);
}
