/**
 * Caminho: src/app/admin/artigos/actions.ts
 * Arquivo: actions.ts
 * Descrição: Server Actions dos artigos do admin: salvar (criar ou editar), excluir e ações em lote. Conferem o admin e atualizam as páginas públicas.
 */
"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-session";
import { runBulkAction, type BulkResult } from "@/lib/posts/bulk";
import { savePost, type SaveResult } from "@/lib/posts/save-post";
import { deleteAdminPost } from "@/lib/repositories/admin-posts";

// Atualiza Home e Blog para o artigo aparecer (ou sumir) sem esperar o cache
function refreshPublicPages() {
  revalidatePath("/");
  revalidatePath("/blog", "layout");
}

export async function savePostAction(id: string | null, raw: unknown): Promise<SaveResult> {
  const session = await requireAdmin();
  const result = await savePost(id, raw, {
    email: session.user!.email!,
    name: session.user?.name ?? "Deva Karuno",
  });
  if (result.ok) refreshPublicPages();
  return result;
}

export async function deletePostAction(id: string): Promise<{ ok: boolean }> {
  await requireAdmin();
  await deleteAdminPost(id);
  refreshPublicPages();
  revalidatePath("/admin/artigos");
  return { ok: true };
}

// Excluir, publicar agora ou voltar para rascunho vários artigos de uma vez
export async function bulkPostsAction(raw: unknown): Promise<BulkResult> {
  await requireAdmin();
  const result = await runBulkAction(raw);
  if (result.ok) {
    refreshPublicPages();
    revalidatePath("/admin/artigos");
  }
  return result;
}
