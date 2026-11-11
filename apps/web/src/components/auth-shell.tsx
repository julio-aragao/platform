import { Brand } from "./brand";

type Props = { title: string; intro: string; children: React.ReactNode; footer: React.ReactNode };

/** Shared frame for the sign-in and sign-up pages: letterhead bar, signature, one column. */
export function AuthShell({ title, intro, children, footer }: Props) {
  return (
    <div className="min-h-dvh">
      <div className="barra" />
      <main className="mx-auto flex max-w-md flex-col gap-8 px-4 py-12 sm:py-20">
        <Brand />
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-normal text-navy">{title}</h1>
          <p className="text-grafite">{intro}</p>
        </header>
        {children}
        <p className="border-t border-fio pt-6 text-sm text-ardosia">{footer}</p>
      </main>
    </div>
  );
}
