"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuthClient } from "@/lib/use-auth-client";

export function SignOutButton() {
  const router = useRouter();
  const authClient = useAuthClient();
  const t = useTranslations("common");
  async function signOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }
  return (
    <button type="button" onClick={signOut} className="btn btn-secondary">
      {t("signOut")}
    </button>
  );
}
