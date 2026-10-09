/**
 * Caminho: src/lib/repositories/admin-categories.ts
 * Arquivo: admin-categories.ts
 * Descrição: Acesso do painel admin às categorias do blog: listagem com total de artigos, leitura, checagem de slug e de existência, criação, edição e exclusão.
 */
import { prisma } from "@/lib/prisma";

export type CategoryFields = {
  name: string;
  description: string | null;
};

// Ordem alfabética, com o total de artigos de cada categoria
export function listAdminCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });
}

// Só id e nome, para o seletor do editor de artigos
export function listCategoryOptions() {
  return prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });
}

export function getCategory(id: string) {
  return prisma.category.findUnique({ where: { id } });
}

// A categoria existe? (valida o id vindo do formulário de artigo)
export async function categoryExists(id: string): Promise<boolean> {
  const found = await prisma.category.findUnique({ where: { id }, select: { id: true } });
  return found !== null;
}

// Slug já usado por outra categoria? (excludeId ignora a própria na edição)
export async function isCategorySlugTaken(slug: string, excludeId?: string | null) {
  const found = await prisma.category.findUnique({ where: { slug }, select: { id: true } });
  return Boolean(found && found.id !== excludeId);
}

export function createCategory(data: CategoryFields & { slug: string }) {
  return prisma.category.create({ data });
}

// O slug não muda depois de criado
export function updateCategory(id: string, data: CategoryFields) {
  return prisma.category.update({ where: { id }, data });
}

// Os artigos da categoria ficam sem categoria (regra do banco, SetNull)
export function deleteCategory(id: string) {
  return prisma.category.delete({ where: { id } });
}
