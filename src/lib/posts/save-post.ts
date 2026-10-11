/**
 * Caminho: src/lib/posts/save-post.ts
 * Arquivo: save-post.ts
 * Descrição: Caso de uso de salvar artigo: valida, checa slug repetido e cria ou atualiza. Sem Next nem sessão, para ser testável.
 */
import { postInputSchema } from "@/lib/posts/schema";
import { resolvePublication } from "@/lib/posts/utils";
import { categoryExists } from "@/lib/repositories/admin-categories";
import {
  createAdminPost,
  ensureAuthor,
  isSlugTaken,
  updateAdminPost,
  type PostWriteData,
} from "@/lib/repositories/admin-posts";

export type SaveResult =
  | { ok: true; id: string; slug: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

type Author = { email: string; name: string };

export async function savePost(id: string | null, raw: unknown, author: Author): Promise<SaveResult> {
  const parsed = postInputSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Revise os campos destacados.", fieldErrors };
  }

  const input = parsed.data;
  if (await isSlugTaken(input.slug, id ?? undefined)) {
    return { ok: false, error: "Esse slug já está em uso.", fieldErrors: { slug: "Esse slug já está em uso" } };
  }

  // Categoria opcional: se veio um id, ele precisa existir
  const categoryId = input.categoryId || null;
  if (categoryId && !(await categoryExists(categoryId))) {
    return { ok: false, error: "Revise os campos destacados.", fieldErrors: { categoryId: "Categoria não encontrada" } };
  }

  const scheduledAt = input.scheduledAt ? new Date(input.scheduledAt) : undefined;
  const data: PostWriteData = {
    title: input.title,
    subtitle: input.subtitle || null,
    slug: input.slug,
    excerpt: input.excerpt,
    seoTitle: input.seoTitle || null,
    seoDescription: input.seoDescription || null,
    content: input.content,
    coverImage: input.coverImage,
    tags: input.tags,
    categoryId,
    featured: input.featured,
    ...resolvePublication(input.mode, scheduledAt),
  };

  if (id) {
    const post = await updateAdminPost(id, data);
    return { ok: true, id: post.id, slug: post.slug };
  }

  const user = await ensureAuthor(author.email, author.name);
  const post = await createAdminPost(data, user.id);
  return { ok: true, id: post.id, slug: post.slug };
}
