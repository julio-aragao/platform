import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AuthShell } from "@/components/auth-shell";
import { SignInForm } from "@/components/sign-in-form";
import { pageMetadata } from "@/i18n/metadata";
import { Link, redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/session";

export async function generateMetadata({ params }: PageProps<"/[locale]/sign-in">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "auth" });
  return pageMetadata({ locale, href: "/sign-in", title: t("signIn.title") });
}

export default async function SignInPage({ params }: PageProps<"/[locale]/sign-in">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  if (await getCurrentUser(locale)) redirect({ href: "/dashboard", locale });
  const t = await getTranslations("auth");

  return (
    <AuthShell
      title={t("signIn.title")}
      intro={t("signIn.intro")}
      footer={
        <>
          {t("signIn.footerPrompt")}{" "}
          <Link href="/sign-up" className="font-medium text-indigo underline underline-offset-4">
            {t("signIn.footerLink")}
          </Link>
        </>
      }
    >
      <SignInForm />
    </AuthShell>
  );
}
