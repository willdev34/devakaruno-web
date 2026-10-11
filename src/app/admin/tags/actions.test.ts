/**
 * Caminho: src/app/admin/tags/actions.test.ts
 * Arquivo: actions.test.ts
 * Descrição: Testes das Server Actions de tags: exigem admin e revalidam o blog e o painel só quando a mudança deu certo.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { removeTagAction, renameTagAction } from "./actions";

const m = vi.hoisted(() => ({ requireAdmin: vi.fn(), renameTag: vi.fn(), removeTagEverywhere: vi.fn(), revalidatePath: vi.fn() }));

vi.mock("@/lib/admin-session", () => ({ requireAdmin: m.requireAdmin }));
vi.mock("@/lib/tags/manage-tags", () => ({ renameTag: m.renameTag, removeTagEverywhere: m.removeTagEverywhere }));
vi.mock("next/cache", () => ({ revalidatePath: m.revalidatePath }));

describe("actions de tags", () => {
  beforeEach(() => Object.values(m).forEach((fn) => fn.mockReset()));

  it("renomeia e revalida o blog e o painel", async () => {
    m.renameTag.mockResolvedValue({ ok: true, affected: 2 });

    expect(await renameTagAction("paz", "Calma")).toEqual({ ok: true, affected: 2 });
    expect(m.renameTag).toHaveBeenCalledWith("paz", "Calma");
    expect(m.revalidatePath).toHaveBeenCalledWith("/blog");
    expect(m.revalidatePath).toHaveBeenCalledWith("/admin/tags");
    expect(m.revalidatePath).toHaveBeenCalledWith("/admin/artigos");
  });

  it("remove e revalida", async () => {
    m.removeTagEverywhere.mockResolvedValue({ ok: true, affected: 1 });

    await removeTagAction("paz");

    expect(m.removeTagEverywhere).toHaveBeenCalledWith("paz");
    expect(m.revalidatePath).toHaveBeenCalledWith("/blog/[slug]", "page");
  });

  it("não revalida quando a ação falha", async () => {
    m.renameTag.mockResolvedValue({ ok: false, error: "x" });
    m.removeTagEverywhere.mockResolvedValue({ ok: false, error: "x" });

    await renameTagAction("paz", "");
    await removeTagAction("nada");

    expect(m.revalidatePath).not.toHaveBeenCalled();
  });

  it("exige admin", async () => {
    m.requireAdmin.mockRejectedValue(new Error("NEXT_REDIRECT"));

    await expect(renameTagAction("paz", "x")).rejects.toThrow("NEXT_REDIRECT");
    await expect(removeTagAction("paz")).rejects.toThrow("NEXT_REDIRECT");
    expect(m.renameTag).not.toHaveBeenCalled();
    expect(m.removeTagEverywhere).not.toHaveBeenCalled();
  });
});
