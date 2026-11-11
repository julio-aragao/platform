import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Props = { negative?: boolean; className?: string };

/** Reduced signature (12–72mm / 48–360px). Never below 48px wide. */
export function Brand({ negative = false, className }: Props) {
  const t = useTranslations("common");
  const src = negative ? "/brand/aurora-logo-compact-negative.svg" : "/brand/aurora-logo-compact.svg";
  return (
    <Link href="/" aria-label={t("brandHomeLabel")} className={className}>
      <img src={src} alt="" width={186} height={28} className="h-7 w-auto" />
    </Link>
  );
}
