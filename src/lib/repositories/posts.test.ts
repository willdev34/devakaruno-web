/**
 * Caminho: src/lib/repositories/posts.test.ts
 * Arquivo: posts.test.ts
 * Descrição: Testes do repositório de posts, com o Prisma mockado: filtro de visibilidade, ordenação, limite, busca por slug e relacionados.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getPostBySlug, getPublishedPosts, getRelatedPosts, getSitemapPosts, POST_AUTHOR } from "./posts";

const { findMany, findFirst } = vi.hoisted(() => ({ findMany: vi.fn(), findFirst: vi.fn() }));

vi.mock("@/lib/prisma", () => ({ prisma: { post: { findMany, findFirst } } }));

const row = {
  slug: "a",
  title: "Título A",
  excerpt: "Resumo A",
  coverImage: "/capa.jpg",
  content: "Texto",
  subtitle: "Sub",
  tags: ["t"],
  publishedAt: new Date("2026-06-10T00:00:00.000Z"),
  updatedAt: new Date("2026-06-12T00:00:00.000Z"),
};

describe("repositories/posts", () => {
  beforeEach(() => {
    findMany.mockReset();
    findFirst.mockReset();
  });

  it("lista só posts publicados e já no ar, destaques primeiro", async () => {
    findMany.mockResolvedValue([row]);

    const result = await getPublishedPosts();

    const args = findMany.mock.calls[0][0];
    expect(args.where.published).toBe(true);
    expect(args.where.publishedAt.lte).toBeInstanceOf(Date);
    expect(args.orderBy).toEqual([{ featured: "desc" }, { publishedAt: "desc" }]);
    expect(args.take).toBeUndefined();
    expect(result[0]).toEqual({
      slug: "a",
      title: "Título A",
      excerpt: "Resumo A",
      coverImage: "/capa.jpg",
      date: "2026-06-10T00:00:00.000Z",
      author: POST_AUTHOR,
      tags: ["t"],
    });
  });

  it("aplica o limite quando informado", async () => {
    findMany.mockResolvedValue([]);

    await getPublishedPosts(3);

    expect(findMany.mock.calls[0][0].take).toBe(3);
  });

  it("busca o post pelo slug trazendo o conteúdo", async () => {
    findFirst.mockResolvedValue(row);

    const result = await getPostBySlug("a");

    expect(findFirst.mock.calls[0][0].where).toMatchObject({ slug: "a", published: true });
    expect(result).toMatchObject({ slug: "a", content: "Texto", subtitle: "Sub", tags: ["t"], updatedAt: "2026-06-12T00:00:00.000Z" });
  });

  it("devolve null quando o post não existe ou não está no ar", async () => {
    findFirst.mockResolvedValue(null);

    expect(await getPostBySlug("x")).toBeNull();
  });

  it("relacionados excluem o post atual e respeitam o limite", async () => {
    findFirst.mockResolvedValue({ tags: [], category: null });
    findMany.mockResolvedValue([row, { ...row, slug: "c" }, { ...row, slug: "d" }]);

    const result = await getRelatedPosts("b", 2);

    expect(findMany.mock.calls[0][0].where.slug).toEqual({ not: "b" });
    expect(result).toHaveLength(2);
  });

  it("relacionados priorizam mesma categoria e tags em comum", async () => {
    findFirst.mockResolvedValue({ tags: ["paz"], category: { slug: "autoconhecimento" } });
    findMany.mockResolvedValue([
      { ...row, slug: "recente", tags: [], publishedAt: new Date("2026-08-01T00:00:00.000Z") },
      { ...row, slug: "tag", tags: ["Paz"], publishedAt: new Date("2026-07-01T00:00:00.000Z") },
      {
        ...row,
        slug: "categoria",
        tags: [],
        publishedAt: new Date("2026-06-01T00:00:00.000Z"),
        category: { name: "Autoconhecimento", slug: "autoconhecimento" },
      },
    ]);

    const result = await getRelatedPosts("atual", 3);

    expect(result.map((p) => p.slug)).toEqual(["categoria", "tag", "recente"]);
  });

  it("relacionados caem nos mais recentes quando o artigo atual não é encontrado", async () => {
    findFirst.mockResolvedValue(null);
    findMany.mockResolvedValue([
      { ...row, slug: "antigo", publishedAt: new Date("2026-01-01T00:00:00.000Z") },
      { ...row, slug: "novo", publishedAt: new Date("2026-09-01T00:00:00.000Z") },
    ]);

    const result = await getRelatedPosts("x", 1);

    expect(result.map((p) => p.slug)).toEqual(["novo"]);
  });

  it("traz a categoria junto e mostra o nome nos cards", async () => {
    findMany.mockResolvedValue([{ ...row, category: { name: "Autoconhecimento", slug: "autoconhecimento" } }, row]);

    const result = await getPublishedPosts();

    expect(findMany.mock.calls[0][0].include).toEqual({ category: { select: { name: true, slug: true } } });
    expect(result[0].category).toBe("Autoconhecimento");
    expect(result[0].categorySlug).toBe("autoconhecimento");
    expect(result[1]).not.toHaveProperty("category");
  });

  it("o artigo completo devolve nome e slug da categoria, ou null", async () => {
    findFirst.mockResolvedValueOnce({ ...row, category: { name: "Autoconhecimento", slug: "autoconhecimento" } });
    findFirst.mockResolvedValueOnce({ ...row, category: null });

    expect((await getPostBySlug("a"))?.category).toEqual({ name: "Autoconhecimento", slug: "autoconhecimento" });
    expect((await getPostBySlug("a"))?.category).toBeNull();
    expect(findFirst.mock.calls[0][0].include).toBeDefined();
  });

  it("o sitemap lê só slug e última alteração dos artigos no ar", async () => {
    findMany.mockResolvedValue([{ slug: "a", updatedAt: new Date() }]);

    const result = await getSitemapPosts();

    const args = findMany.mock.calls[0][0];
    expect(args.where.published).toBe(true);
    expect(args.select).toEqual({ slug: true, updatedAt: true });
    expect(result).toHaveLength(1);
  });
});
