import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/session";

export default async function SignInPage({ params }: PageProps<"/[locale]/sign-in">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  if (await getCurrentUser(locale)) redirect({ href: "/dashboard", locale });
  const t = await getTranslations("auth");

  return (
      <>Work In progress</>
  );
}
