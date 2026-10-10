/**
 * Caminho: src/lib/blog/related-score.test.ts
 * Arquivo: related-score.test.ts
 * Descrição: Testes da pontuação de artigos relacionados: categoria, tags em comum, desempate por data e ausência de afinidade.
 */
import { describe, expect, it } from "vitest";
import type { Blog } from "@/types/blog";
import { rankRelated, relatedScore } from "./related-score";

const post = (over: Partial<Blog>): Blog => ({ coverImage: "/c.jpg", date: "2026-06-10T00:00:00.000Z", ...over });

describe("relatedScore", () => {
  it("categoria vale 3 e cada tag em comum vale 1", () => {
    const p = post({ categorySlug: "x", tags: ["a", "b"] });
    expect(relatedScore(p, { categorySlug: "x", tags: ["a", "b"] })).toBe(5);
    expect(relatedScore(p, { categorySlug: "y", tags: ["a"] })).toBe(1);
    expect(relatedScore(p, { categorySlug: "x", tags: [] })).toBe(3);
  });

  it("ignora acento e maiúscula nas tags", () => {
    expect(relatedScore(post({ tags: ["Respiração"] }), { tags: ["respiracao"] })).toBe(1);
  });

  it("sem categoria na referência, não pontua categoria", () => {
    expect(relatedScore(post({ categorySlug: undefined }), { categorySlug: undefined, tags: [] })).toBe(0);
    expect(relatedScore(post({ categorySlug: "x" }), { categorySlug: null, tags: [] })).toBe(0);
  });
});

describe("rankRelated", () => {
  it("ordena por afinidade e desempata pelo mais recente", () => {
    const posts = [
      post({ slug: "velho", date: "2026-01-01T00:00:00.000Z" }),
      post({ slug: "tag", date: "2026-02-01T00:00:00.000Z", tags: ["paz"] }),
      post({ slug: "cat", date: "2026-03-01T00:00:00.000Z", categorySlug: "x" }),
      post({ slug: "novo", date: "2026-09-01T00:00:00.000Z" }),
    ];
    const result = rankRelated(posts, { categorySlug: "x", tags: ["paz"] });
    expect(result.map((p) => p.slug)).toEqual(["cat", "tag", "novo", "velho"]);
  });

  it("sem afinidade nenhuma, devolve do mais recente para o mais antigo", () => {
    const posts = [post({ slug: "a", date: "2026-01-01T00:00:00.000Z" }), post({ slug: "b", date: "2026-05-01T00:00:00.000Z" })];
    expect(rankRelated(posts, { tags: [] }).map((p) => p.slug)).toEqual(["b", "a"]);
  });
});
