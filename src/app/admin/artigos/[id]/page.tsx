/**
 * Caminho: src/app/admin/artigos/[id]/page.tsx
 * Arquivo: page.tsx
 * Descrição: Tela de edição de artigo do admin, com botão de excluir.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import PostForm from "@/components/Admin/Posts/PostForm";
import DeleteButton from "@/components/Admin/Posts/DeleteButton";
import { getAdminPost } from "@/lib/repositories/admin-posts";
import { listCategoryOptions } from "@/lib/repositories/admin-categories";
import { modeFromPost } from "@/lib/posts/utils";
import { deletePostAction } from "../actions";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, categories] = await Promise.all([getAdminPost(id), listCategoryOptions()]);
  if (!post) notFound();

  const mode = modeFromPost(post);

  return (
    <>
      <Link href="/admin/artigos" className="text-sm text-muted hover:text-primary">← Artigos</Link>
      <div className="mb-6 mt-1 flex items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-bold">Editar artigo</h1>
        <DeleteButton id={post.id} name={post.title} action={deletePostAction} redirectTo="/admin/artigos" />
      </div>
      <PostForm
        postId={post.id}
        categories={categories}
        initial={{
          title: post.title,
          subtitle: post.subtitle ?? "",
          slug: post.slug,
          excerpt: post.excerpt,
          seoTitle: post.seoTitle ?? "",
          seoDescription: post.seoDescription ?? "",
          content: post.content,
          coverImage: post.coverImage,
          tags: post.tags,
          categoryId: post.categoryId ?? "",
          featured: post.featured,
          mode,
          scheduledAt: mode === "schedule" ? post.publishedAt.toISOString() : undefined,
        }}
      />
    </>
  );
}
