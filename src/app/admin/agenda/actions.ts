/**
 * Caminho: src/app/admin/agenda/actions.ts
 * Arquivo: actions.ts
 * Descrição: Server Actions da agenda do admin: salvar e excluir. Conferem o admin e atualizam a página pública /agenda.
 */
"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-session";
import { saveAgenda, type SaveAgendaResult } from "@/lib/agenda/save-agenda";
import { deleteAgendaEvent } from "@/lib/repositories/admin-agenda";

export async function saveAgendaAction(id: string | null, raw: unknown): Promise<SaveAgendaResult> {
  await requireAdmin();
  const result = await saveAgenda(id, raw);
  if (result.ok) revalidatePath("/agenda");
  return result;
}

export async function deleteAgendaAction(id: string): Promise<{ ok: boolean }> {
  await requireAdmin();
  await deleteAgendaEvent(id);
  revalidatePath("/agenda");
  revalidatePath("/admin/agenda");
  return { ok: true };
}
