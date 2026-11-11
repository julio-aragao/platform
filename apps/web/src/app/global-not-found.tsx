import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { htmlLang, isLocale } from "@aurora/shared";
import { Brand } from "@/components/brand";
import { Link } from "@/i18n/navigation";
import { plexMono, plexSans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = { title: "404 · Aurora" };

/**
 * Unmatched URLs. A dynamic `[locale]` root layout cannot host `not-found.tsx` (Next falls back
 * to an unstyled shell without `lang`), so this page renders its own document. The proxy has
 * already resolved the locale and next-intl exposes it through the request config.
 */
export default async function GlobalNotFound() {
  const requested = await getLocale();
  const locale = isLocale(requested) ? requested : "pt-br";
  const t = await getTranslations({ locale, namespace: "notFound" });

  return (
    <html lang={htmlLang(locale)} className={`${plexSans.variable} ${plexMono.variable}`}>
      <body>
        <NextIntlClientProvider locale={locale}>
          <div className="min-h-dvh">
            <div className="bar" />
            <header className="border-b border-hairline">
              <div className="mx-auto flex max-w-6xl items-center px-4 py-4 sm:px-8">
                <Brand />
              </div>
            </header>
            <main className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:px-8 lg:py-24">
              <h1 className="max-w-[18ch] text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.1] text-navy">
                {t("title")}
              </h1>
              <p className="max-w-[52ch] text-lg text-graphite">{t("text")}</p>
              <Link href="/" className="btn btn-primary">
                {t("back")}
              </Link>
            </main>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
