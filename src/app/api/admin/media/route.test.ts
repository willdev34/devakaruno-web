// @vitest-environment node
/**
 * Caminho: src/app/api/admin/media/route.test.ts
 * Arquivo: route.test.ts
 * Descrição: Testes da rota que lista imagens para o seletor do admin: autorização, cursor, sucesso e erros.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";
import { UploadError } from "@/lib/cloudinary-upload";

const m = vi.hoisted(() => ({ isAdminRequest: vi.fn(), listMedia: vi.fn() }));

vi.mock("@/lib/admin-session", () => ({ isAdminRequest: m.isAdminRequest }));
vi.mock("@/lib/media/cloudinary-admin", () => ({ listMedia: m.listMedia }));

const request = (query = "") => new Request(`http://localhost/api/admin/media${query}`);

describe("GET /api/admin/media", () => {
  beforeEach(() => {
    Object.values(m).forEach((fn) => fn.mockReset());
    m.isAdminRequest.mockResolvedValue(true);
  });

  it("responde 401 para quem não é admin, sem consultar o Cloudinary", async () => {
    m.isAdminRequest.mockResolvedValue(false);

    expect((await GET(request())).status).toBe(401);
    expect(m.listMedia).not.toHaveBeenCalled();
  });

  it("devolve a primeira página sem cursor", async () => {
    m.listMedia.mockResolvedValue({ items: [{ publicId: "a" }], nextCursor: "n" });

    const response = await GET(request());

    expect(await response.json()).toEqual({ items: [{ publicId: "a" }], nextCursor: "n" });
    expect(m.listMedia).toHaveBeenCalledWith(undefined);
  });

  it("repassa o cursor da próxima página", async () => {
    m.listMedia.mockResolvedValue({ items: [], nextCursor: null });

    await GET(request("?cursor=abc"));

    expect(m.listMedia).toHaveBeenCalledWith("abc");
  });

  it("repassa o status do erro do Cloudinary e trata erro inesperado", async () => {
    m.listMedia.mockRejectedValueOnce(new UploadError("Cloudinary não configurado no servidor.", 503));
    const configured = await GET(request());
    expect(configured.status).toBe(503);
    expect(await configured.json()).toEqual({ error: "Cloudinary não configurado no servidor." });

    m.listMedia.mockRejectedValueOnce(new Error("boom"));
    expect((await GET(request())).status).toBe(500);
  });
});
