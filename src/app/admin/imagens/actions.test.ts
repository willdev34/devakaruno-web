/**
 * Caminho: src/app/admin/imagens/actions.test.ts
 * Arquivo: actions.test.ts
 * Descrição: Testes da Server Action de exclusão de imagem: exige admin, revalida só quando exclui e devolve o motivo da recusa ou do erro.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { deleteMediaAction } from "./actions";

const m = vi.hoisted(() => ({ requireAdmin: vi.fn(), deleteMediaIfFree: vi.fn(), revalidatePath: vi.fn() }));

vi.mock("@/lib/admin-session", () => ({ requireAdmin: m.requireAdmin }));
vi.mock("@/lib/media/delete-media", () => ({ deleteMediaIfFree: m.deleteMediaIfFree }));
vi.mock("@/lib/media/cloudinary-admin", () => ({ getMedia: vi.fn(), deleteMedia: vi.fn() }));
vi.mock("@/lib/repositories/admin-media", () => ({ listImageSources: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: m.revalidatePath }));

describe("deleteMediaAction", () => {
  beforeEach(() => Object.values(m).forEach((fn) => fn.mockReset()));

  it("exclui e revalida a biblioteca", async () => {
    m.deleteMediaIfFree.mockResolvedValue({ ok: true });

    expect(await deleteMediaAction("a/b")).toEqual({ ok: true });
    expect(m.requireAdmin).toHaveBeenCalled();
    expect(m.revalidatePath).toHaveBeenCalledWith("/admin/imagens");
  });

  it("devolve a recusa sem revalidar", async () => {
    m.deleteMediaIfFree.mockResolvedValue({ ok: false, error: "em uso" });

    expect(await deleteMediaAction("a")).toEqual({ ok: false, error: "em uso" });
    expect(m.revalidatePath).not.toHaveBeenCalled();
  });

  it("transforma falha inesperada em mensagem", async () => {
    m.deleteMediaIfFree.mockRejectedValue(new Error("Cloudinary fora"));
    expect(await deleteMediaAction("a")).toEqual({ ok: false, error: "Cloudinary fora" });

    m.deleteMediaIfFree.mockRejectedValue("texto");
    expect(await deleteMediaAction("a")).toEqual({ ok: false, error: "Não foi possível excluir a imagem." });
  });
});
