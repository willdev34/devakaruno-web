/**
 * Caminho: src/app/admin/servicos/actions.ts
 * Arquivo: actions.ts
 * Descrição: Server Actions dos serviços do admin: salvar, excluir e mover. Conferem o admin e atualizam a Home, onde os serviços aparecem.
 */
"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-session";
import type { MoveDirection } from "@/lib/ordering";
import { saveService, type SaveServiceResult } from "@/lib/services/save-service";
import { deleteService, moveService } from "@/lib/repositories/admin-services";

// Home (bloco "Como podemos trabalhar juntos") e a listagem do admin
function revalidateServices() {
  revalidatePath("/");
  revalidatePath("/admin/servicos");
}

export async function saveServiceAction(id: string | null, raw: unknown): Promise<SaveServiceResult> {
  await requireAdmin();
  const result = await saveService(id, raw);
  if (result.ok) revalidateServices();
  return result;
}

export async function deleteServiceAction(id: string): Promise<{ ok: boolean }> {
  await requireAdmin();
  await deleteService(id);
  revalidateServices();
  return { ok: true };
}

export async function moveServiceAction(id: string, direction: MoveDirection): Promise<{ ok: boolean }> {
  await requireAdmin();
  const moved = await moveService(id, direction);
  if (moved) revalidateServices();
  return { ok: moved };
}
