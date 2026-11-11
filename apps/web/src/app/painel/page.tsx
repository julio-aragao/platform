import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Brand } from "@/components/brand";
import { SignOutButton } from "@/components/sign-out-button";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Painel" };

export default async function PainelPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");

  return (
    <div className="min-h-dvh">
      <div className="barra" />
      <header className="border-b border-fio">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <Brand />
          <div className="flex items-center gap-4">
            <span className="dado hidden text-ardosia sm:inline">{user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-8">
        <h1 className="text-3xl font-normal text-navy">Olá, {user.name}</h1>
        <section className="max-w-xl border border-fio bg-gelo p-6">
          <h2 className="font-bold text-navy">Nenhuma usina por aqui ainda</h2>
          <p className="mt-2 text-grafite">
            Sua conta está ativa. As usinas e os documentos vão aparecer neste painel assim que forem cadastrados.
          </p>
        </section>
      </main>
    </div>
  );
}
