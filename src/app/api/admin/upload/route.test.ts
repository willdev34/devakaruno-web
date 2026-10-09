// @vitest-environment node
/**
 * Caminho: src/app/api/admin/upload/route.test.ts
 * Arquivo: route.test.ts
 * Descrição: Testes da rota de upload do admin: autorização, arquivo ausente, sucesso e erros.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { UploadError } from "@/lib/cloudinary-upload";

const { isAdminRequest, uploadImage } = vi.hoisted(() => ({ isAdminRequest: vi.fn(), uploadImage: vi.fn() }));

vi.mock("@/lib/admin-session", () => ({ isAdminRequest }));
vi.mock("@/lib/cloudinary-upload", async (original) => ({
  ...(await original<typeof import("@/lib/cloudinary-upload")>()),
  uploadImage,
}));

function requestWith(file?: File) {
  const form = new FormData();
  if (file) form.set("file", file);
  return new Request("http://localhost/api/admin/upload", { method: "POST", body: form });
}

describe("POST /api/admin/upload", () => {
  beforeEach(() => {
    isAdminRequest.mockResolvedValue(true);
    uploadImage.mockReset();
  });

  it("responde 401 para quem não é admin", async () => {
    isAdminRequest.mockResolvedValue(false);

    expect((await POST(requestWith())).status).toBe(401);
  });

  it("responde 400 sem arquivo", async () => {
    expect((await POST(requestWith())).status).toBe(400);
  });

  it("devolve a URL enviada", async () => {
    uploadImage.mockResolvedValue("https://res.cloudinary.com/x.png");

    const response = await POST(requestWith(new File(["a"], "a.png", { type: "image/png" })));

    expect(await response.json()).toEqual({ url: "https://res.cloudinary.com/x.png" });
  });

  it("repassa o status do erro de upload e trata erro inesperado", async () => {
    const file = new File(["a"], "a.png", { type: "image/png" });

    uploadImage.mockRejectedValueOnce(new UploadError("grande demais", 400));
    const known = await POST(requestWith(file));
    expect(known.status).toBe(400);
    expect(await known.json()).toEqual({ error: "grande demais" });

    uploadImage.mockRejectedValueOnce(new Error("boom"));
    expect((await POST(requestWith(file))).status).toBe(500);
  });
});
