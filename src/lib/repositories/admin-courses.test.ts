/**
 * Caminho: src/lib/repositories/admin-courses.test.ts
 * Arquivo: admin-courses.test.ts
 * Descrição: Testes do repositório de cursos do admin: listagem, leitura com FAQs, slug repetido, criação com FAQs numeradas, edição em transação e exclusão.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createCourse,
  deleteCourse,
  getAdminCourse,
  isCourseSlugTaken,
  listAdminCourses,
  updateCourse,
  type CourseFields,
} from "./admin-courses";

const db = vi.hoisted(() => ({
  findMany: vi.fn(),
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn((args: unknown) => ({ op: "update", args })),
  delete: vi.fn(),
  deleteMany: vi.fn((args: unknown) => ({ op: "deleteMany", args })),
  createMany: vi.fn((args: unknown) => ({ op: "createMany", args })),
  transaction: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    course: { findMany: db.findMany, findUnique: db.findUnique, create: db.create, update: db.update, delete: db.delete },
    courseFaq: { deleteMany: db.deleteMany, createMany: db.createMany },
    $transaction: db.transaction,
  },
}));

const fields = { title: "T", whatsappLink: "https://wa.me/1" } as CourseFields;
const faqs = [
  { question: "Pergunta A?", answer: "Resposta A" },
  { question: "Pergunta B?", answer: "Resposta B" },
];

describe("repositories/admin-courses", () => {
  beforeEach(() => {
    Object.values(db).forEach((fn) => fn.mockClear());
    db.update.mockImplementation((args: unknown) => ({ op: "update", args }));
    db.deleteMany.mockImplementation((args: unknown) => ({ op: "deleteMany", args }));
    db.createMany.mockImplementation((args: unknown) => ({ op: "createMany", args }));
  });

  it("lista na ordem de criação com o total de FAQs", async () => {
    await listAdminCourses();

    expect(db.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "asc" },
      include: { _count: { select: { faqs: true } } },
    });
  });

  it("busca o curso com as FAQs ordenadas", async () => {
    await getAdminCourse("1");

    expect(db.findUnique).toHaveBeenCalledWith({
      where: { id: "1" },
      include: { faqs: { orderBy: { order: "asc" } } },
    });
  });

  describe("isCourseSlugTaken", () => {
    it("livre quando não existe", async () => {
      db.findUnique.mockResolvedValue(null);

      expect(await isCourseSlugTaken("novo")).toBe(false);
    });

    it("ocupado quando existe", async () => {
      db.findUnique.mockResolvedValue({ id: "1" });

      expect(await isCourseSlugTaken("novo")).toBe(true);
    });

    it("não conta o próprio curso", async () => {
      db.findUnique.mockResolvedValue({ id: "1" });

      expect(await isCourseSlugTaken("novo", "1")).toBe(false);
    });
  });

  it("cria o curso com as FAQs numeradas a partir de 1", async () => {
    await createCourse({ ...fields, slug: "novo" }, faqs);

    expect(db.create).toHaveBeenCalledWith({
      data: {
        ...fields,
        slug: "novo",
        faqs: {
          create: [
            { ...faqs[0], order: 1 },
            { ...faqs[1], order: 2 },
          ],
        },
      },
    });
  });

  it("atualiza o curso e troca as FAQs na mesma transação, devolvendo o curso", async () => {
    db.transaction.mockResolvedValue([{ id: "1" }, { count: 2 }, { count: 2 }]);

    const course = await updateCourse("1", fields, faqs);

    expect(course).toEqual({ id: "1" });
    expect(db.transaction).toHaveBeenCalledWith([
      { op: "update", args: { where: { id: "1" }, data: fields } },
      { op: "deleteMany", args: { where: { courseId: "1" } } },
      {
        op: "createMany",
        args: {
          data: [
            { ...faqs[0], order: 1, courseId: "1" },
            { ...faqs[1], order: 2, courseId: "1" },
          ],
        },
      },
    ]);
  });

  it("exclui o curso", async () => {
    await deleteCourse("1");

    expect(db.delete).toHaveBeenCalledWith({ where: { id: "1" } });
  });
});
