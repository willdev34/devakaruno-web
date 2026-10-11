/**
 * Caminho: src/lib/tags/tag-ops.ts
 * Arquivo: tag-ops.ts
 * Descrição: Regras puras das tags: resumo com contagem de artigos, renomear/mesclar e remover. Tags que só mudam em acento ou maiúscula contam como a mesma.
 */
import { normalizeText } from "@/lib/blog/filter-posts";

export type TagSummary = {
  // Chave normalizada ("respiracao"): identifica a tag nas ações
  key: string;
  // Grafia exibida: a mais usada entre as variações
  name: string;
  // Quantidade de artigos (publicados ou não) que usam a tag
  count: number;
};

export const tagKey = normalizeText;

// Resume as tags de todos os artigos, da mais usada para a menos usada
export function summarizeTags(rows: { tags: string[] }[]): TagSummary[] {
  const groups = new Map<string, { count: number; spellings: Map<string, number> }>();

  for (const row of rows) {
    // Cada artigo conta uma vez por tag, mesmo que repita variações
    const seen = new Set<string>();
    for (const tag of row.tags) {
      const key = tagKey(tag);
      const group = groups.get(key) ?? { count: 0, spellings: new Map() };
      group.spellings.set(tag, (group.spellings.get(tag) ?? 0) + 1);
      if (!seen.has(key)) {
        group.count += 1;
        seen.add(key);
      }
      groups.set(key, group);
    }
  }

  return [...groups.entries()]
    .map(([key, group]) => {
      const [name] = [...group.spellings.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "pt-BR"))[0];
      return { key, name, count: group.count };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "pt-BR"));
}

// Remove repetidas pela chave, mantendo a primeira posição
function dedupeByKey(tags: string[]): string[] {
  const seen = new Set<string>();
  return tags.filter((tag) => {
    const key = tagKey(tag);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Troca a tag fromKey por toName. Se toName já existe no artigo (ou em outra grafia),
// as duas viram uma só, com a grafia toName: é assim que a mesclagem funciona.
export function replaceTag(tags: string[], fromKey: string, toName: string): string[] {
  const toKey = tagKey(toName);
  return dedupeByKey(tags.map((tag) => (tagKey(tag) === fromKey || tagKey(tag) === toKey ? toName : tag)));
}

export function removeTag(tags: string[], key: string): string[] {
  return tags.filter((tag) => tagKey(tag) !== key);
}
