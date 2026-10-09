/**
 * Caminho: src/lib/admin-upload-client.test.ts
 * Arquivo: admin-upload-client.test.ts
 * Descrição: Testes do envio de imagem pelo navegador (fetch mockado).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { uploadImageClient } from "./admin-upload-client";

const file = new File(["a"], "a.png", { type: "image/png" });

describe("uploadImageClient", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("devolve a URL enviada", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ url: "https://x/a.png" }) });
    vi.stubGlobal("fetch", fetchMock);

    expect(await uploadImageClient(file)).toBe("https://x/a.png");
    expect(fetchMock.mock.calls[0][0]).toBe("/api/admin/upload");
  });

  it("lança a mensagem do servidor", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: "grande demais" }) }));

    await expect(uploadImageClient(file)).rejects.toThrow("grande demais");
  });

  it("usa mensagem padrão quando a resposta não é JSON", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => { throw new Error("x"); } }));

    await expect(uploadImageClient(file)).rejects.toThrow("Não foi possível enviar a imagem.");
  });
});
