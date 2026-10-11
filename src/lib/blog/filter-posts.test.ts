/**
 * Caminho: src/lib/blog/filter-posts.test.ts
 * Arquivo: filter-posts.test.ts
 * Descrição: Testes dos filtros do blog: busca sem acento, categoria, tag, combinações e listas de chips.
 */
import { describe, expect, it } from "vitest";
import type { Blog } from "@/types/blog";
import { EMPTY_FILTER, filterPosts, hasActiveFilter, listCategories, listTags, normalizeText } from "./filter-posts";

const post = (over: Partial<Blog>): Blog => ({ coverImage: "/c.jpg", date: "2026-06-10T00:00:00.000Z", ...over });

const posts: Blog[] = [
  post({ slug: "a", title: "Meditação para iniciantes", excerpt: "Comece hoje", category: "Autoconhecimento", categorySlug: "autoconhecimento", tags: ["Respiração", "Paz"] }),
  post({ slug: "b", title: "Comunicação no casal", excerpt: "Diálogo e escuta", category: "Relacionamentos", categorySlug: "relacionamentos", tags: ["Paz"] }),
  post({ slug: "c", title: "Sem nada", excerpt: "Resumo" }),
];

describe("normalizeText", () => {
  it("remove acento, maiúscula e espaços das pontas", () => {
    expect(normalizeText("  Meditação ")).toBe("meditacao");
  });
});

describe("filterPosts", () => {
  it("sem filtro devolve todos", () => {
    expect(filterPosts(posts, EMPTY_FILTER)).toHaveLength(3);
  });

  it("busca ignorando acento e maiúscula", () => {
    expect(filterPosts(posts, { ...EMPTY_FILTER, query: "MEDITACAO" }).map((p) => p.slug)).toEqual(["a"]);
  });

  it("busca no resumo e nas tags", () => {
    expect(filterPosts(posts, { ...EMPTY_FILTER, query: "escuta" }).map((p) => p.slug)).toEqual(["b"]);
    expect(filterPosts(posts, { ...EMPTY_FILTER, query: "respiracao" }).map((p) => p.slug)).toEqual(["a"]);
  });

  it("exige todas as palavras digitadas", () => {
    expect(filterPosts(posts, { ...EMPTY_FILTER, query: "comunicação casal" })).toHaveLength(1);
    expect(filterPosts(posts, { ...EMPTY_FILTER, query: "comunicação meditação" })).toHaveLength(0);
  });

  it("filtra por categoria", () => {
    expect(filterPosts(posts, { ...EMPTY_FILTER, category: "relacionamentos" }).map((p) => p.slug)).toEqual(["b"]);
  });

  it("filtra por tag sem diferenciar acento", () => {
    expect(filterPosts(posts, { ...EMPTY_FILTER, tag: "respiracao" }).map((p) => p.slug)).toEqual(["a"]);
    expect(filterPosts(posts, { ...EMPTY_FILTER, tag: "Paz" })).toHaveLength(2);
  });

  it("combina busca, categoria e tag", () => {
    const result = filterPosts(posts, { query: "casal", category: "relacionamentos", tag: "paz" });
    expect(result.map((p) => p.slug)).toEqual(["b"]);
    expect(filterPosts(posts, { query: "casal", category: "autoconhecimento", tag: "" })).toHaveLength(0);
  });
});

describe("hasActiveFilter", () => {
  it("detecta filtro ativo e ignora busca só com espaços", () => {
    expect(hasActiveFilter(EMPTY_FILTER)).toBe(false);
    expect(hasActiveFilter({ ...EMPTY_FILTER, query: "   " })).toBe(false);
    expect(hasActiveFilter({ ...EMPTY_FILTER, tag: "paz" })).toBe(true);
  });
});

describe("listCategories e listTags", () => {
  it("lista só categorias em uso, com contagem e ordem alfabética", () => {
    const more = [...posts, post({ slug: "d", category: "Autoconhecimento", categorySlug: "autoconhecimento" })];
    expect(listCategories(more)).toEqual([
      { slug: "autoconhecimento", name: "Autoconhecimento", count: 2 },
      { slug: "relacionamentos", name: "Relacionamentos", count: 1 },
    ]);
  });

  it("lista tags da mais usada para a menos usada, agrupando variações de acento", () => {
    const more = [...posts, post({ slug: "d", tags: ["respiracao"] })];
    expect(listTags(more)).toEqual([
      { tag: "Paz", count: 2 },
      { tag: "Respiração", count: 2 },
    ]);
  });
});
