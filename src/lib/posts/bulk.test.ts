/**
 * Caminho: src/lib/posts/bulk.test.ts
 * Arquivo: bulk.test.ts
 * Descrição: Testes das ações em lote de artigos: validação da lista e a operação certa para cada ação.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MAX_BULK, runBulkAction } from "./bulk";

const repo = vi.hoisted(() => ({ deleteAdminPosts: vi.fn(), publishAdminPosts: vi.fn(), unpublishAdminPosts: vi.fn() }));
vi.mock("@/lib/repositories/admin-posts", () => repo);

describe("runBulkAction", () => {
  beforeEach(() => {
    Object.values(repo).forEach((fn) => fn.mockReset());
    Object.values(repo).forEach((fn) => fn.mockResolvedValue({ count: 2 }));
  });

  it.each([
    ["delete", "deleteAdminPosts"],
    ["publish", "publishAdminPosts"],
    ["unpublish", "unpublishAdminPosts"],
  ] as const)("%s chama só %s com os ids sem repetição", async (action, fn) => {
    const result = await runBulkAction({ action, ids: ["a", "b", "a"] });

    expect(result).toEqual({ ok: true, count: 2 });
    expect(repo[fn]).toHaveBeenCalledWith(["a", "b"]);
    Object.entries(repo).filter(([name]) => name !== fn).forEach(([, other]) => expect(other).not.toHaveBeenCalled());
  });

  it("recusa lista vazia", async () => {
    expect(await runBulkAction({ action: "delete", ids: [] })).toEqual({ ok: false, error: "Selecione ao menos um artigo" });
    expect(repo.deleteAdminPosts).not.toHaveBeenCalled();
  });

  it("recusa mais artigos que o limite", async () => {
    const ids = Array.from({ length: MAX_BULK + 1 }, (_, i) => `id${i}`);

    expect(await runBulkAction({ action: "delete", ids })).toEqual({ ok: false, error: `No máximo ${MAX_BULK} artigos por vez` });
  });

  it("recusa ação desconhecida e entrada fora do formato, sem tocar no banco", async () => {
    expect(await runBulkAction({ action: "apagar-tudo", ids: ["a"] })).toMatchObject({ ok: false });
    expect(await runBulkAction(null)).toMatchObject({ ok: false });
    Object.values(repo).forEach((fn) => expect(fn).not.toHaveBeenCalled());
  });
});
