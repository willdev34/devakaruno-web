/**
 * Caminho: src/lib/repositories/courses.test.ts
 * Arquivo: courses.test.ts
 * Descrição: Testes do repositório de cursos, com o Prisma mockado: ordenação da lista e busca por slug com FAQs ordenadas.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCourseBySlug, getCourses } from "./courses";

const { findMany, findUnique } = vi.hoisted(() => ({ findMany: vi.fn(), findUnique: vi.fn() }));

vi.mock("@/lib/prisma", () => ({ prisma: { course: { findMany, findUnique } } }));

describe("repositories/courses", () => {
  beforeEach(() => {
    findMany.mockReset();
    findUnique.mockReset();
  });

  it("lista os cursos do mais antigo para o mais novo", async () => {
    findMany.mockResolvedValue([{ id: "1" }]);

    const result = await getCourses();

    expect(findMany).toHaveBeenCalledWith({ orderBy: { createdAt: "asc" } });
    expect(result).toEqual([{ id: "1" }]);
  });

  it("busca um curso pelo slug trazendo as FAQs ordenadas", async () => {
    findUnique.mockResolvedValue({ id: "1", slug: "curso-a", faqs: [] });

    const result = await getCourseBySlug("curso-a");

    expect(findUnique).toHaveBeenCalledWith({
      where: { slug: "curso-a" },
      include: { faqs: { orderBy: { order: "asc" } } },
    });
    expect(result).toMatchObject({ slug: "curso-a" });
  });

  it("devolve null quando o slug não existe", async () => {
    findUnique.mockResolvedValue(null);

    expect(await getCourseBySlug("nao-existe")).toBeNull();
  });
});
