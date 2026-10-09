/**
 * Caminho: src/lib/repositories/admin-posts.test.ts
 * Arquivo: admin-posts.test.ts
 * Descrição: Testes do repositório de artigos do admin: filtros de status, busca, slug repetido e escrita.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createAdminPost,
  deleteAdminPost,
  ensureAuthor,
  getAdminPost,
  isSlugTaken,
  listAdminPosts,
  updateAdminPost,
  type PostWriteData,
} from "./admin-posts";

const db = vi.hoisted(() => ({
  findMany: vi.fn(),
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  upsert: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    post: { findMany: db.findMany, findUnique: db.findUnique, create: db.create, update: db.update, delete: db.delete },
    user: { upsert: db.upsert },
  },
}));

const data = { title: "T" } as PostWriteData;

describe("repositories/admin-posts", () => {
  beforeEach(() => Object.values(db).forEach((fn) => fn.mockReset()));

  it.each([
    ["draft", { published: false }],
    ["published", { published: true, publishedAt: { lte: expect.any(Date) } }],
    ["scheduled", { published: true, publishedAt: { gt: expect.any(Date) } }],
    ["all", {}],
  ] as const)("filtra a aba %s", async (status, where) => {
    await listAdminPosts({ status });

    expect(db.findMany.mock.calls[0][0].where).toEqual(where);
    expect(db.findMany.mock.calls[0][0].orderBy).toEqual({ updatedAt: "desc" });
  });

  it("busca pelo título sem diferenciar maiúsculas", async () => {
    await listAdminPosts({ q: "  mitos " });

    expect(db.findMany.mock.calls[0][0].where.title).toEqual({ contains: "mitos", mode: "insensitive" });
  });

  it("lista sem argumentos", async () => {
    await listAdminPosts();

    expect(db.findMany).toHaveBeenCalled();
  });

  it("slug repetido só conta se for de outro artigo", async () => {
    db.findUnique.mockResolvedValue({ id: "a" });
    expect(await isSlugTaken("x")).toBe(true);
    expect(await isSlugTaken("x", "a")).toBe(false);

    db.findUnique.mockResolvedValue(null);
    expect(await isSlugTaken("x")).toBe(false);
  });

  it("lê, cria, atualiza e exclui", async () => {
    await getAdminPost("1");
    await createAdminPost(data, "u1");
    await updateAdminPost("1", data);
    await deleteAdminPost("1");

    expect(db.findUnique).toHaveBeenCalledWith({ where: { id: "1" } });
    expect(db.create).toHaveBeenCalledWith({ data: { ...data, authorId: "u1" } });
    expect(db.update).toHaveBeenCalledWith({ where: { id: "1" }, data });
    expect(db.delete).toHaveBeenCalledWith({ where: { id: "1" } });
  });

  it("garante o usuário admin", async () => {
    await ensureAuthor("dono@site.com", "Deva");

    expect(db.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { email: "dono@site.com" }, create: expect.objectContaining({ role: "ADMIN" }) }),
    );
  });
});
