/**
 * Caminho: src/app/admin/cursos/actions.ts
 * Arquivo: actions.ts
 * Descrição: Server Actions dos cursos do admin: salvar e excluir. Conferem o admin e atualizam Home, listagem e páginas de curso.
 */
"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-session";
import { saveCourse, type SaveCourseResult } from "@/lib/courses/save-course";
import { deleteCourse } from "@/lib/repositories/admin-courses";

// Home (seção de cursos), listagem pública, todas as páginas de curso e a listagem do admin
function revalidateCourses() {
  revalidatePath("/");
  revalidatePath("/cursos-e-vivencias");
  revalidatePath("/cursos-e-vivencias/[slug]", "page");
  revalidatePath("/admin/cursos");
}

export async function saveCourseAction(id: string | null, raw: unknown): Promise<SaveCourseResult> {
  await requireAdmin();
  const result = await saveCourse(id, raw);
  if (result.ok) revalidateCourses();
  return result;
}

export async function deleteCourseAction(id: string): Promise<{ ok: boolean }> {
  await requireAdmin();
  await deleteCourse(id);
  revalidateCourses();
  return { ok: true };
}
