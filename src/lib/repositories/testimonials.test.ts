/**
 * Caminho: src/lib/repositories/testimonials.test.ts
 * Arquivo: testimonials.test.ts
 * Descrição: Testes do repositório de depoimentos, com o Prisma mockado: filtro por destaque e ordenação.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getFeaturedTestimonials, getMoreTestimonials } from "./testimonials";

const { findMany } = vi.hoisted(() => ({ findMany: vi.fn() }));

vi.mock("@/lib/prisma", () => ({ prisma: { testimonial: { findMany } } }));

describe("repositories/testimonials", () => {
  beforeEach(() => {
    findMany.mockReset();
  });

  it("busca os destaques ordenados por order", async () => {
    findMany.mockResolvedValue([{ id: "1" }]);

    const result = await getFeaturedTestimonials();

    expect(findMany).toHaveBeenCalledWith({ where: { featured: true }, orderBy: { order: "asc" } });
    expect(result).toEqual([{ id: "1" }]);
  });

  it("busca os demais depoimentos ordenados por order", async () => {
    findMany.mockResolvedValue([{ id: "2" }]);

    const result = await getMoreTestimonials();

    expect(findMany).toHaveBeenCalledWith({ where: { featured: false }, orderBy: { order: "asc" } });
    expect(result).toEqual([{ id: "2" }]);
  });
});
