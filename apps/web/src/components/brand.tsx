import Link from "next/link";

type Props = { negative?: boolean; className?: string };

/** Reduced signature (12–72mm / 48–360px). Never below 48px wide. */
export function Brand({ negative = false, className }: Props) {
  const src = negative ? "/brand/Aurora_Marca-Reduzida-Negativa.svg" : "/brand/Aurora_Marca-Reduzida.svg";
  return (
    <Link href="/" aria-label="Aurora, página inicial" className={className}>
      <img src={src} alt="" width={186} height={28} className="h-7 w-auto" />
    </Link>
  );
}
