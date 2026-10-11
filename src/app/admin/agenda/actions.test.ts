/**
 * Caminho: src/app/admin/agenda/actions.test.ts
 * Arquivo: actions.test.ts
 * Descrição: Testes das Server Actions da agenda: exigem admin e revalidam as páginas.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { deleteAgendaAction, saveAgendaAction } from "./actions";

const m = vi.hoisted(() => ({ requireAdmin: vi.fn(), saveAgenda: vi.fn(), deleteAgendaEvent: vi.fn(), revalidatePath: vi.fn() }));

vi.mock("@/lib/admin-session", () => ({ requireAdmin: m.requireAdmin }));
vi.mock("@/lib/agenda/save-agenda", () => ({ saveAgenda: m.saveAgenda }));
vi.mock("@/lib/repositories/admin-agenda", () => ({ deleteAgendaEvent: m.deleteAgendaEvent }));
vi.mock("next/cache", () => ({ revalidatePath: m.revalidatePath }));

describe("actions da agenda", () => {
  beforeEach(() => Object.values(m).forEach((fn) => fn.mockReset()));

  it("salva e revalida /agenda quando dá certo", async () => {
    m.saveAgenda.mockResolvedValue({ ok: true, id: "1" });

    expect(await saveAgendaAction(null, { city: "X" })).toEqual({ ok: true, id: "1" });
    expect(m.revalidatePath).toHaveBeenCalledWith("/agenda");
  });

  it("não revalida quando a validação falha", async () => {
    m.saveAgenda.mockResolvedValue({ ok: false, error: "x", fieldErrors: {} });

    await saveAgendaAction("1", {});

    expect(m.revalidatePath).not.toHaveBeenCalled();
  });

  it("exclui e revalida", async () => {
    expect(await deleteAgendaAction("1")).toEqual({ ok: true });
    expect(m.deleteAgendaEvent).toHaveBeenCalledWith("1");
    expect(m.revalidatePath).toHaveBeenCalledWith("/admin/agenda");
  });

  it("exige admin", async () => {
    m.requireAdmin.mockRejectedValue(new Error("NEXT_REDIRECT"));

    await expect(deleteAgendaAction("1")).rejects.toThrow("NEXT_REDIRECT");
    await expect(saveAgendaAction(null, {})).rejects.toThrow("NEXT_REDIRECT");
    expect(m.deleteAgendaEvent).not.toHaveBeenCalled();
  });
});
