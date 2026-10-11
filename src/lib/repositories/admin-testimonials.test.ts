/**
 * Caminho: src/lib/repositories/admin-testimonials.test.ts
 * Arquivo: admin-testimonials.test.ts
 * Descrição: Testes do repositório de depoimentos do admin: listagem, criação no fim da fila, edição, exclusão e troca de posição.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createTestimonial,
  deleteTestimonial,
  getTestimonial,
  listAdminTestimonials,
  moveTestimonial,
  updateTestimonial,
} from "./admin-testimonials";

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
    testimonial: {
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

const data = { clientName: "Ana", review: "Muito bom o atendimento", featured: false };

describe("repositories/admin-testimonials", () => {
  beforeEach(() => {
    Object.values(db).forEach((fn) => fn.mockClear());
    db.update.mockImplementation((args: unknown) => args);
  });

  it("lista na ordem do site, com createdAt desempatando", async () => {
    db.findMany.mockResolvedValue([]);

    await listAdminTestimonials();

    expect(db.findMany).toHaveBeenCalledWith({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  });

  it("busca por id", async () => {
    await getTestimonial("1");

    expect(db.findUnique).toHaveBeenCalledWith({ where: { id: "1" } });
  });

  it("cria no fim da fila", async () => {
    db.aggregate.mockResolvedValue({ _max: { order: 7 } });

    await createTestimonial(data);

    expect(db.create).toHaveBeenCalledWith({ data: { ...data, order: 8 } });
  });

  it("cria a primeira posição quando não há depoimentos", async () => {
    db.aggregate.mockResolvedValue({ _max: { order: null } });

    await createTestimonial(data);

    expect(db.create).toHaveBeenCalledWith({ data: { ...data, order: 1 } });
  });

  it("atualiza e exclui", async () => {
    await updateTestimonial("1", data);
    await deleteTestimonial("1");

    expect(db.update).toHaveBeenCalledWith({ where: { id: "1" }, data });
    expect(db.delete).toHaveBeenCalledWith({ where: { id: "1" } });
  });

  describe("moveTestimonial", () => {
    beforeEach(() => db.findMany.mockResolvedValue([{ id: "a" }, { id: "b" }, { id: "c" }]));

    it("sobe trocando com o vizinho e renumera a fila", async () => {
      expect(await moveTestimonial("b", "up")).toBe(true);

      expect(db.transaction).toHaveBeenCalledWith([
        { where: { id: "b" }, data: { order: 1 } },
        { where: { id: "a" }, data: { order: 2 } },
        { where: { id: "c" }, data: { order: 3 } },
      ]);
    });

    it("desce trocando com o vizinho", async () => {
      await moveTestimonial("b", "down");

      expect(db.transaction).toHaveBeenCalledWith([
        { where: { id: "a" }, data: { order: 1 } },
        { where: { id: "c" }, data: { order: 2 } },
        { where: { id: "b" }, data: { order: 3 } },
      ]);
    });

    it("não move além das pontas nem um id desconhecido", async () => {
      expect(await moveTestimonial("a", "up")).toBe(false);
      expect(await moveTestimonial("c", "down")).toBe(false);
      expect(await moveTestimonial("x", "up")).toBe(false);
      expect(db.transaction).not.toHaveBeenCalled();
    });
  });
});
