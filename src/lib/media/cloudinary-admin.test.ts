// @vitest-environment node
/**
 * Caminho: src/lib/media/cloudinary-admin.test.ts
 * Arquivo: cloudinary-admin.test.ts
 * Descrição: Testes da leitura e exclusão de imagens no Cloudinary (fetch mockado): mapeamento, pastas, paginação, erros e assinatura.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { deleteMedia, getMedia, listMedia, toMediaItem } from "./cloudinary-admin";

const raw = (over = {}) => ({
  public_id: "devakaruno-web/blog/capa_ab",
  secure_url: "https://res.cloudinary.com/c/image/upload/v1/devakaruno-web/blog/capa_ab.jpg",
  width: 800,
  height: 600,
  bytes: 2048,
  format: "jpg",
  created_at: "2026-10-10T12:00:00Z",
  ...over,
});

describe("toMediaItem", () => {
  it("em pastas fixas, a pasta vem do public_id", () => {
    const item = toMediaItem(raw(), "devakaruno-web");
    expect(item).toMatchObject({ folder: "devakaruno-web/blog", managed: true, width: 800, format: "jpg" });
  });

  it("em pastas dinâmicas, a pasta vem de asset_folder", () => {
    const item = toMediaItem(raw({ public_id: "capa_ab", asset_folder: "devakaruno-web/cursos" }), "devakaruno-web");
    expect(item).toMatchObject({ folder: "devakaruno-web/cursos", managed: true });
  });

  it("a própria pasta base também conta como do site", () => {
    expect(toMediaItem(raw({ public_id: "x", asset_folder: "devakaruno-web" }), "devakaruno-web").managed).toBe(true);
  });

  it("imagem na raiz ou em pasta de fora não é do site", () => {
    expect(toMediaItem(raw({ public_id: "logo_x" }), "devakaruno-web")).toMatchObject({ folder: "", managed: false });
    expect(toMediaItem(raw({ public_id: "devakaruno-web2/a" }), "devakaruno-web").managed).toBe(false);
  });

  it("campos ausentes viram valores neutros", () => {
    expect(toMediaItem({ public_id: "a", secure_url: "u" }, "b")).toMatchObject({ width: 0, height: 0, bytes: 0, format: "", createdAt: "" });
  });

  it("usa a pasta base do ambiente quando não informada", () => {
    vi.stubEnv("CLOUDINARY_FOLDER", "outra");
    expect(toMediaItem(raw({ public_id: "outra/x" })).managed).toBe(true);
    vi.unstubAllEnvs();
  });
});

describe("Cloudinary Admin", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("CLOUDINARY_CLOUD_NAME", "cloud");
    vi.stubEnv("CLOUDINARY_API_KEY", "key");
    vi.stubEnv("CLOUDINARY_API_SECRET", "secret");
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("lista com autenticação, ordem decrescente e cursor", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ resources: [raw()], next_cursor: "abc" }) });

    const page = await listMedia("anterior");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("https://api.cloudinary.com/v1_1/cloud/resources/image/upload?");
    expect(url).toContain("direction=desc");
    expect(url).toContain("next_cursor=anterior");
    expect(init.headers.Authorization).toBe(`Basic ${Buffer.from("key:secret").toString("base64")}`);
    expect(page.nextCursor).toBe("abc");
    expect(page.items).toHaveLength(1);
  });

  it("primeira página sem cursor e sem próximas páginas", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });

    const page = await listMedia();

    expect(fetchMock.mock.calls[0][0]).not.toContain("next_cursor");
    expect(page).toEqual({ items: [], nextCursor: null });
  });

  it("falha com 502 quando o Cloudinary responde erro", async () => {
    fetchMock.mockResolvedValue({ ok: false });
    await expect(listMedia()).rejects.toMatchObject({ status: 502 });
  });

  it("falha com 503 quando faltam as credenciais", async () => {
    vi.stubEnv("CLOUDINARY_API_SECRET", "");
    await expect(listMedia()).rejects.toMatchObject({ status: 503 });
  });

  it("getMedia codifica o caminho, devolve null no 404 e falha em outros erros", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => raw() });
    expect((await getMedia("devakaruno-web/blog/capa ab"))?.publicId).toBe("devakaruno-web/blog/capa_ab");
    expect(fetchMock.mock.calls[0][0]).toContain("/resources/image/upload/devakaruno-web/blog/capa%20ab");

    fetchMock.mockResolvedValueOnce({ ok: false, status: 404 });
    expect(await getMedia("x")).toBeNull();

    fetchMock.mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(getMedia("x")).rejects.toMatchObject({ status: 502 });
  });

  it("exclui com destroy assinado e invalidação de cache", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ result: "ok" }) });

    await deleteMedia("devakaruno-web/blog/capa_ab");

    const [url, init] = fetchMock.mock.calls[0];
    const body = init.body as FormData;
    expect(url).toBe("https://api.cloudinary.com/v1_1/cloud/image/destroy");
    expect(body.get("public_id")).toBe("devakaruno-web/blog/capa_ab");
    expect(body.get("invalidate")).toBe("true");
    expect(body.get("api_key")).toBe("key");
    expect(body.get("signature")).toMatch(/^[0-9a-f]{40}$/);
  });

  it("aceita 'not found' e recusa respostas inesperadas ou erro HTTP", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ result: "not found" }) });
    await expect(deleteMedia("x")).resolves.toBeUndefined();

    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ result: "erro" }) });
    await expect(deleteMedia("x")).rejects.toMatchObject({ status: 502 });

    fetchMock.mockResolvedValueOnce({ ok: false });
    await expect(deleteMedia("x")).rejects.toMatchObject({ status: 502 });
  });
});
