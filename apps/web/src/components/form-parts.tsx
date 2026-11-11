import { useTranslations } from "next-intl";
import type { InputHTMLAttributes } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };

export function Field({ label, error, id, ...input }: FieldProps) {
  const fieldId = id ?? input.name;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="label">
        {label}
      </label>
      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className="min-h-11 border border-fog bg-paper px-3 text-base text-ink focus-visible:border-navy"
        {...input}
      />
      {error ? (
        <p id={`${fieldId}-error`} className="text-sm text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function FormError({ message }: { message: string }) {
  const t = useTranslations("form");
  return (
    <p role="alert" className="border border-error bg-error-bg px-3 py-2 text-sm text-error">
      <strong className="font-semibold">{t("errorLabel")}</strong> {message}
    </p>
  );
}
