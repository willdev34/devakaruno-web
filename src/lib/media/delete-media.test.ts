/**
 * Caminho: src/lib/media/delete-media.test.ts
 * Arquivo: delete-media.test.ts
 * Descrição: Testes da exclusão de imagem: some se já não existe, recusa fora da pasta do site ou em uso, exclui quando livre.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { deleteMediaIfFree } from "./delete-media";
import type { MediaItem } from "./cloudinary-admin";

const item = (over: Partial<MediaItem> = {}): MediaItem => ({
  publicId: "devakaruno-web/biblioteca/foto_ab",
  url: "https://x/foto_ab.jpg",
  folder: "devakaruno-web/biblioteca",
  width: 1,
  height: 1,
  bytes: 1,
  format: "jpg",
  createdAt: "",
  managed: true,
  ...over,
});

const m = vi.hoisted(() => ({ get: vi.fn(), remove: vi.fn(), sources: vi.fn() }));

describe("deleteMediaIfFree", () => {
  beforeEach(() => {
    Object.values(m).forEach((fn) => fn.mockReset());
    m.sources.mockResolvedValue([]);
  });

  it("imagem que já não existe conta como excluída", async () => {
    m.get.mockResolvedValue(null);

    expect(await deleteMediaIfFree("x", m)).toEqual({ ok: true });
    expect(m.remove).not.toHaveBeenCalled();
  });

  it("recusa imagem fora das pastas do site", async () => {
    m.get.mockResolvedValue(item({ managed: false }));

    const result = await deleteMediaIfFree("x", m);

    expect(result).toEqual({ ok: false, error: expect.stringContaining("fora das pastas do site") });
    expect(m.remove).not.toHaveBeenCalled();
  });

  it("recusa imagem em uso e diz onde", async () => {
    m.get.mockResolvedValue(item());
    m.sources.mockResolvedValue([{ kind: "Artigo", id: "1", title: "Paz", href: "/a", texts: ["https://x/upload/v1/devakaruno-web/biblioteca/foto_ab.jpg"] }]);

    const result = await deleteMediaIfFree("devakaruno-web/biblioteca/foto_ab", m);

    expect(result).toEqual({ ok: false, error: 'Imagem em uso em: Artigo "Paz".' });
    expect(m.remove).not.toHaveBeenCalled();
  });

  it("exclui quando está livre", async () => {
    m.get.mockResolvedValue(item());

    expect(await deleteMediaIfFree("devakaruno-web/biblioteca/foto_ab", m)).toEqual({ ok: true });
    expect(m.remove).toHaveBeenCalledWith("devakaruno-web/biblioteca/foto_ab");
  });
});
