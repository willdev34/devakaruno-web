/**
 * Caminho: src/lib/testimonials/testimonials.test.ts
 * Arquivo: testimonials.test.ts
 * Descrição: Testes da validação de depoimento e do caso de uso de salvar (criar, editar e erros por campo).
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { testimonialInputSchema } from "./schema";
import { saveTestimonial } from "./save-testimonial";

const repo = vi.hoisted(() => ({ createTestimonial: vi.fn(), updateTestimonial: vi.fn() }));
vi.mock("@/lib/repositories/admin-testimonials", () => repo);

const valid = { clientName: "  Ana  ", review: "  Foi um atendimento muito acolhedor.  ", featured: true };

describe("testimonialInputSchema", () => {
  it("aceita e limpa os espaços", () => {
    const parsed = testimonialInputSchema.parse(valid);

    expect(parsed).toEqual({ clientName: "Ana", review: "Foi um atendimento muito acolhedor.", featured: true });
  });

  it("recusa nome curto, texto curto e texto longo demais", () => {
    expect(testimonialInputSchema.safeParse({ ...valid, clientName: "A" }).success).toBe(false);
    expect(testimonialInputSchema.safeParse({ ...valid, review: "curto" }).success).toBe(false);
    expect(testimonialInputSchema.safeParse({ ...valid, review: "x".repeat(1201) }).success).toBe(false);
    expect(testimonialInputSchema.safeParse({ ...valid, clientName: "x".repeat(81) }).success).toBe(false);
  });
});

describe("saveTestimonial", () => {
  beforeEach(() => {
    Object.values(repo).forEach((fn) => fn.mockReset());
    repo.createTestimonial.mockResolvedValue({ id: "novo" });
    repo.updateTestimonial.mockResolvedValue({ id: "1" });
  });

  it("cria quando não há id", async () => {
    expect(await saveTestimonial(null, valid)).toEqual({ ok: true, id: "novo" });
    expect(repo.createTestimonial).toHaveBeenCalledWith({
      clientName: "Ana",
      review: "Foi um atendimento muito acolhedor.",
      featured: true,
    });
  });

  it("atualiza quando há id", async () => {
    expect(await saveTestimonial("1", valid)).toEqual({ ok: true, id: "1" });
    expect(repo.updateTestimonial).toHaveBeenCalledWith("1", expect.objectContaining({ clientName: "Ana" }));
    expect(repo.createTestimonial).not.toHaveBeenCalled();
  });

  it("devolve o erro de cada campo sem gravar", async () => {
    const result = await saveTestimonial(null, { clientName: "", review: "", featured: false });

    expect(result).toMatchObject({ ok: false, error: "Revise os campos destacados." });
    if (!result.ok) {
      expect(result.fieldErrors.clientName).toBe("Informe o nome");
      expect(result.fieldErrors.review).toContain("mínimo de 10");
    }
    expect(repo.createTestimonial).not.toHaveBeenCalled();
  });
});
