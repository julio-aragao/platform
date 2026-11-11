import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { SignUpForm } from "@/components/sign-up-form";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Criar conta" };

export default async function CriarContaPage() {
  if (await getCurrentUser()) redirect("/painel");
  return (
    <AuthShell
      title="Criar conta"
      intro="Leva menos de um minuto. A senha precisa ter ao menos 8 caracteres."
      footer={
        <>
          Já tem conta?{" "}
          <Link href="/entrar" className="font-medium text-indigo underline underline-offset-4">
            Entrar
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthShell>
  );
}
