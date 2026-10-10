/**
 * Caminho: src/lib/seo/text.ts
 * Arquivo: text.ts
 * Descrição: Textos para resultados de busca: corta resumos longos no tamanho que o Google mostra, sem partir palavras.
 */
export const TITLE_IDEAL = 60;
export const DESCRIPTION_IDEAL = 160;

// Corta em `max` caracteres, no último espaço, e fecha com reticências. Textos curtos passam sem mudança.
export function truncateText(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  // Se o único espaço está muito no começo, corta seco para não perder quase tudo
  const base = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${base.replace(/[\s,;:.\-–]+$/, "")}…`;
}

export const toMetaDescription = (text: string) => truncateText(text, DESCRIPTION_IDEAL);
