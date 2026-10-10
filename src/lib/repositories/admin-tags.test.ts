/**
 * Caminho: src/lib/repositories/admin-tags.test.ts
 * Arquivo: admin-tags.test.ts
 * Descrição: Testes do repositório de tags do admin, com o Prisma mockado: leitura de id e tags e gravação em transação.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { listAllPostTags, updatePostsTags } from "./admin-tags";

const db = vi.hoisted(() => ({ findMany: vi.fn(), update: vi.fn(), $transaction: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: { post: { findMany: db.findMany, update: db.update }, $transaction: db.$transaction } }));

describe("repositories/admin-tags", () => {
  beforeEach(() => Object.values(db).forEach((fn) => fn.mockReset()));

  it("lista id e tags de todos os artigos", async () => {
    db.findMany.mockResolvedValue([{ id: "1", tags: ["a"] }]);

    expect(await listAllPostTags()).toEqual([{ id: "1", tags: ["a"] }]);
    expect(db.findMany).toHaveBeenCalledWith({ select: { id: true, tags: true } });
  });

  it("grava as tags de vários artigos numa só transação", async () => {
    db.update.mockImplementation((args) => args);
    db.$transaction.mockResolvedValue([]);

    await updatePostsTags([{ id: "1", tags: ["x"] }, { id: "2", tags: [] }]);

    expect(db.update).toHaveBeenCalledWith({ where: { id: "1" }, data: { tags: ["x"] } });
    expect(db.$transaction.mock.calls[0][0]).toHaveLength(2);
  });
});
