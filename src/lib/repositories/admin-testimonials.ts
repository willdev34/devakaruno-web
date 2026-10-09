/**
 * Caminho: src/lib/repositories/admin-testimonials.ts
 * Arquivo: admin-testimonials.ts
 * Descrição: Acesso do painel admin aos depoimentos: listagem na ordem do site, leitura, criação (vai para o fim), edição, exclusão e troca de posição.
 */
import { prisma } from "@/lib/prisma";

export type TestimonialWriteData = {
  clientName: string;
  review: string;
  featured: boolean;
};

export type MoveDirection = "up" | "down";

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
  const from = items.findIndex((item) => item.id === id);
  const to = direction === "up" ? from - 1 : from + 1;
  if (from === -1 || to < 0 || to >= items.length) return false;

  const ids = items.map((item) => item.id);
  [ids[from], ids[to]] = [ids[to], ids[from]];

  await prisma.$transaction(
    ids.map((itemId, index) => prisma.testimonial.update({ where: { id: itemId }, data: { order: index + 1 } })),
  );
  return true;
}
