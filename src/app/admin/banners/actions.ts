/**
 * Caminho: src/app/admin/banners/actions.ts
 * Arquivo: actions.ts
 * Descrição: Server Actions dos banners do admin: salvar, excluir e mover na fila. Conferem o admin e atualizam o blog e a listagem do painel.
 */
"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-session";
import { saveAd, type SaveAdResult } from "@/lib/ads/save-ad";
import type { MoveDirection } from "@/lib/ordering";
import { deleteAd, moveAd } from "@/lib/repositories/admin-ads";

// Listagem e artigos do blog (onde os banners aparecem) e a listagem do painel
function revalidateAds() {
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/admin/banners");
}

export async function saveAdAction(id: string | null, raw: unknown): Promise<SaveAdResult> {
  await requireAdmin();
  const result = await saveAd(id, raw);
  if (result.ok) revalidateAds();
  return result;
}

export async function deleteAdAction(id: string): Promise<{ ok: boolean }> {
  await requireAdmin();
  await deleteAd(id);
  revalidateAds();
  return { ok: true };
}

export async function moveAdAction(id: string, direction: MoveDirection): Promise<{ ok: boolean }> {
  await requireAdmin();
  const moved = await moveAd(id, direction);
  if (moved) revalidateAds();
  return { ok: moved };
}
