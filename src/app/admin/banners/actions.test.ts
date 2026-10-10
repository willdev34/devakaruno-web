/**
 * Caminho: src/app/admin/banners/actions.test.ts
 * Arquivo: actions.test.ts
 * Descrição: Testes das Server Actions de banners: exigem admin e revalidam o blog e o painel só quando a mudança deu certo.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { deleteAdAction, moveAdAction, saveAdAction } from "./actions";

const m = vi.hoisted(() => ({ requireAdmin: vi.fn(), saveAd: vi.fn(), deleteAd: vi.fn(), moveAd: vi.fn(), revalidatePath: vi.fn() }));

vi.mock("@/lib/admin-session", () => ({ requireAdmin: m.requireAdmin }));
vi.mock("@/lib/ads/save-ad", () => ({ saveAd: m.saveAd }));
vi.mock("@/lib/repositories/admin-ads", () => ({ deleteAd: m.deleteAd, moveAd: m.moveAd }));
vi.mock("next/cache", () => ({ revalidatePath: m.revalidatePath }));

describe("actions de banners", () => {
  beforeEach(() => Object.values(m).forEach((fn) => fn.mockReset()));

  it("salva e revalida o blog e o painel", async () => {
    m.saveAd.mockResolvedValue({ ok: true, id: "1" });

    expect(await saveAdAction(null, {})).toEqual({ ok: true, id: "1" });
    expect(m.revalidatePath).toHaveBeenCalledWith("/blog");
    expect(m.revalidatePath).toHaveBeenCalledWith("/blog/[slug]", "page");
    expect(m.revalidatePath).toHaveBeenCalledWith("/admin/banners");
  });

  it("não revalida quando a validação falha", async () => {
    m.saveAd.mockResolvedValue({ ok: false, error: "x", fieldErrors: {} });

    await saveAdAction("1", {});

    expect(m.revalidatePath).not.toHaveBeenCalled();
  });

  it("exclui e revalida", async () => {
    expect(await deleteAdAction("1")).toEqual({ ok: true });
    expect(m.deleteAd).toHaveBeenCalledWith("1");
    expect(m.revalidatePath).toHaveBeenCalledWith("/blog");
  });

  it("move e só revalida quando mudou algo", async () => {
    m.moveAd.mockResolvedValueOnce(true).mockResolvedValueOnce(false);

    expect(await moveAdAction("1", "up")).toEqual({ ok: true });
    expect(m.revalidatePath).toHaveBeenCalledWith("/admin/banners");

    m.revalidatePath.mockClear();
    expect(await moveAdAction("1", "down")).toEqual({ ok: false });
    expect(m.revalidatePath).not.toHaveBeenCalled();
  });

  it("exige admin", async () => {
    m.requireAdmin.mockRejectedValue(new Error("NEXT_REDIRECT"));

    await expect(saveAdAction(null, {})).rejects.toThrow("NEXT_REDIRECT");
    await expect(deleteAdAction("1")).rejects.toThrow("NEXT_REDIRECT");
    await expect(moveAdAction("1", "up")).rejects.toThrow("NEXT_REDIRECT");
    expect(m.deleteAd).not.toHaveBeenCalled();
  });
});
