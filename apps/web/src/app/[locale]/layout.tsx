import { htmlLang } from "@aurora/shared";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { plexMono, plexSans } from "@/lib/fonts";
import { routing } from "@/i18n/routing";
import { COMPANY_NAME } from "@/lib/company";
import { siteUrl } from "@/lib/site";
import "../globals.css";

// Messages come from the API per request (no fallback to the files), so pages render on demand
// and the build never needs the API.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    metadataBase: siteUrl(process.env),
    title: { default: "Aurora", template: "%s · Aurora" },
    description: t("description", { company: COMPANY_NAME }),
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={htmlLang(locale)} className={`${plexSans.variable} ${plexMono.variable}`}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
