/**
 * Caminho: src/lib/categories/save-category.ts
 * Arquivo: save-category.ts
 * Descrição: Caso de uso de salvar uma categoria: valida, impede slug repetido na criação e cria ou atualiza. Sem Next nem sessão, para ser testável.
 */
import { categoryInputSchema } from "@/lib/categories/schema";
import { createCategory, isCategorySlugTaken, updateCategory } from "@/lib/repositories/admin-categories";

export type SaveCategoryResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors: Record<string, string> };

const fail = (fieldErrors: Record<string, string>): SaveCategoryResult => ({
  ok: false,
  error: "Revise os campos destacados.",
  fieldErrors,
});

export async function saveCategory(id: string | null, raw: unknown): Promise<SaveCategoryResult> {
  const parsed = categoryInputSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return fail(fieldErrors);
  }

  const { slug, name, description } = parsed.data;
  const fields = { name, description: description || null };

  // Edição não troca o slug: o endereço da categoria continua o mesmo
  if (id) {
    const category = await updateCategory(id, fields);
    return { ok: true, id: category.id };
  }

  if (await isCategorySlugTaken(slug)) return fail({ slug: "Já existe uma categoria com esse slug" });
  const category = await createCategory({ ...fields, slug });
  return { ok: true, id: category.id };
}
