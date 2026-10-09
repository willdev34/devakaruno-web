/**
 * Caminho: src/lib/repositories/posts.test.ts
 * Arquivo: posts.test.ts
 * Descrição: Testes do repositório de posts, com o Prisma mockado: filtro de visibilidade, ordenação, limite, busca por slug e relacionados.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getPostBySlug, getPublishedPosts, getRelatedPosts, POST_AUTHOR } from "./posts";

const { findMany, findFirst } = vi.hoisted(() => ({ findMany: vi.fn(), findFirst: vi.fn() }));

vi.mock("@/lib/prisma", () => ({ prisma: { post: { findMany, findFirst } } }));

const row = {
  slug: "a",
  title: "Título A",
  excerpt: "Resumo A",
  coverImage: "/capa.jpg",
  content: "Texto",
  publishedAt: new Date("2026-06-10T00:00:00.000Z"),
};

describe("repositories/posts", () => {
  beforeEach(() => {
    findMany.mockReset();
    findFirst.mockReset();
  });

  it("lista só posts publicados e já no ar, do mais recente ao mais antigo", async () => {
    findMany.mockResolvedValue([row]);

    const result = await getPublishedPosts();

    const args = findMany.mock.calls[0][0];
    expect(args.where.published).toBe(true);
    expect(args.where.publishedAt.lte).toBeInstanceOf(Date);
    expect(args.orderBy).toEqual({ publishedAt: "desc" });
    expect(args.take).toBeUndefined();
    expect(result[0]).toEqual({
      slug: "a",
      title: "Título A",
      excerpt: "Resumo A",
      coverImage: "/capa.jpg",
      date: "2026-06-10T00:00:00.000Z",
      author: POST_AUTHOR,
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
    expect(result).toMatchObject({ slug: "a", content: "Texto" });
  });

  it("devolve null quando o post não existe ou não está no ar", async () => {
    findFirst.mockResolvedValue(null);

    expect(await getPostBySlug("x")).toBeNull();
  });

  it("relacionados excluem o post atual e respeitam o limite", async () => {
    findMany.mockResolvedValue([row]);

    const result = await getRelatedPosts("b", 2);

    const args = findMany.mock.calls[0][0];
    expect(args.where.slug).toEqual({ not: "b" });
    expect(args.take).toBe(2);
    expect(result).toHaveLength(1);
  });
});
