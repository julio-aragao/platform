import { useLocale, useTranslations } from "next-intl";
import { formatNumber, formatShortDate } from "@/i18n/format";

/** A Brazilian company identifier: the label and the example number read the same in every language. */
const CNPJ_LABEL = "CNPJ";
const EXAMPLE_CNPJ = "00.000.000/0001-00";
const EXAMPLE_POWER_KWP = 1250;
const EXAMPLE_LAST_READING = new Date("2026-11-11T00:00:00Z");

/** An illustrative plant data sheet: the page's one memorable element. Mono is for measures only. */
export function PlantSheet() {
  const t = useTranslations("plantSheet");
  const locale = useLocale();
  const rows = [
    { label: t("plantLabel"), value: t("plantName") },
    { label: CNPJ_LABEL, value: EXAMPLE_CNPJ },
    { label: t("powerLabel"), value: t("powerValue", { value: formatNumber(locale, EXAMPLE_POWER_KWP) }) },
    { label: t("distributorLabel"), value: t("distributorName") },
    { label: t("lastReadingLabel"), value: formatShortDate(locale, EXAMPLE_LAST_READING) },
  ];

  return (
    <figure className="border border-hairline bg-frost">
      <div className="bar" />
      <div className="flex items-baseline justify-between gap-4 border-b border-hairline px-5 py-3">
        <span className="label text-navy">{t("title")}</span>
        <span className="inline-flex items-center gap-1.5 bg-success-bg px-2 py-0.5 text-sm font-medium text-success">
          {t("status")}
        </span>
      </div>
      <dl className="divide-y divide-hairline px-5">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            <dt className="label">{label}</dt>
            <dd className="data text-ink sm:text-right">{value}</dd>
          </div>
        ))}
      </dl>
      <figcaption className="border-t border-hairline px-5 py-3 text-sm text-slate">{t("caption")}</figcaption>
    </figure>
  );
}
