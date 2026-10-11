/**
 * Caminho: src/lib/repositories/admin-ads.ts
 * Arquivo: admin-ads.ts
 * Descrição: Acesso do painel admin aos banners: listagem por posição e ordem, leitura, criação (vai para o fim da posição), edição, exclusão e troca de posição na fila.
 */
import { prisma } from "@/lib/prisma";
import { moveInList, type MoveDirection } from "@/lib/ordering";

export type AdWriteData = {
  name: string;
  position: string;
  imageUrl: string;
  linkUrl: string;
  altText: string;
  active: boolean;
  startsAt: Date | null;
  endsAt: Date | null;
};

const BY_ORDER = [{ order: "asc" as const }, { createdAt: "asc" as const }];

// Agrupados por posição; dentro de cada posição, na ordem de prioridade
export function listAdminAds() {
  return prisma.advertisement.findMany({ orderBy: [{ position: "asc" as const }, ...BY_ORDER] });
}

export function getAd(id: string) {
  return prisma.advertisement.findUnique({ where: { id } });
}

// Próximo número da fila de uma posição
async function nextOrder(position: string): Promise<number> {
  const last = await prisma.advertisement.aggregate({ where: { position }, _max: { order: true } });
  return (last._max.order ?? 0) + 1;
}

export async function createAd(data: AdWriteData) {
  return prisma.advertisement.create({ data: { ...data, order: await nextOrder(data.position) } });
}

// Trocar de posição leva o banner para o fim da fila da nova posição
export async function updateAd(id: string, data: AdWriteData) {
  const current = await prisma.advertisement.findUnique({ where: { id }, select: { position: true } });
  const order = current && current.position !== data.position ? { order: await nextOrder(data.position) } : {};
  return prisma.advertisement.update({ where: { id }, data: { ...data, ...order } });
}

export function deleteAd(id: string) {
  return prisma.advertisement.delete({ where: { id } });
}

// Troca de lugar com o vizinho da mesma posição e renumera a fila dela
export async function moveAd(id: string, direction: MoveDirection) {
  const current = await prisma.advertisement.findUnique({ where: { id }, select: { position: true } });
  if (!current) return false;

  const items = await prisma.advertisement.findMany({
    where: { position: current.position },
    orderBy: BY_ORDER,
    select: { id: true },
  });
  const ids = moveInList(items.map((item) => item.id), id, direction);
  if (!ids) return false;

  await prisma.$transaction(
    ids.map((itemId, index) => prisma.advertisement.update({ where: { id: itemId }, data: { order: index + 1 } })),
  );
  return true;
}
