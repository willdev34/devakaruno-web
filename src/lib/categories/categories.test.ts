/**
 * Caminho: src/lib/categories/categories.test.ts
 * Arquivo: categories.test.ts
 * Descrição: Testes da validação de categoria e do caso de uso de salvar (criar, editar, slug repetido e erros por campo).
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { categoryInputSchema } from "./schema";
import { saveCategory } from "./save-category";

const repo = vi.hoisted(() => ({ createCategory: vi.fn(), updateCategory: vi.fn(), isCategorySlugTaken: vi.fn() }));
vi.mock("@/lib/repositories/admin-categories", () => repo);

const valid = { name: "  Autoconhecimento  ", slug: "autoconhecimento", description: "  Textos sobre si  " };

describe("categoryInputSchema", () => {
  it("aceita e limpa os espaços", () => {
    expect(categoryInputSchema.parse(valid)).toEqual({ name: "Autoconhecimento", slug: "autoconhecimento", description: "Textos sobre si" });
  });

  it("recusa nome curto, slug inválido e descrição longa", () => {
    expect(categoryInputSchema.safeParse({ ...valid, name: "A" }).success).toBe(false);
    expect(categoryInputSchema.safeParse({ ...valid, slug: "Auto Conhecimento" }).success).toBe(false);
    expect(categoryInputSchema.safeParse({ ...valid, slug: "-x-" }).success).toBe(false);
    expect(categoryInputSchema.safeParse({ ...valid, description: "x".repeat(201) }).success).toBe(false);
  });

  it("descrição pode ficar vazia", () => {
    expect(categoryInputSchema.safeParse({ ...valid, description: "" }).success).toBe(true);
  });
});

describe("saveCategory", () => {
  beforeEach(() => {
    Object.values(repo).forEach((fn) => fn.mockReset());
    repo.isCategorySlugTaken.mockResolvedValue(false);
    repo.createCategory.mockResolvedValue({ id: "novo" });
    repo.updateCategory.mockResolvedValue({ id: "1" });
  });

  it("cria com descrição nula quando vazia", async () => {
    expect(await saveCategory(null, { ...valid, description: "" })).toEqual({ ok: true, id: "novo" });
    expect(repo.createCategory).toHaveBeenCalledWith({ name: "Autoconhecimento", description: null, slug: "autoconhecimento" });
  });

  it("recusa slug repetido na criação", async () => {
    repo.isCategorySlugTaken.mockResolvedValue(true);

    const result = await saveCategory(null, valid);

    expect(result).toMatchObject({ ok: false, fieldErrors: { slug: "Já existe uma categoria com esse slug" } });
    expect(repo.createCategory).not.toHaveBeenCalled();
  });

  it("na edição não troca o slug nem consulta a unicidade", async () => {
    expect(await saveCategory("1", { ...valid, slug: "outro-slug" })).toEqual({ ok: true, id: "1" });

    expect(repo.updateCategory).toHaveBeenCalledWith("1", { name: "Autoconhecimento", description: "Textos sobre si" });
    expect(repo.isCategorySlugTaken).not.toHaveBeenCalled();
  });

  it("devolve o erro de cada campo sem gravar", async () => {
    const result = await saveCategory(null, { name: "", slug: "", description: "" });

    expect(result).toMatchObject({ ok: false, error: "Revise os campos destacados." });
    if (!result.ok) expect(Object.keys(result.fieldErrors).sort()).toEqual(["name", "slug"]);
    expect(repo.createCategory).not.toHaveBeenCalled();
  });
});
