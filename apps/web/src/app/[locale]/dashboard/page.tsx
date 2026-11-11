import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SignOutButton } from "@/components/sign-out-button";
import { pageMetadata } from "@/i18n/metadata";
import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/session";

export async function generateMetadata({ params }: PageProps<"/[locale]/dashboard">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "dashboard" });
  return pageMetadata({ locale, href: "/dashboard", title: t("title") });
}

export default async function DashboardPage({ params }: PageProps<"/[locale]/dashboard">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const user = await getCurrentUser(locale);
  if (!user) return redirect({ href: "/sign-in", locale });
  const t = await getTranslations("dashboard");

  return (
    <div className="min-h-dvh">
      <div className="bar" />
      <header className="border-b border-hairline">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <Brand />
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <LanguageSwitcher />
            <span className="data hidden text-slate sm:inline">{user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-8">
        <h1 className="text-3xl font-normal text-navy">{t("greeting", { name: user.name })}</h1>
        <section className="max-w-xl border border-hairline bg-frost p-6">
          <h2 className="font-bold text-navy">{t("emptyTitle")}</h2>
          <p className="mt-2 text-graphite">{t("emptyText")}</p>
        </section>
      </main>
    </div>
  );
}
