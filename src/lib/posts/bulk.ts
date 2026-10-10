/**
 * Caminho: src/lib/posts/bulk.ts
 * Arquivo: bulk.ts
 * Descrição: Caso de uso das ações em lote da lista de artigos (excluir, publicar agora, voltar para rascunho): valida a lista de ids e escolhe a operação.
 */
import { z } from "zod";
import { deleteAdminPosts, publishAdminPosts, unpublishAdminPosts } from "@/lib/repositories/admin-posts";

export const BULK_ACTIONS = ["delete", "publish", "unpublish"] as const;
export type BulkAction = (typeof BULK_ACTIONS)[number];

// Limite para uma ação não varrer o banco inteiro por engano
export const MAX_BULK = 100;

const bulkSchema = z.object({
  action: z.enum(BULK_ACTIONS),
  ids: z.array(z.string().min(1)).min(1, "Selecione ao menos um artigo").max(MAX_BULK, `No máximo ${MAX_BULK} artigos por vez`),
});

export type BulkResult = { ok: true; count: number } | { ok: false; error: string };

// Uma operação por ação, em vez de if em cascata
const OPERATIONS: Record<BulkAction, (ids: string[]) => Promise<{ count: number }>> = {
  delete: deleteAdminPosts,
  publish: (ids) => publishAdminPosts(ids),
  unpublish: unpublishAdminPosts,
};

export async function runBulkAction(raw: unknown): Promise<BulkResult> {
  const parsed = bulkSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Ação inválida." };

  const { action, ids } = parsed.data;
  const { count } = await OPERATIONS[action](Array.from(new Set(ids)));
  return { ok: true, count };
}
