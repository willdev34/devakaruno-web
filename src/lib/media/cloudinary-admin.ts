/**
 * Caminho: src/lib/media/cloudinary-admin.ts
 * Arquivo: cloudinary-admin.ts
 * Descrição: Leitura e exclusão de imagens no Cloudinary para a biblioteca do admin (Admin API para listar, destroy assinado para excluir). Só roda no servidor.
 */
import { UploadError, DEFAULT_FOLDER, signParams } from "@/lib/cloudinary-upload";

export type MediaItem = {
  publicId: string;
  url: string;
  // Pasta onde a imagem está ("" na raiz)
  folder: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
  createdAt: string;
  // true quando está dentro da pasta do site (devakaruno-web/...), a única que o painel pode excluir
  managed: boolean;
};

export type MediaPage = { items: MediaItem[]; nextCursor: string | null };

export const MEDIA_PAGE_SIZE = 24;

type RawResource = {
  public_id: string;
  asset_folder?: string;
  secure_url: string;
  width?: number;
  height?: number;
  bytes?: number;
  format?: string;
  created_at?: string;
};

function credentials() {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) throw new UploadError("Cloudinary não configurado no servidor.", 503);
  return { cloud, key, secret };
}

const baseFolder = () => process.env.CLOUDINARY_FOLDER || DEFAULT_FOLDER;

// Pasta da imagem: asset_folder (pastas dinâmicas) ou o caminho dentro do public_id (pastas fixas)
function folderOf(raw: RawResource): string {
  if (raw.asset_folder !== undefined) return raw.asset_folder;
  const slash = raw.public_id.lastIndexOf("/");
  return slash === -1 ? "" : raw.public_id.slice(0, slash);
}

export function toMediaItem(raw: RawResource, base = baseFolder()): MediaItem {
  const folder = folderOf(raw);
  return {
    publicId: raw.public_id,
    url: raw.secure_url,
    folder,
    width: raw.width ?? 0,
    height: raw.height ?? 0,
    bytes: raw.bytes ?? 0,
    format: raw.format ?? "",
    createdAt: raw.created_at ?? "",
    managed: folder === base || folder.startsWith(`${base}/`),
  };
}

// Imagens da conta, da mais nova para a mais antiga, em páginas
export async function listMedia(cursor?: string): Promise<MediaPage> {
  const { cloud, key, secret } = credentials();
  const params = new URLSearchParams({ max_results: String(MEDIA_PAGE_SIZE), direction: "desc" });
  if (cursor) params.set("next_cursor", cursor);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/resources/image/upload?${params}`, {
    headers: { Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}` },
    cache: "no-store",
  });
  if (!response.ok) throw new UploadError("Não foi possível listar as imagens.", 502);

  const data = (await response.json()) as { resources?: RawResource[]; next_cursor?: string };
  return { items: (data.resources ?? []).map((raw) => toMediaItem(raw)), nextCursor: data.next_cursor ?? null };
}

// Uma imagem pelo public_id (null se não existir)
export async function getMedia(publicId: string): Promise<MediaItem | null> {
  const { cloud, key, secret } = credentials();
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud}/resources/image/upload/${publicId.split("/").map(encodeURIComponent).join("/")}`,
    { headers: { Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}` }, cache: "no-store" },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new UploadError("Não foi possível consultar a imagem.", 502);
  return toMediaItem((await response.json()) as RawResource);
}

// Exclui a imagem e limpa o cache da CDN
export async function deleteMedia(publicId: string): Promise<void> {
  const { cloud, key, secret } = credentials();
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signed = { invalidate: "true", public_id: publicId, timestamp };

  const body = new FormData();
  Object.entries(signed).forEach(([name, value]) => body.set(name, value));
  body.set("api_key", key);
  body.set("signature", signParams(signed, secret));

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/destroy`, { method: "POST", body });
  if (!response.ok) throw new UploadError("Não foi possível excluir a imagem.", 502);
  const result = (await response.json()) as { result?: string };
  if (result.result !== "ok" && result.result !== "not found") throw new UploadError("O Cloudinary não confirmou a exclusão.", 502);
}
