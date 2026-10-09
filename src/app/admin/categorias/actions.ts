/**
 * Caminho: src/app/admin/categorias/actions.ts
 * Arquivo: actions.ts
 * Descrição: Server Actions das categorias do admin: salvar e excluir. Conferem o admin e atualizam o blog e as listagens do painel.
 */
"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-session";
import { saveCategory, type SaveCategoryResult } from "@/lib/categories/save-category";
import { deleteCategory } from "@/lib/repositories/admin-categories";

// Blog público (cards mostram a categoria), listagem de categorias e de artigos do admin
function revalidateCategories() {
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/admin/categorias");
  revalidatePath("/admin/artigos");
}

export async function saveCategoryAction(id: string | null, raw: unknown): Promise<SaveCategoryResult> {
  await requireAdmin();
  const result = await saveCategory(id, raw);
  if (result.ok) revalidateCategories();
  return result;
}

export async function deleteCategoryAction(id: string): Promise<{ ok: boolean }> {
  await requireAdmin();
  await deleteCategory(id);
  revalidateCategories();
  return { ok: true };
}
