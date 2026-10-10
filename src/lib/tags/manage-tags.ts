/**
 * Caminho: src/lib/tags/manage-tags.ts
 * Arquivo: manage-tags.ts
 * Descrição: Casos de uso das tags do admin: renomear (ou mesclar, quando o nome já existe) e remover de todos os artigos. Sem Next nem sessão, para ser testável.
 */
import { listAllPostTags, updatePostsTags } from "@/lib/repositories/admin-tags";
import { tagNameSchema } from "@/lib/tags/schema";
import { removeTag, replaceTag, tagKey } from "@/lib/tags/tag-ops";

export type ManageTagResult = { ok: true; affected: number } | { ok: false; error: string };

// Aplica a mudança só nos artigos que usam a tag e grava de uma vez
async function applyToPosts(key: string, change: (tags: string[]) => string[]): Promise<ManageTagResult> {
  const posts = await listAllPostTags();
  const updates = posts
    .filter((post) => post.tags.some((tag) => tagKey(tag) === key))
    .map((post) => ({ id: post.id, tags: change(post.tags) }));

  if (updates.length === 0) return { ok: false, error: "Tag não encontrada." };
  await updatePostsTags(updates);
  return { ok: true, affected: updates.length };
}

// Se o novo nome já existe em outra tag, as duas viram uma só (mesclagem)
export async function renameTag(key: string, rawName: unknown): Promise<ManageTagResult> {
  const parsed = tagNameSchema.safeParse(rawName);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  return applyToPosts(key, (tags) => replaceTag(tags, key, parsed.data));
}

export function removeTagEverywhere(key: string): Promise<ManageTagResult> {
  return applyToPosts(key, (tags) => removeTag(tags, key));
}
