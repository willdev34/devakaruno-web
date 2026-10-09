// @vitest-environment node
/**
 * Caminho: src/lib/cloudinary-upload.test.ts
 * Arquivo: cloudinary-upload.test.ts
 * Descrição: Testes do upload ao Cloudinary: assinatura, validações e respostas de sucesso e erro (fetch mockado).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UploadError, signParams, uploadImage } from "./cloudinary-upload";

const png = (size = 10, type = "image/png") => new File([new Uint8Array(size)], "a.png", { type });

describe("signParams", () => {
  it("ordena os parâmetros e assina com sha1", () => {
    const a = signParams({ timestamp: "1", folder: "x" }, "segredo");
    const b = signParams({ folder: "x", timestamp: "1" }, "segredo");

    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{40}$/);
    expect(signParams({ folder: "x", timestamp: "1" }, "outro")).not.toBe(a);
  });
});

describe("uploadImage", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    process.env.CLOUDINARY_CLOUD_NAME = "nuvem";
    process.env.CLOUDINARY_API_KEY = "chave";
    process.env.CLOUDINARY_API_SECRET = "segredo";
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => vi.unstubAllGlobals());

  it("falha com 503 sem configuração", async () => {
    delete process.env.CLOUDINARY_API_KEY;

    await expect(uploadImage(png())).rejects.toMatchObject({ status: 503 });
  });

  it("recusa tipo e tamanho inválidos", async () => {
    await expect(uploadImage(png(10, "image/gif"))).rejects.toMatchObject({ status: 400 });
    await expect(uploadImage(png(11 * 1024 * 1024))).rejects.toMatchObject({ status: 400 });
  });

  it("envia assinado e devolve a URL", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ secure_url: "https://res.cloudinary.com/x.png" }) });

    const url = await uploadImage(png());

    expect(url).toBe("https://res.cloudinary.com/x.png");
    const [endpoint, init] = fetchMock.mock.calls[0];
    expect(endpoint).toBe("https://api.cloudinary.com/v1_1/nuvem/image/upload");
    expect((init.body as FormData).get("signature")).toMatch(/^[0-9a-f]{40}$/);
  });

  it("trata erro e resposta sem URL", async () => {
    fetchMock.mockResolvedValueOnce({ ok: false });
    await expect(uploadImage(png())).rejects.toBeInstanceOf(UploadError);

    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    await expect(uploadImage(png())).rejects.toMatchObject({ status: 502 });
  });
});
