/**
 * Caminho: src/lib/repositories/admin-stats.ts
 * Arquivo: admin-stats.ts
 * Descrição: Números do dashboard do admin: artigos no ar, rascunhos e agendados, depoimentos, cursos e os artigos mais recentes.
 */
import { prisma } from "@/lib/prisma";

export type PostStatus = "published" | "scheduled" | "draft";

// Rascunho: published=false. Agendado: published=true com data futura. No ar: published=true e data alcançada
export function getPostStatus(post: { published: boolean; publishedAt: Date }, now = new Date()): PostStatus {
  if (!post.published) return "draft";
  return post.publishedAt > now ? "scheduled" : "published";
}

export async function getDashboardStats() {
  const now = new Date();
  const [published, scheduled, drafts, testimonials, courses, recent] = await Promise.all([
    prisma.post.count({ where: { published: true, publishedAt: { lte: now } } }),
    prisma.post.count({ where: { published: true, publishedAt: { gt: now } } }),
    prisma.post.count({ where: { published: false } }),
    prisma.testimonial.count(),
    prisma.course.count(),
    prisma.post.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, published: true, publishedAt: true, updatedAt: true },
    }),
  ]);

  return {
    posts: { published, scheduled, drafts },
    testimonials,
    courses,
    recent: recent.map((post) => ({ ...post, status: getPostStatus(post, now) })),
  };
}
