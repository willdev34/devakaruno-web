/**
 * Caminho: src/lib/repositories/testimonials.ts
 * Arquivo: testimonials.ts
 * Descrição: Leitura de depoimentos no banco. Destaques vão ao carrossel da Home, os demais à página Quem é o Karuno.
 */
import { prisma } from "@/lib/prisma";

// Depoimentos em destaque, na ordem definida em "order"
export function getFeaturedTestimonials() {
  return prisma.testimonial.findMany({
    where: { featured: true },
    orderBy: { order: "asc" },
  });
}

// Depoimentos que não são destaque, na ordem definida em "order"
export function getMoreTestimonials() {
  return prisma.testimonial.findMany({
    where: { featured: false },
    orderBy: { order: "asc" },
  });
}
