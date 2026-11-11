const ACCENTED = /[áàâãéêíóôõúçüñÁÀÂÃÉÊÍÓÔÕÚÇÜÑ]/;

const DENYLIST = new RegExp(
  "(?<![\\w-])(?:ficha|usina|entrar|criar-conta|painel|barra|rotulo|tinta|grafite|ardosia|nevoa|bruma|gelo|papel|sucesso|atencao|erro|dado|fio|btn-primario|btn-secundario|marca|reduzida|negativa)(?![\\w-])",
  "i",
);

const IGNORE_START = "i18n-guard:ignore-start";
const IGNORE_END = "i18n-guard:ignore-end";

/** Returns the offending lines ("<line number>: <text>") of Portuguese text. */
export function findPortuguese(text: string): string[] {
  const hits: string[] = [];
  let ignoring = false;
  text.split("\n").forEach((line, index) => {
    if (line.includes(IGNORE_START)) {
      ignoring = true;
      return;
    }
    if (line.includes(IGNORE_END)) {
      ignoring = false;
      return;
    }
    if (ignoring) return;
    if (ACCENTED.test(line) || DENYLIST.test(line)) {
      hits.push(`${index + 1}: ${line.trim()}`);
    }
  });
  if (ignoring) hits.push(`unbalanced ${IGNORE_START} marker: no matching ${IGNORE_END}`);
  return hits;
}
