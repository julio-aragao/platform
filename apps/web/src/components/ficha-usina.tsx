/** An illustrative plant data sheet: the page's one memorable element. Mono is for measures only. */
const ROWS = [
  { label: "Usina", value: "Usina Solar Exemplo I" },
  { label: "CNPJ", value: "00.000.000/0001-00" },
  { label: "Potência", value: "1.250 kWp" },
  { label: "Distribuidora", value: "Exemplo Energia" },
  { label: "Última leitura", value: "11/11/2026" },
] as const;

export function FichaUsina() {
  return (
    <figure className="border border-fio bg-gelo">
      <div className="barra" />
      <div className="flex items-baseline justify-between gap-4 border-b border-fio px-5 py-3">
        <span className="rotulo text-navy">Ficha da usina</span>
        <span className="inline-flex items-center gap-1.5 bg-sucesso-fundo px-2 py-0.5 text-sm font-medium text-sucesso">
          Em operação
        </span>
      </div>
      <dl className="divide-y divide-fio px-5">
        {ROWS.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            <dt className="rotulo">{label}</dt>
            <dd className="dado text-tinta sm:text-right">{value}</dd>
          </div>
        ))}
      </dl>
      <figcaption className="border-t border-fio px-5 py-3 text-sm text-ardosia">
        Exemplo ilustrativo. Os dados reais aparecem no seu painel.
      </figcaption>
    </figure>
  );
}
