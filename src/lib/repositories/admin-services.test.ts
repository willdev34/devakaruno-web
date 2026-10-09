/**
 * Caminho: src/lib/repositories/admin-services.test.ts
 * Arquivo: admin-services.test.ts
 * Descrição: Testes do repositório de serviços do admin: listagem, criação no fim da fila, edição, exclusão e troca de posição.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createService, deleteService, getService, listAdminServices, moveService, updateService } from "./admin-services";

const db = vi.hoisted(() => ({
  findMany: vi.fn(),
  findUnique: vi.fn(),
  aggregate: vi.fn(),
  create: vi.fn(),
  update: vi.fn((args: unknown) => args),
  delete: vi.fn(),
  transaction: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    service: {
      findMany: db.findMany,
      findUnique: db.findUnique,
      aggregate: db.aggregate,
      create: db.create,
      update: db.update,
      delete: db.delete,
    },
    $transaction: db.transaction,
  },
}));

const data = { icon: "/i.svg", title: "Casais", text: "Sessão para casais", whatsappLink: "https://wa.me/1" };

describe("repositories/admin-services", () => {
  beforeEach(() => {
    Object.values(db).forEach((fn) => fn.mockClear());
    db.update.mockImplementation((args: unknown) => args);
  });

  it("lista na ordem do site, com o id desempatando", async () => {
    db.findMany.mockResolvedValue([]);

    await listAdminServices();

    expect(db.findMany).toHaveBeenCalledWith({ orderBy: [{ order: "asc" }, { id: "asc" }] });
  });

  it("busca por id", async () => {
    await getService("1");

    expect(db.findUnique).toHaveBeenCalledWith({ where: { id: "1" } });
  });

  it("cria no fim da fila, ou na primeira posição se estiver vazia", async () => {
    db.aggregate.mockResolvedValueOnce({ _max: { order: 3 } }).mockResolvedValueOnce({ _max: { order: null } });

    await createService(data);
    await createService(data);

    expect(db.create).toHaveBeenNthCalledWith(1, { data: { ...data, order: 4 } });
    expect(db.create).toHaveBeenNthCalledWith(2, { data: { ...data, order: 1 } });
  });

  it("atualiza e exclui", async () => {
    await updateService("1", data);
    await deleteService("1");

    expect(db.update).toHaveBeenCalledWith({ where: { id: "1" }, data });
    expect(db.delete).toHaveBeenCalledWith({ where: { id: "1" } });
  });

  describe("moveService", () => {
    beforeEach(() => db.findMany.mockResolvedValue([{ id: "a" }, { id: "b" }, { id: "c" }]));

    it("troca com o vizinho e renumera a fila", async () => {
      expect(await moveService("b", "up")).toBe(true);

      expect(db.transaction).toHaveBeenCalledWith([
        { where: { id: "b" }, data: { order: 1 } },
        { where: { id: "a" }, data: { order: 2 } },
        { where: { id: "c" }, data: { order: 3 } },
      ]);
    });

    it("não grava nada nas pontas nem para id desconhecido", async () => {
      expect(await moveService("a", "up")).toBe(false);
      expect(await moveService("c", "down")).toBe(false);
      expect(await moveService("x", "down")).toBe(false);
      expect(db.transaction).not.toHaveBeenCalled();
    });
  });
});
