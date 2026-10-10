/**
 * Caminho: src/lib/blog/filter-posts.ts
 * Arquivo: filter-posts.ts
 * Descrição: Regras puras dos filtros do blog: busca por texto (sem acento e sem diferenciar maiúscula), categoria, tag e listas de chips.
 */
import type { Blog } from "@/types/blog";

export type BlogFilter = {
  query: string;
  // Slug da categoria; vazio = todas
  category: string;
  // Tag exata; vazio = todas
  tag: string;
};

export const EMPTY_FILTER: BlogFilter = { query: "", category: "", tag: "" };

export type CategoryChip = { slug: string; name: string; count: number };
export type TagChip = { tag: string; count: number };

// "Meditação " -> "meditacao": base de toda comparação de texto
export function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function hasActiveFilter(filter: BlogFilter): boolean {
  return Boolean(filter.query.trim() || filter.category || filter.tag);
}

// Todas as palavras digitadas precisam aparecer no título, resumo ou tags
function matchesQuery(post: Blog, query: string): boolean {
  const terms = normalizeText(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = normalizeText([post.title, post.excerpt, ...(post.tags ?? [])].filter(Boolean).join(" "));
  return terms.every((term) => haystack.includes(term));
}

function matchesTag(post: Blog, tag: string): boolean {
  if (!tag) return true;
  const wanted = normalizeText(tag);
  return (post.tags ?? []).some((t) => normalizeText(t) === wanted);
}

// Aplica busca, categoria e tag juntas (todas precisam bater)
export function filterPosts(posts: Blog[], filter: BlogFilter): Blog[] {
  return posts.filter(
    (post) =>
      matchesQuery(post, filter.query) &&
      (!filter.category || post.categorySlug === filter.category) &&
      matchesTag(post, filter.tag),
  );
}

// Categorias em uso, em ordem alfabética, com a quantidade de artigos
export function listCategories(posts: Blog[]): CategoryChip[] {
  const map = new Map<string, CategoryChip>();
  for (const post of posts) {
    if (!post.categorySlug || !post.category) continue;
    const current = map.get(post.categorySlug);
    if (current) current.count += 1;
    else map.set(post.categorySlug, { slug: post.categorySlug, name: post.category, count: 1 });
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

// Tags em uso: mais usadas primeiro, empate em ordem alfabética
export function listTags(posts: Blog[]): TagChip[] {
  const map = new Map<string, TagChip>();
  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      const key = normalizeText(tag);
      const current = map.get(key);
      if (current) current.count += 1;
      else map.set(key, { tag, count: 1 });
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "pt-BR"));
}
