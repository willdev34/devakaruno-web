/**
 * Caminho: src/app/admin/depoimentos/actions.test.ts
 * Arquivo: actions.test.ts
 * Descrição: Testes das Server Actions de depoimentos: exigem admin e revalidam Home, Quem é o Karuno e a listagem.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { deleteTestimonialAction, moveTestimonialAction, saveTestimonialAction } from "./actions";

const m = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  saveTestimonial: vi.fn(),
  deleteTestimonial: vi.fn(),
  moveTestimonial: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/admin-session", () => ({ requireAdmin: m.requireAdmin }));
vi.mock("@/lib/testimonials/save-testimonial", () => ({ saveTestimonial: m.saveTestimonial }));
vi.mock("@/lib/repositories/admin-testimonials", () => ({
  deleteTestimonial: m.deleteTestimonial,
  moveTestimonial: m.moveTestimonial,
}));
vi.mock("next/cache", () => ({ revalidatePath: m.revalidatePath }));

describe("actions de depoimentos", () => {
  beforeEach(() => Object.values(m).forEach((fn) => fn.mockReset()));

  it("salva e revalida as três páginas", async () => {
    m.saveTestimonial.mockResolvedValue({ ok: true, id: "1" });

    expect(await saveTestimonialAction(null, {})).toEqual({ ok: true, id: "1" });
    expect(m.revalidatePath).toHaveBeenCalledWith("/");
    expect(m.revalidatePath).toHaveBeenCalledWith("/quem-e-o-karuno");
    expect(m.revalidatePath).toHaveBeenCalledWith("/admin/depoimentos");
  });

  it("não revalida quando a validação falha", async () => {
    m.saveTestimonial.mockResolvedValue({ ok: false, error: "x", fieldErrors: {} });

    await saveTestimonialAction("1", {});

    expect(m.revalidatePath).not.toHaveBeenCalled();
  });

  it("exclui e revalida", async () => {
    expect(await deleteTestimonialAction("1")).toEqual({ ok: true });
    expect(m.deleteTestimonial).toHaveBeenCalledWith("1");
    expect(m.revalidatePath).toHaveBeenCalledWith("/");
  });

  it("move e revalida só quando mudou algo", async () => {
    m.moveTestimonial.mockResolvedValueOnce(true).mockResolvedValueOnce(false);

    expect(await moveTestimonialAction("1", "up")).toEqual({ ok: true });
    expect(m.revalidatePath).toHaveBeenCalledTimes(3);

    m.revalidatePath.mockClear();
    expect(await moveTestimonialAction("1", "up")).toEqual({ ok: false });
    expect(m.revalidatePath).not.toHaveBeenCalled();
  });

  it("exige admin em todas", async () => {
    m.requireAdmin.mockRejectedValue(new Error("NEXT_REDIRECT"));

    await expect(saveTestimonialAction(null, {})).rejects.toThrow("NEXT_REDIRECT");
    await expect(deleteTestimonialAction("1")).rejects.toThrow("NEXT_REDIRECT");
    await expect(moveTestimonialAction("1", "down")).rejects.toThrow("NEXT_REDIRECT");
    expect(m.deleteTestimonial).not.toHaveBeenCalled();
    expect(m.moveTestimonial).not.toHaveBeenCalled();
  });
});
