/**
 * Caminho: src/lib/repositories/admin-testimonials.ts
 * Arquivo: admin-testimonials.ts
 * Descrição: Acesso do painel admin aos depoimentos: listagem na ordem do site, leitura, criação (vai para o fim), edição, exclusão e troca de posição.
 */
import { prisma } from "@/lib/prisma";
import { moveInList, type MoveDirection } from "@/lib/ordering";

export type TestimonialWriteData = {
  clientName: string;
  review: string;
  featured: boolean;
};

// Mesma ordem usada no site; createdAt desempata valores iguais de "order"
const BY_ORDER = [{ order: "asc" as const }, { createdAt: "asc" as const }];

export function listAdminTestimonials() {
  return prisma.testimonial.findMany({ orderBy: BY_ORDER });
}

export function getTestimonial(id: string) {
  return prisma.testimonial.findUnique({ where: { id } });
}

// Novo depoimento entra no fim da fila
export async function createTestimonial(data: TestimonialWriteData) {
  const last = await prisma.testimonial.aggregate({ _max: { order: true } });
  return prisma.testimonial.create({ data: { ...data, order: (last._max.order ?? 0) + 1 } });
}

export function updateTestimonial(id: string, data: TestimonialWriteData) {
  return prisma.testimonial.update({ where: { id }, data });
}

export function deleteTestimonial(id: string) {
  return prisma.testimonial.delete({ where: { id } });
}

// Troca de lugar com o vizinho e renumera a fila inteira, o que também desfaz empates
export async function moveTestimonial(id: string, direction: MoveDirection) {
  const items = await prisma.testimonial.findMany({ orderBy: BY_ORDER, select: { id: true } });
  const ids = moveInList(items.map((item) => item.id), id, direction);
  if (!ids) return false;

  await prisma.$transaction(
    ids.map((itemId, index) => prisma.testimonial.update({ where: { id: itemId }, data: { order: index + 1 } })),
  );
  return true;
}
