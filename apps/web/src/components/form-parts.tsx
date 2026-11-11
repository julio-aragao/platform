import type { InputHTMLAttributes } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };

export function Field({ label, error, id, ...input }: FieldProps) {
  const fieldId = id ?? input.name;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="rotulo">
        {label}
      </label>
      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-erro` : undefined}
        className="min-h-11 border border-nevoa bg-papel px-3 text-base text-tinta focus-visible:border-navy"
        {...input}
      />
      {error ? (
        <p id={`${fieldId}-erro`} className="text-sm text-erro">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function FormError({ message }: { message: string }) {
  return (
    <p role="alert" className="border border-erro bg-erro-fundo px-3 py-2 text-sm text-erro">
      <strong className="font-semibold">Erro:</strong> {message}
    </p>
  );
}
