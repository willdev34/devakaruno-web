/**
 * Caminho: src/app/admin/imagens/actions.ts
 * Arquivo: actions.ts
 * Descrição: Server Action da biblioteca de imagens: excluir uma imagem, depois de conferir o admin, a pasta e se ela não está em uso.
 */
"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-session";
import { deleteMedia, getMedia } from "@/lib/media/cloudinary-admin";
import { deleteMediaIfFree, type DeleteMediaResult } from "@/lib/media/delete-media";
import { listImageSources } from "@/lib/repositories/admin-media";

export async function deleteMediaAction(publicId: string): Promise<DeleteMediaResult> {
  await requireAdmin();
  try {
    const result = await deleteMediaIfFree(publicId, { get: getMedia, remove: deleteMedia, sources: listImageSources });
    if (result.ok) revalidatePath("/admin/imagens");
    return result;
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Não foi possível excluir a imagem." };
  }
}
