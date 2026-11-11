import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { SignInForm } from "@/components/sign-in-form";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Entrar" };

export default async function EntrarPage() {
  if (await getCurrentUser()) redirect("/painel");
  return (
    <AuthShell
      title="Entrar"
      intro="Use o e-mail e a senha da sua conta Aurora."
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link href="/criar-conta" className="font-medium text-indigo underline underline-offset-4">
            Criar conta
          </Link>
        </>
      }
    >
      <SignInForm />
    </AuthShell>
  );
}
