import Link from "next/link";
import { Brand } from "@/components/brand";
import { FichaUsina } from "@/components/ficha-usina";

const PILLARS = [
  {
    title: "Documentos no lugar certo",
    text: "Contratos, atas e procurações de cada usina ficam juntos, na versão que vale.",
  },
  {
    title: "Dados técnicos em dia",
    text: "Potência, distribuidora e situação da usina, com a data da última atualização.",
  },
  {
    title: "Acesso só a quem precisa",
    text: "Sócios, advogados e financiadores entram com conta própria e veem o que lhes cabe.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="min-h-dvh">
      <div className="barra" />

      <header className="border-b border-fio">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <Brand />
          <nav aria-label="Conta" className="flex items-center gap-2 sm:gap-3">
            <Link href="/entrar" className="btn btn-secundario">
              Entrar
            </Link>
            <Link href="/criar-conta" className="btn btn-primario">
              Criar conta
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16 lg:py-24">
          <div className="flex flex-col gap-6">
            <h1 className="max-w-[18ch] text-[clamp(2.25rem,5.5vw,4rem)] font-normal leading-[1.1] text-navy">
              Os dados de cada usina, num só lugar.
            </h1>
            <p className="max-w-[52ch] text-lg text-grafite">
              A Aurora reúne documentos e informações técnicas das usinas para que sócios, advogados, financiadores e
              distribuidoras consultem a mesma versão.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/criar-conta" className="btn btn-primario">
                Criar conta
              </Link>
              <Link href="/entrar" className="btn btn-secundario">
                Entrar
              </Link>
            </div>
          </div>
          <FichaUsina />
        </section>

        <section aria-labelledby="reune" className="border-t border-fio bg-gelo">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8 lg:py-20">
            <h2 id="reune" className="max-w-[28ch] text-2xl font-normal text-navy sm:text-3xl">
              O que a plataforma reúne
            </h2>
            <ul className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
              {PILLARS.map(({ title, text }) => (
                <li key={title} className="border-t-2 border-navy pt-4">
                  <h3 className="font-bold text-navy">{title}</h3>
                  <p className="mt-2 max-w-[40ch] text-grafite">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="comece" className="bg-navy text-papel">
          <div className="barra" />
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-14 sm:px-8 md:flex-row md:items-center md:justify-between lg:py-20">
            <div className="flex flex-col gap-4">
              <Brand negative />
              <h2 id="comece" className="max-w-[24ch] text-2xl font-normal sm:text-3xl">
                Crie sua conta e comece a consultar.
              </h2>
              <p className="max-w-[48ch] text-bruma">Use seu e-mail de trabalho. Leva menos de um minuto.</p>
            </div>
            <Link
              href="/criar-conta"
              className="btn border-papel bg-papel text-navy hover:bg-gelo"
            >
              Criar conta
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-fio">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-[0.8125rem] text-ardosia sm:px-8">
          <p>Aurora Tecnologias</p>
          <p>Aurora Platform · Revisão 11/2026</p>
        </div>
      </footer>
    </div>
  );
}
