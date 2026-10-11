/**
 * Caminho: src/lib/media/delete-media.ts
 * Arquivo: delete-media.ts
 * Descrição: Caso de uso de exclusão de imagem: só exclui o que está na pasta do site e não está em uso. Retorna a razão da recusa em português.
 */
import { deleteMedia, getMedia } from "./cloudinary-admin";
import { findUsages, type ImageSource } from "./usage";

export type DeleteMediaResult = { ok: true } | { ok: false; error: string };

type Deps = {
  get: typeof getMedia;
  remove: typeof deleteMedia;
  sources: () => Promise<ImageSource[]>;
};

export async function deleteMediaIfFree(publicId: string, deps: Deps): Promise<DeleteMediaResult> {
  const item = await deps.get(publicId);
  if (!item) return { ok: true };
  if (!item.managed) return { ok: false, error: "Esta imagem está fora das pastas do site. Exclua direto no Cloudinary." };

  const usages = findUsages(publicId, await deps.sources());
  if (usages.length > 0) {
    return { ok: false, error: `Imagem em uso em: ${usages.map((u) => `${u.kind} "${u.title}"`).join(", ")}.` };
  }

  await deps.remove(publicId);
  return { ok: true };
}
