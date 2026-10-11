/**
 * Caminho: src/app/admin/servicos/actions.test.ts
 * Arquivo: actions.test.ts
 * Descrição: Testes das Server Actions de serviços: exigem admin e revalidam a Home e a listagem.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { deleteServiceAction, moveServiceAction, saveServiceAction } from "./actions";

const m = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  saveService: vi.fn(),
  deleteService: vi.fn(),
  moveService: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/admin-session", () => ({ requireAdmin: m.requireAdmin }));
vi.mock("@/lib/services/save-service", () => ({ saveService: m.saveService }));
vi.mock("@/lib/repositories/admin-services", () => ({ deleteService: m.deleteService, moveService: m.moveService }));
vi.mock("next/cache", () => ({ revalidatePath: m.revalidatePath }));

describe("actions de serviços", () => {
  beforeEach(() => Object.values(m).forEach((fn) => fn.mockReset()));

  it("salva e revalida a Home e a listagem", async () => {
    m.saveService.mockResolvedValue({ ok: true, id: "1" });

    expect(await saveServiceAction(null, {})).toEqual({ ok: true, id: "1" });
    expect(m.revalidatePath).toHaveBeenCalledWith("/");
    expect(m.revalidatePath).toHaveBeenCalledWith("/admin/servicos");
  });

  it("não revalida quando a validação falha", async () => {
    m.saveService.mockResolvedValue({ ok: false, error: "x", fieldErrors: {} });

    await saveServiceAction("1", {});

    expect(m.revalidatePath).not.toHaveBeenCalled();
  });

  it("exclui e revalida", async () => {
    expect(await deleteServiceAction("1")).toEqual({ ok: true });
    expect(m.deleteService).toHaveBeenCalledWith("1");
    expect(m.revalidatePath).toHaveBeenCalledWith("/");
  });

  it("move e revalida só quando mudou algo", async () => {
    m.moveService.mockResolvedValueOnce(true).mockResolvedValueOnce(false);

    expect(await moveServiceAction("1", "down")).toEqual({ ok: true });
    expect(m.revalidatePath).toHaveBeenCalledTimes(2);

    m.revalidatePath.mockClear();
    expect(await moveServiceAction("1", "down")).toEqual({ ok: false });
    expect(m.revalidatePath).not.toHaveBeenCalled();
  });

  it("exige admin em todas", async () => {
    m.requireAdmin.mockRejectedValue(new Error("NEXT_REDIRECT"));

    await expect(saveServiceAction(null, {})).rejects.toThrow("NEXT_REDIRECT");
    await expect(deleteServiceAction("1")).rejects.toThrow("NEXT_REDIRECT");
    await expect(moveServiceAction("1", "up")).rejects.toThrow("NEXT_REDIRECT");
    expect(m.deleteService).not.toHaveBeenCalled();
    expect(m.moveService).not.toHaveBeenCalled();
  });
});
