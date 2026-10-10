/**
 * Caminho: src/lib/repositories/posts.ts
 * Arquivo: posts.ts
 * Descrição: Leitura de artigos do blog no banco. Só devolve posts publicados e com data de publicação já alcançada (base para agendamento futuro).
 */
import { prisma } from "@/lib/prisma";
import type { Blog } from "@/types/blog";
import { rankRelated } from "@/lib/blog/related-score";

// Autor exibido nos artigos enquanto o admin não tem perfil de autor próprio
export const POST_AUTHOR = "Deva Karuno";

// Filtro único de visibilidade: publicado e já no ar (publishedAt <= agora)
function visiblePosts() {
  return { published: true, publishedAt: { lte: new Date() } };
}

type PostRow = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  publishedAt: Date;
  tags?: string[];
  category?: { name: string; slug: string } | null;
};

// Traz o nome e o slug da categoria junto com o artigo
const withCategory = { category: { select: { name: true, slug: true } } };

// Converte a linha do banco no formato usado pelos cards do blog
function toBlog(post: PostRow): Blog {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    date: post.publishedAt.toISOString(),
    author: POST_AUTHOR,
    tags: post.tags ?? [],
    ...(post.category ? { category: post.category.name, categorySlug: post.category.slug } : {}),
  };
}

// Artigos visíveis: destaques primeiro, depois do mais recente para o mais antigo (página Blog)
export async function getPublishedPosts(limit?: number): Promise<Blog[]> {
  const posts = await prisma.post.findMany({
    where: visiblePosts(),
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    include: withCategory,
    ...(limit ? { take: limit } : {}),
  });
  return posts.map(toBlog);
}

// Um artigo completo pelo slug (null se não existir ou não estiver no ar)
export async function getPostBySlug(slug: string) {
  const post = await prisma.post.findFirst({ where: { slug, ...visiblePosts() }, include: withCategory });
  if (!post) return null;
  // Campos obrigatórios (diferente do tipo Blog, usado só nos cards)
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    date: post.publishedAt.toISOString(),
    author: POST_AUTHOR,
    content: post.content,
    subtitle: post.subtitle,
    tags: post.tags,
    category: post.category,
    updatedAt: post.updatedAt.toISOString(),
  };
}

// Artigos no ar com a data da última alteração, para o sitemap
export function getSitemapPosts() {
  return prisma.post.findMany({ where: visiblePosts(), select: { slug: true, updatedAt: true }, orderBy: { publishedAt: "desc" } });
}

// Outros artigos para o fim de um post: mesma categoria e tags em comum primeiro,
// depois os mais recentes. O artigo atual nunca entra na lista.
export async function getRelatedPosts(slug: string, limit = 2): Promise<Blog[]> {
  const [current, others] = await Promise.all([
    prisma.post.findFirst({ where: { slug }, select: { tags: true, category: { select: { slug: true } } } }),
    prisma.post.findMany({
      where: { ...visiblePosts(), slug: { not: slug } },
      orderBy: { publishedAt: "desc" },
      include: withCategory,
    }),
  ]);
  const ranked = rankRelated(others.map(toBlog), {
    categorySlug: current?.category?.slug,
    tags: current?.tags ?? [],
  });
  return ranked.slice(0, limit);
}
