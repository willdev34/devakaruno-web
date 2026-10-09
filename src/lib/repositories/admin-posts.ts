/**
 * Caminho: src/lib/repositories/admin-posts.ts
 * Arquivo: admin-posts.ts
 * Descrição: Acesso do painel admin aos artigos: listagem com filtro de status e busca, leitura por id, criação, edição, exclusão e autor.
 */
import { prisma } from "@/lib/prisma";

export type PostStatusFilter = "all" | "published" | "scheduled" | "draft";

export type PostWriteData = {
  title: string;
  subtitle: string | null;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  publishedAt: Date;
};

// Condição do Prisma para cada aba de status da listagem
function statusWhere(status: PostStatusFilter, now: Date) {
  if (status === "draft") return { published: false };
  if (status === "scheduled") return { published: true, publishedAt: { gt: now } };
  if (status === "published") return { published: true, publishedAt: { lte: now } };
  return {};
}

export function listAdminPosts({ status = "all", q = "" }: { status?: PostStatusFilter; q?: string } = {}) {
  const term = q.trim();
  return prisma.post.findMany({
    where: {
      ...statusWhere(status, new Date()),
      ...(term ? { title: { contains: term, mode: "insensitive" as const } } : {}),
    },
    orderBy: { updatedAt: "desc" },
  });
}

export function getAdminPost(id: string) {
  return prisma.post.findUnique({ where: { id } });
}

// Slug já usado por outro artigo? (ignora o próprio ao editar)
export async function isSlugTaken(slug: string, exceptId?: string): Promise<boolean> {
  const found = await prisma.post.findUnique({ where: { slug }, select: { id: true } });
  return !!found && found.id !== exceptId;
}

export function createAdminPost(data: PostWriteData, authorId: string) {
  return prisma.post.create({ data: { ...data, authorId } });
}

export function updateAdminPost(id: string, data: PostWriteData) {
  return prisma.post.update({ where: { id }, data });
}

export function deleteAdminPost(id: string) {
  return prisma.post.delete({ where: { id } });
}

// Garante o usuário admin no banco (autor dos artigos)
export function ensureAuthor(email: string, name: string) {
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name, role: "ADMIN" },
  });
}
