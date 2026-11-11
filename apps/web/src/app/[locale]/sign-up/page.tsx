import { PASSWORD_MIN_LENGTH } from "@aurora/shared";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AuthShell } from "@/components/auth-shell";
import { SignUpForm } from "@/components/sign-up-form";
import { pageMetadata } from "@/i18n/metadata";
import { Link, redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/session";

export async function generateMetadata({ params }: PageProps<"/[locale]/sign-up">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "auth" });
  return pageMetadata({ locale, href: "/sign-up", title: t("signUp.title") });
}

export default async function SignUpPage({ params }: PageProps<"/[locale]/sign-up">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  if (await getCurrentUser(locale)) redirect({ href: "/dashboard", locale });
  const t = await getTranslations("auth");

  return (
    <AuthShell
      title={t("signUp.title")}
      intro={t("signUp.intro", { min: PASSWORD_MIN_LENGTH })}
      footer={
        <>
          {t("signUp.footerPrompt")}{" "}
          <Link href="/sign-in" className="font-medium text-indigo underline underline-offset-4">
            {t("signUp.footerLink")}
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthShell>
  );
}
