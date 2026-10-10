/**
 * Caminho: src/lib/repositories/ads.ts
 * Arquivo: ads.ts
 * Descrição: Leitura pública dos banners: devolve o banner que deve aparecer numa posição (ativo, dentro do período, primeiro da fila).
 */
import { prisma } from "@/lib/prisma";
import type { AdPosition } from "@/lib/ads/positions";

export type PublicAd = { name: string; imageUrl: string; linkUrl: string; altText: string };

export async function getActiveAd(position: AdPosition, now = new Date()): Promise<PublicAd | null> {
  return prisma.advertisement.findFirst({
    where: {
      position,
      active: true,
      AND: [
        { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
        { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
      ],
    },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: { name: true, imageUrl: true, linkUrl: true, altText: true },
  });
}
