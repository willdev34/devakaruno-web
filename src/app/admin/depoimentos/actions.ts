/**
 * Caminho: src/app/admin/depoimentos/actions.ts
 * Arquivo: actions.ts
 * Descrição: Server Actions dos depoimentos do admin: salvar, excluir e mover. Conferem o admin e atualizam as páginas públicas que exibem depoimentos.
 */
"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-session";
import { saveTestimonial, type SaveTestimonialResult } from "@/lib/testimonials/save-testimonial";
import { deleteTestimonial, moveTestimonial, type MoveDirection } from "@/lib/repositories/admin-testimonials";

// Home (carrossel de destaques) e Quem é o Karuno (demais depoimentos)
function revalidateTestimonials() {
  revalidatePath("/");
  revalidatePath("/quem-e-o-karuno");
  revalidatePath("/admin/depoimentos");
}

export async function saveTestimonialAction(id: string | null, raw: unknown): Promise<SaveTestimonialResult> {
  await requireAdmin();
  const result = await saveTestimonial(id, raw);
  if (result.ok) revalidateTestimonials();
  return result;
}

export async function deleteTestimonialAction(id: string): Promise<{ ok: boolean }> {
  await requireAdmin();
  await deleteTestimonial(id);
  revalidateTestimonials();
  return { ok: true };
}

export async function moveTestimonialAction(id: string, direction: MoveDirection): Promise<{ ok: boolean }> {
  await requireAdmin();
  const moved = await moveTestimonial(id, direction);
  if (moved) revalidateTestimonials();
  return { ok: moved };
}
