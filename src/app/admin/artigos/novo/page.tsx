/**
 * Caminho: src/app/admin/artigos/novo/page.tsx
 * Arquivo: page.tsx
 * Descrição: Tela de novo artigo do admin.
 */
import Link from "next/link";
import PostForm from "@/components/Admin/Posts/PostForm";

export default function NewPostPage() {
  return (
    <>
      <Link href="/admin/artigos" className="text-sm text-muted hover:text-primary">← Artigos</Link>
      <h1 className="mb-6 mt-1 font-heading text-3xl font-bold">Novo artigo</h1>
      <PostForm
        postId={null}
        initial={{ title: "", subtitle: "", slug: "", excerpt: "", content: "", coverImage: "", tags: [], featured: false, mode: "now" }}
      />
    </>
  );
}
