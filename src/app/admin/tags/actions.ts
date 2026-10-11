/**
 * Caminho: src/app/admin/tags/actions.ts
 * Arquivo: actions.ts
 * Descrição: Server Actions das tags do admin: renomear/mesclar e remover. Conferem o admin e atualizam o blog e as listagens do painel.
 */
"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-session";
import { removeTagEverywhere, renameTag, type ManageTagResult } from "@/lib/tags/manage-tags";

// Blog público (cards, filtros e artigos), listagem de tags e de artigos do admin
function revalidateTags() {
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/admin/tags");
  revalidatePath("/admin/artigos");
}

export async function renameTagAction(key: string, newName: string): Promise<ManageTagResult> {
  await requireAdmin();
  const result = await renameTag(key, newName);
  if (result.ok) revalidateTags();
  return result;
}

export async function removeTagAction(key: string): Promise<ManageTagResult> {
  await requireAdmin();
  const result = await removeTagEverywhere(key);
  if (result.ok) revalidateTags();
  return result;
}
