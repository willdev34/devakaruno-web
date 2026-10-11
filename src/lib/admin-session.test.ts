/**
 * Caminho: src/lib/admin-session.test.ts
 * Arquivo: admin-session.test.ts
 * Descrição: Testes da proteção no servidor: requireAdmin redireciona quem não é admin e isAdminRequest informa a permissão.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { isAdminRequest, requireAdmin } from "./admin-session";

const { getServerSession, redirect } = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  redirect: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
}));

vi.mock("next-auth", () => ({ getServerSession }));
vi.mock("next/navigation", () => ({ redirect }));

describe("admin-session", () => {
  beforeEach(() => {
    process.env.ADMIN_EMAIL = "dono@site.com";
    getServerSession.mockReset();
    redirect.mockClear();
  });

  it("requireAdmin devolve a sessão do admin", async () => {
    const session = { user: { email: "dono@site.com" } };
    getServerSession.mockResolvedValue(session);

    expect(await requireAdmin()).toBe(session);
    expect(redirect).not.toHaveBeenCalled();
  });

  it("requireAdmin manda para /signin quando não é admin", async () => {
    getServerSession.mockResolvedValue({ user: { email: "outro@site.com" } });

    await expect(requireAdmin()).rejects.toThrow("NEXT_REDIRECT");
    expect(redirect).toHaveBeenCalledWith("/signin");
  });

  it("isAdminRequest responde conforme a sessão", async () => {
    getServerSession.mockResolvedValueOnce({ user: { email: "dono@site.com" } });
    expect(await isAdminRequest()).toBe(true);

    getServerSession.mockResolvedValueOnce(null);
    expect(await isAdminRequest()).toBe(false);
  });
});
