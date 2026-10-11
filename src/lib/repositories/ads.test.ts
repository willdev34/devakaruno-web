/**
 * Caminho: src/lib/repositories/ads.test.ts
 * Arquivo: ads.test.ts
 * Descrição: Testes da leitura pública de banners: só ativo, dentro do período e o primeiro da fila da posição.
 */
import { describe, expect, it, vi } from "vitest";
import { getActiveAd } from "./ads";

const { findFirst } = vi.hoisted(() => ({ findFirst: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: { advertisement: { findFirst } } }));

describe("getActiveAd", () => {
  it("busca o primeiro banner ativo da posição dentro do período", async () => {
    const now = new Date("2026-10-10T12:00:00.000Z");
    findFirst.mockResolvedValue({ name: "X", imageUrl: "/i.jpg", linkUrl: "https://x.com", altText: "alt" });

    const ad = await getActiveAd("POST_END", now);

    const args = findFirst.mock.calls[0][0];
    expect(args.where.position).toBe("POST_END");
    expect(args.where.active).toBe(true);
    expect(args.where.AND).toEqual([
      { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
      { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
    ]);
    expect(args.orderBy).toEqual([{ order: "asc" }, { createdAt: "asc" }]);
    expect(ad).toEqual({ name: "X", imageUrl: "/i.jpg", linkUrl: "https://x.com", altText: "alt" });
  });

  it("devolve null quando não há banner", async () => {
    findFirst.mockResolvedValue(null);

    expect(await getActiveAd("BLOG_LIST")).toBeNull();
  });
});
