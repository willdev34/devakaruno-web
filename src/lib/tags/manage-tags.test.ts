/**
 * Caminho: src/lib/tags/manage-tags.test.ts
 * Arquivo: manage-tags.test.ts
 * Descrição: Testes dos casos de uso de tags: renomear, mesclar, remover, nome inválido e tag inexistente.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { removeTagEverywhere, renameTag } from "./manage-tags";

const repo = vi.hoisted(() => ({ listAllPostTags: vi.fn(), updatePostsTags: vi.fn() }));
vi.mock("@/lib/repositories/admin-tags", () => repo);

describe("manage-tags", () => {
  beforeEach(() => {
    Object.values(repo).forEach((fn) => fn.mockReset());
    repo.listAllPostTags.mockResolvedValue([
      { id: "1", tags: ["Paz", "Escuta"] },
      { id: "2", tags: ["paz"] },
      { id: "3", tags: ["Outra"] },
    ]);
  });

  it("renomeia só nos artigos que usam a tag", async () => {
    const result = await renameTag("paz", "Serenidade");

    expect(result).toEqual({ ok: true, affected: 2 });
    expect(repo.updatePostsTags).toHaveBeenCalledWith([
      { id: "1", tags: ["Serenidade", "Escuta"] },
      { id: "2", tags: ["Serenidade"] },
    ]);
  });

  it("mescla quando o nome já existe no artigo", async () => {
    await renameTag("paz", "Escuta");

    expect(repo.updatePostsTags).toHaveBeenCalledWith([
      { id: "1", tags: ["Escuta"] },
      { id: "2", tags: ["Escuta"] },
    ]);
  });

  it("recusa nome vazio ou longo sem gravar", async () => {
    expect(await renameTag("paz", "  ")).toEqual({ ok: false, error: "Informe o nome da tag" });
    expect((await renameTag("paz", "x".repeat(31))).ok).toBe(false);
    expect(repo.updatePostsTags).not.toHaveBeenCalled();
  });

  it("avisa quando a tag não existe", async () => {
    expect(await renameTag("nada", "Novo")).toEqual({ ok: false, error: "Tag não encontrada." });
    expect(await removeTagEverywhere("nada")).toEqual({ ok: false, error: "Tag não encontrada." });
    expect(repo.updatePostsTags).not.toHaveBeenCalled();
  });

  it("remove a tag de todos os artigos", async () => {
    const result = await removeTagEverywhere("paz");

    expect(result).toEqual({ ok: true, affected: 2 });
    expect(repo.updatePostsTags).toHaveBeenCalledWith([
      { id: "1", tags: ["Escuta"] },
      { id: "2", tags: [] },
    ]);
  });
});
