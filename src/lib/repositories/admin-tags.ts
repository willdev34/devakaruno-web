/**
 * Caminho: src/lib/repositories/admin-tags.ts
 * Arquivo: admin-tags.ts
 * Descrição: Acesso do painel admin às tags dos artigos. As tags ficam dentro de cada post, então ler e gravar é sempre sobre os posts.
 */
import { prisma } from "@/lib/prisma";

export type PostTags = { id: string; tags: string[] };

// Id e tags de todos os artigos, inclusive rascunhos e agendados
export function listAllPostTags(): Promise<PostTags[]> {
  return prisma.post.findMany({ select: { id: true, tags: true } });
}

// Grava as novas tags de vários artigos de uma vez (tudo ou nada)
export async function updatePostsTags(updates: PostTags[]): Promise<void> {
  await prisma.$transaction(updates.map((u) => prisma.post.update({ where: { id: u.id }, data: { tags: u.tags } })));
}
