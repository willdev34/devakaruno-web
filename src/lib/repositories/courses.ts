/**
 * Caminho: src/lib/repositories/courses.ts
 * Arquivo: courses.ts
 * Descrição: Leitura de cursos e vivências no banco. A listagem segue a ordem de criação e cada curso traz suas FAQs ordenadas.
 */
import { prisma } from "@/lib/prisma";

// Todos os cursos, do mais antigo para o mais novo
export function getCourses() {
  return prisma.course.findMany({ orderBy: { createdAt: "asc" } });
}

// Um curso pelo slug, com as perguntas frequentes na ordem definida (null se não existir)
export function getCourseBySlug(slug: string) {
  return prisma.course.findUnique({
    where: { slug },
    include: { faqs: { orderBy: { order: "asc" } } },
  });
}

// Slug e última alteração de cada curso, para o sitemap
export function getSitemapCourses() {
  return prisma.course.findMany({ select: { slug: true, updatedAt: true }, orderBy: { createdAt: "asc" } });
}
