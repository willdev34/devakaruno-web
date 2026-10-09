/**
 * Caminho: src/lib/repositories/admin-services.ts
 * Arquivo: admin-services.ts
 * Descrição: Acesso do painel admin aos serviços da Home: listagem na ordem do site, leitura, criação (vai para o fim), edição, exclusão e troca de posição.
 */
import { prisma } from "@/lib/prisma";
import { moveInList, type MoveDirection } from "@/lib/ordering";

export type ServiceWriteData = {
  icon: string;
  title: string;
  text: string;
  whatsappLink: string;
};

// Mesma ordem do site; o id desempata valores iguais de "order"
const BY_ORDER = [{ order: "asc" as const }, { id: "asc" as const }];

export function listAdminServices() {
  return prisma.service.findMany({ orderBy: BY_ORDER });
}

export function getService(id: string) {
  return prisma.service.findUnique({ where: { id } });
}

// Novo serviço entra no fim da fila
export async function createService(data: ServiceWriteData) {
  const last = await prisma.service.aggregate({ _max: { order: true } });
  return prisma.service.create({ data: { ...data, order: (last._max.order ?? 0) + 1 } });
}

export function updateService(id: string, data: ServiceWriteData) {
  return prisma.service.update({ where: { id }, data });
}

export function deleteService(id: string) {
  return prisma.service.delete({ where: { id } });
}

// Troca de lugar com o vizinho e renumera a fila inteira, o que também desfaz empates
export async function moveService(id: string, direction: MoveDirection) {
  const items = await prisma.service.findMany({ orderBy: BY_ORDER, select: { id: true } });
  const ids = moveInList(items.map((item) => item.id), id, direction);
  if (!ids) return false;

  await prisma.$transaction(
    ids.map((itemId, index) => prisma.service.update({ where: { id: itemId }, data: { order: index + 1 } })),
  );
  return true;
}
