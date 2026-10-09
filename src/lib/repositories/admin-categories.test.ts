/**
 * Caminho: src/lib/repositories/admin-categories.test.ts
 * Arquivo: admin-categories.test.ts
 * Descrição: Testes do repositório de categorias do admin: listagens, existência, slug repetido, criação, edição e exclusão.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  categoryExists,
  createCategory,
  deleteCategory,
  getCategory,
  isCategorySlugTaken,
  listAdminCategories,
  listCategoryOptions,
  updateCategory,
} from "./admin-categories";

const db = vi.hoisted(() => ({ findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() }));

vi.mock("@/lib/prisma", () => ({ prisma: { category: db } }));

describe("repositories/admin-categories", () => {
  beforeEach(() => Object.values(db).forEach((fn) => fn.mockReset()));

  it("lista em ordem alfabética com o total de artigos", async () => {
    await listAdminCategories();

    expect(db.findMany).toHaveBeenCalledWith({ orderBy: { name: "asc" }, include: { _count: { select: { posts: true } } } });
  });

  it("opções do seletor trazem só id e nome", async () => {
    await listCategoryOptions();

    expect(db.findMany).toHaveBeenCalledWith({ orderBy: { name: "asc" }, select: { id: true, name: true } });
  });

  it("busca por id", async () => {
    await getCategory("1");

    expect(db.findUnique).toHaveBeenCalledWith({ where: { id: "1" } });
  });

  it("categoryExists diz se o id existe", async () => {
    db.findUnique.mockResolvedValueOnce({ id: "1" }).mockResolvedValueOnce(null);

    expect(await categoryExists("1")).toBe(true);
    expect(await categoryExists("x")).toBe(false);
  });

  it("slug repetido: ignora a própria categoria quando informada", async () => {
    db.findUnique.mockResolvedValue({ id: "1" });

    expect(await isCategorySlugTaken("a")).toBe(true);
    expect(await isCategorySlugTaken("a", "1")).toBe(false);
    expect(await isCategorySlugTaken("a", "2")).toBe(true);

    db.findUnique.mockResolvedValue(null);
    expect(await isCategorySlugTaken("livre")).toBe(false);
  });

  it("cria, atualiza e exclui", async () => {
    await createCategory({ name: "N", description: null, slug: "n" });
    await updateCategory("1", { name: "M", description: "d" });
    await deleteCategory("1");

    expect(db.create).toHaveBeenCalledWith({ data: { name: "N", description: null, slug: "n" } });
    expect(db.update).toHaveBeenCalledWith({ where: { id: "1" }, data: { name: "M", description: "d" } });
    expect(db.delete).toHaveBeenCalledWith({ where: { id: "1" } });
  });
});
