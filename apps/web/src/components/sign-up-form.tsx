"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signUpInputSchema } from "@aurora/shared";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-messages";
import { Field, FormError } from "./form-parts";

export function SignUpForm() {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    const parsed = signUpInputSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    if (!parsed.success) {
      setFieldErrors(Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setFieldErrors({});
    setPending(true);
    const { error } = await authClient.signUp.email(parsed.data);
    setPending(false);
    if (error) return setFormError(authErrorMessage(error));
    router.push("/painel");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {formError ? <FormError message={formError} /> : null}
      <Field label="Nome" name="name" autoComplete="name" error={fieldErrors.name} />
      <Field label="E-mail" name="email" type="email" autoComplete="email" error={fieldErrors.email} />
      <Field
        label="Senha"
        name="password"
        type="password"
        autoComplete="new-password"
        error={fieldErrors.password}
      />
      <button type="submit" className="btn btn-primario" disabled={pending}>
        {pending ? "Criando conta…" : "Criar conta"}
      </button>
    </form>
  );
}
