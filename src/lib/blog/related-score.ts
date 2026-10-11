/**
 * Caminho: src/lib/blog/related-score.ts
 * Arquivo: related-score.ts
 * Descrição: Pontuação de afinidade entre artigos: mesma categoria vale mais, cada tag em comum soma. Desempate pelo mais recente.
 */
import type { Blog } from "@/types/blog";
import { normalizeText } from "./filter-posts";

// Referência: categoria e tags do artigo que está sendo lido
export type RelatedReference = { categorySlug?: string | null; tags: string[] };

const CATEGORY_WEIGHT = 3;
const TAG_WEIGHT = 1;

export function relatedScore(post: Blog, ref: RelatedReference): number {
  const refTags = new Set(ref.tags.map(normalizeText));
  const common = (post.tags ?? []).filter((t) => refTags.has(normalizeText(t))).length;
  const sameCategory = Boolean(ref.categorySlug) && post.categorySlug === ref.categorySlug;
  return (sameCategory ? CATEGORY_WEIGHT : 0) + common * TAG_WEIGHT;
}

// Ordena por afinidade; sem nenhuma afinidade, o resultado é só do mais recente para o mais antigo
export function rankRelated(posts: Blog[], ref: RelatedReference): Blog[] {
  return posts
    .map((post) => ({ post, score: relatedScore(post, ref) }))
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
    .map(({ post }) => post);
}
