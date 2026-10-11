/**
 * Caminho: src/app/admin/categorias/actions.test.ts
 * Arquivo: actions.test.ts
 * Descrição: Testes das Server Actions de categorias: exigem admin e revalidam o blog e as listagens do painel.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { deleteCategoryAction, saveCategoryAction } from "./actions";

const m = vi.hoisted(() => ({ requireAdmin: vi.fn(), saveCategory: vi.fn(), deleteCategory: vi.fn(), revalidatePath: vi.fn() }));

vi.mock("@/lib/admin-session", () => ({ requireAdmin: m.requireAdmin }));
vi.mock("@/lib/categories/save-category", () => ({ saveCategory: m.saveCategory }));
vi.mock("@/lib/repositories/admin-categories", () => ({ deleteCategory: m.deleteCategory }));
vi.mock("next/cache", () => ({ revalidatePath: m.revalidatePath }));

describe("actions de categorias", () => {
  beforeEach(() => Object.values(m).forEach((fn) => fn.mockReset()));

  it("salva e revalida o blog e o painel", async () => {
    m.saveCategory.mockResolvedValue({ ok: true, id: "1" });

    expect(await saveCategoryAction(null, {})).toEqual({ ok: true, id: "1" });
    expect(m.revalidatePath).toHaveBeenCalledWith("/blog");
    expect(m.revalidatePath).toHaveBeenCalledWith("/admin/categorias");
    expect(m.revalidatePath).toHaveBeenCalledWith("/admin/artigos");
  });

  it("não revalida quando a validação falha", async () => {
    m.saveCategory.mockResolvedValue({ ok: false, error: "x", fieldErrors: {} });

    await saveCategoryAction("1", {});

    expect(m.revalidatePath).not.toHaveBeenCalled();
  });

  it("exclui e revalida", async () => {
    expect(await deleteCategoryAction("1")).toEqual({ ok: true });
    expect(m.deleteCategory).toHaveBeenCalledWith("1");
    expect(m.revalidatePath).toHaveBeenCalledWith("/blog");
  });

  it("exige admin", async () => {
    m.requireAdmin.mockRejectedValue(new Error("NEXT_REDIRECT"));

    await expect(saveCategoryAction(null, {})).rejects.toThrow("NEXT_REDIRECT");
    await expect(deleteCategoryAction("1")).rejects.toThrow("NEXT_REDIRECT");
    expect(m.deleteCategory).not.toHaveBeenCalled();
  });
});
