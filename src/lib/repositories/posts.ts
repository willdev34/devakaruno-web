/**
 * Caminho: src/lib/repositories/posts.ts
 * Arquivo: posts.ts
 * Descrição: Leitura de artigos do blog no banco. Só devolve posts publicados e com data de publicação já alcançada (base para agendamento futuro).
 */
import { prisma } from "@/lib/prisma";
import type { Blog } from "@/types/blog";

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
};

// Converte a linha do banco no formato usado pelos cards do blog
function toBlog(post: PostRow): Blog {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    date: post.publishedAt.toISOString(),
    author: POST_AUTHOR,
  };
}

// Todos os artigos visíveis, do mais recente para o mais antigo (página Blog)
export async function getPublishedPosts(limit?: number): Promise<Blog[]> {
  const posts = await prisma.post.findMany({
    where: visiblePosts(),
    orderBy: { publishedAt: "desc" },
    ...(limit ? { take: limit } : {}),
  });
  return posts.map(toBlog);
}

// Um artigo completo pelo slug (null se não existir ou não estiver no ar)
export async function getPostBySlug(slug: string) {
  const post = await prisma.post.findFirst({ where: { slug, ...visiblePosts() } });
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
  };
}

// Outros artigos para o fim de um post: os mais recentes, exceto o atual
export async function getRelatedPosts(slug: string, limit = 2): Promise<Blog[]> {
  const posts = await prisma.post.findMany({
    where: { ...visiblePosts(), slug: { not: slug } },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return posts.map(toBlog);
}
