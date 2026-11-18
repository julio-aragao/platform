import type { Locale } from "../../locales";
import en from "./en.json";
import ptBr from "./pt-br.json";

export type WebMessages = typeof en;

export const webCatalogs: Record<Locale, WebMessages> = { en, "pt-br": ptBr };
