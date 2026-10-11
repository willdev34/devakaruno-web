/**
 * Caminho: src/app/admin/configuracoes/actions.test.ts
 * Arquivo: actions.test.ts
 * Descrição: Testes da Server Action de configurações: exige admin e atualiza o layout inteiro só quando salvou.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { saveSettingsAction } from "./actions";

const m = vi.hoisted(() => ({ requireAdmin: vi.fn(), saveSettings: vi.fn(), revalidatePath: vi.fn() }));

vi.mock("@/lib/admin-session", () => ({ requireAdmin: m.requireAdmin }));
vi.mock("@/lib/settings/save-settings", () => ({ saveSettings: m.saveSettings }));
vi.mock("next/cache", () => ({ revalidatePath: m.revalidatePath }));

describe("saveSettingsAction", () => {
  beforeEach(() => Object.values(m).forEach((fn) => fn.mockReset()));

  it("salva e revalida o layout raiz", async () => {
    m.saveSettings.mockResolvedValue({ ok: true });

    expect(await saveSettingsAction({})).toEqual({ ok: true });
    expect(m.revalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("não revalida quando a validação falha", async () => {
    m.saveSettings.mockResolvedValue({ ok: false, error: "x", fieldErrors: {} });

    await saveSettingsAction({});

    expect(m.revalidatePath).not.toHaveBeenCalled();
  });

  it("exige admin", async () => {
    m.requireAdmin.mockRejectedValue(new Error("NEXT_REDIRECT"));

    await expect(saveSettingsAction({})).rejects.toThrow("NEXT_REDIRECT");
    expect(m.saveSettings).not.toHaveBeenCalled();
  });
});
