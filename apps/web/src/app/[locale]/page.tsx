import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { PlantSheet } from "@/components/plant-sheet";
import { formatMonthYear } from "@/i18n/format";
import { pageMetadata } from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { COMPANY_NAME } from "@/lib/company";

const PILLARS = ["pillar1", "pillar2", "pillar3"] as const;
const REVISION_DATE = new Date("2026-11-01T00:00:00Z");

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  return pageMetadata({ locale, href: "/" });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const common = await getTranslations("common");

  return (
    <div className="min-h-dvh">
      <div className="bar" />

      <header className="border-b border-hairline">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <Brand />
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <LanguageSwitcher />
            <nav aria-label={common("accountNavLabel")} className="flex items-center gap-2 sm:gap-3">
              <Link href="/sign-in" className="btn btn-secondary">
                {common("signIn")}
              </Link>
              <Link href="/sign-up" className="btn btn-primary">
                {common("signUp")}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16 lg:py-24">
          <div className="flex flex-col gap-6">
            <h1 className="max-w-[18ch] text-[clamp(2.25rem,5.5vw,4rem)] font-normal leading-[1.1] text-navy">
              {t("heroTitle")}
            </h1>
            <p className="max-w-[52ch] text-lg text-graphite">{t("heroText")}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/sign-up" className="btn btn-primary">
                {common("signUp")}
              </Link>
              <Link href="/sign-in" className="btn btn-secondary">
                {common("signIn")}
              </Link>
            </div>
          </div>
          <PlantSheet />
        </section>

        <section aria-labelledby="pillars-heading" className="border-t border-hairline bg-frost">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8 lg:py-20">
            <h2 id="pillars-heading" className="max-w-[28ch] text-2xl font-normal text-navy sm:text-3xl">
              {t("pillarsTitle")}
            </h2>
            <ul className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
              {PILLARS.map((pillar) => (
                <li key={pillar} className="border-t-2 border-navy pt-4">
                  <h3 className="font-bold text-navy">{t(`pillars.${pillar}.title`)}</h3>
                  <p className="mt-2 max-w-[40ch] text-graphite">{t(`pillars.${pillar}.text`)}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="cta-heading" className="bg-navy text-paper">
          <div className="bar" />
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-14 sm:px-8 md:flex-row md:items-center md:justify-between lg:py-20">
            <div className="flex flex-col gap-4">
              <Brand negative />
              <h2 id="cta-heading" className="max-w-[24ch] text-2xl font-normal sm:text-3xl">
                {t("ctaTitle")}
              </h2>
              <p className="max-w-[48ch] text-haze">{t("ctaText")}</p>
            </div>
            <Link href="/sign-up" className="btn border-paper bg-paper text-navy hover:bg-frost">
              {common("signUp")}
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-hairline">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-[0.8125rem] text-slate sm:px-8">
          <p>{COMPANY_NAME}</p>
          <p>{t("revision", { date: formatMonthYear(locale, REVISION_DATE) })}</p>
        </div>
      </footer>
    </div>
  );
}
