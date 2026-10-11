/**
 * Caminho: src/lib/repositories/admin-ads.test.ts
 * Arquivo: admin-ads.test.ts
 * Descrição: Testes do repositório de banners do admin: listagem, criação no fim da posição, troca de posição, exclusão e troca de lugar na fila.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAd, deleteAd, getAd, listAdminAds, moveAd, updateAd } from "./admin-ads";

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
    advertisement: {
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

const data = {
  name: "X",
  position: "BLOG_LIST",
  imageUrl: "/i.jpg",
  linkUrl: "https://x.com",
  altText: "alt",
  active: true,
  startsAt: null,
  endsAt: null,
};

describe("repositories/admin-ads", () => {
  beforeEach(() => {
    Object.values(db).forEach((fn) => fn.mockClear());
    db.update.mockImplementation((args: unknown) => args);
  });

  it("lista agrupando por posição e ordem", async () => {
    db.findMany.mockResolvedValue([]);

    await listAdminAds();

    expect(db.findMany.mock.calls[0][0].orderBy[0]).toEqual({ position: "asc" });
    expect(db.findMany.mock.calls[0][0].orderBy[1]).toEqual({ order: "asc" });
  });

  it("lê um banner pelo id", async () => {
    db.findUnique.mockResolvedValue({ id: "1" });

    expect(await getAd("1")).toEqual({ id: "1" });
    expect(db.findUnique).toHaveBeenCalledWith({ where: { id: "1" } });
  });

  it("cria no fim da fila da posição", async () => {
    db.aggregate.mockResolvedValue({ _max: { order: 4 } });

    await createAd(data);

    expect(db.aggregate).toHaveBeenCalledWith({ where: { position: "BLOG_LIST" }, _max: { order: true } });
    expect(db.create).toHaveBeenCalledWith({ data: { ...data, order: 5 } });
  });

  it("a primeira da posição recebe a ordem 1", async () => {
    db.aggregate.mockResolvedValue({ _max: { order: null } });

    await createAd(data);

    expect(db.create.mock.calls[0][0].data.order).toBe(1);
  });

  it("edita sem mexer na ordem quando a posição é a mesma", async () => {
    db.findUnique.mockResolvedValue({ position: "BLOG_LIST" });

    await updateAd("1", data);

    expect(db.update).toHaveBeenCalledWith({ where: { id: "1" }, data });
    expect(db.aggregate).not.toHaveBeenCalled();
  });

  it("trocar de posição leva para o fim da fila da nova posição", async () => {
    db.findUnique.mockResolvedValue({ position: "POST_END" });
    db.aggregate.mockResolvedValue({ _max: { order: 2 } });

    await updateAd("1", data);

    expect(db.update).toHaveBeenCalledWith({ where: { id: "1" }, data: { ...data, order: 3 } });
  });

  it("exclui pelo id", async () => {
    await deleteAd("1");

    expect(db.delete).toHaveBeenCalledWith({ where: { id: "1" } });
  });

  it("move dentro da mesma posição e renumera a fila", async () => {
    db.findUnique.mockResolvedValue({ position: "BLOG_LIST" });
    db.findMany.mockResolvedValue([{ id: "a" }, { id: "b" }, { id: "c" }]);
    db.transaction.mockResolvedValue([]);

    expect(await moveAd("b", "up")).toBe(true);

    expect(db.findMany.mock.calls[0][0].where).toEqual({ position: "BLOG_LIST" });
    expect(db.update).toHaveBeenCalledWith({ where: { id: "b" }, data: { order: 1 } });
    expect(db.update).toHaveBeenCalledWith({ where: { id: "a" }, data: { order: 2 } });
    expect(db.transaction).toHaveBeenCalled();
  });

  it("não move além das pontas nem banner inexistente", async () => {
    db.findUnique.mockResolvedValueOnce({ position: "BLOG_LIST" });
    db.findMany.mockResolvedValue([{ id: "a" }, { id: "b" }]);

    expect(await moveAd("a", "up")).toBe(false);
    expect(db.transaction).not.toHaveBeenCalled();

    db.findUnique.mockResolvedValueOnce(null);
    expect(await moveAd("x", "up")).toBe(false);
  });
});
