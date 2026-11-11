import { Brand } from "./brand";
import { LanguageSwitcher } from "./language-switcher";

type Props = { title: string; intro: string; children: React.ReactNode; footer: React.ReactNode };

/** Shared frame for the sign-in and sign-up pages: letterhead bar, signature, one column. */
export function AuthShell({ title, intro, children, footer }: Props) {
  return (
    <div className="min-h-dvh">
      <div className="bar" />
      <main className="mx-auto flex max-w-md flex-col gap-8 px-4 py-12 sm:py-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Brand />
          <LanguageSwitcher />
        </div>
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-normal text-navy">{title}</h1>
          <p className="text-graphite">{intro}</p>
        </header>
        {children}
        <p className="border-t border-hairline pt-6 text-sm text-slate">{footer}</p>
      </main>
    </div>
  );
}
