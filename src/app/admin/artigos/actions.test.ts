/**
 * Caminho: src/app/admin/artigos/actions.test.ts
 * Arquivo: actions.test.ts
 * Descrição: Testes das Server Actions de artigos: exigem admin, repassam o autor e revalidam as páginas.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { deletePostAction, savePostAction } from "./actions";

const m = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  savePost: vi.fn(),
  deleteAdminPost: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/admin-session", () => ({ requireAdmin: m.requireAdmin }));
vi.mock("@/lib/posts/save-post", () => ({ savePost: m.savePost }));
vi.mock("@/lib/repositories/admin-posts", () => ({ deleteAdminPost: m.deleteAdminPost }));
vi.mock("next/cache", () => ({ revalidatePath: m.revalidatePath }));

describe("actions de artigos", () => {
  beforeEach(() => {
    Object.values(m).forEach((fn) => fn.mockReset());
    m.requireAdmin.mockResolvedValue({ user: { email: "dono@site.com", name: "Deva" } });
  });

  it("salva com o autor da sessão e revalida quando dá certo", async () => {
    m.savePost.mockResolvedValue({ ok: true, id: "1", slug: "a" });

    const result = await savePostAction(null, { title: "x" });

    expect(m.savePost).toHaveBeenCalledWith(null, { title: "x" }, { email: "dono@site.com", name: "Deva" });
    expect(result).toEqual({ ok: true, id: "1", slug: "a" });
    expect(m.revalidatePath).toHaveBeenCalledWith("/blog", "layout");
  });

  it("usa um nome padrão e não revalida quando falha", async () => {
    m.requireAdmin.mockResolvedValue({ user: { email: "dono@site.com" } });
    m.savePost.mockResolvedValue({ ok: false, error: "x" });

    await savePostAction("1", {});

    expect(m.savePost.mock.calls[0][2].name).toBe("Deva Karuno");
    expect(m.revalidatePath).not.toHaveBeenCalled();
  });

  it("exclui e revalida", async () => {
    expect(await deletePostAction("1")).toEqual({ ok: true });
    expect(m.deleteAdminPost).toHaveBeenCalledWith("1");
    expect(m.revalidatePath).toHaveBeenCalledWith("/admin/artigos");
  });

  it("não exclui sem ser admin", async () => {
    m.requireAdmin.mockRejectedValue(new Error("NEXT_REDIRECT"));

    await expect(deletePostAction("1")).rejects.toThrow("NEXT_REDIRECT");
    expect(m.deleteAdminPost).not.toHaveBeenCalled();
  });
});
