"use client";

import { authErrorMessageKey, localizeMessage, signUpInputSchema } from "@aurora/shared";
import { useLocale, useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { useRouter } from "@/i18n/navigation";
import { fieldErrorsFromIssues } from "@/lib/form-errors";
import { useAuthClient } from "@/lib/use-auth-client";
import { Field, FormError } from "./form-parts";

export function SignUpForm() {
  const router = useRouter();
  const locale = useLocale();
  const authClient = useAuthClient();
  const t = useTranslations("auth");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    const parsed = signUpInputSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    if (!parsed.success) {
      setFieldErrors(fieldErrorsFromIssues(locale, parsed.error.issues));
      return;
    }
    setFieldErrors({});
    setPending(true);
    const { error } = await authClient.signUp.email(parsed.data);
    setPending(false);
    if (error) return setFormError(localizeMessage(locale, authErrorMessageKey(error.code)));
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {formError ? <FormError message={formError} /> : null}
      <Field label={t("fields.name")} name="name" autoComplete="name" error={fieldErrors.name} />
      <Field
        label={t("fields.email")}
        name="email"
        type="email"
        autoComplete="email"
        error={fieldErrors.email}
      />
      <Field
        label={t("fields.password")}
        name="password"
        type="password"
        autoComplete="new-password"
        error={fieldErrors.password}
      />
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? t("signUp.pending") : t("signUp.submit")}
      </button>
    </form>
  );
}
