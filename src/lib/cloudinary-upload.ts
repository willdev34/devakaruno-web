/**
 * Caminho: src/lib/cloudinary-upload.ts
 * Arquivo: cloudinary-upload.ts
 * Descrição: Upload assinado de imagens para o Cloudinary (servidor). Valida tipo e tamanho antes de enviar.
 */
import { createHash } from "node:crypto";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
// Pasta base no Cloudinary (CLOUDINARY_FOLDER) e subpasta do artigo: devakaruno-web/blog
export const DEFAULT_FOLDER = "devakaruno-web";
export const uploadFolder = (sub = "blog") => `${process.env.CLOUDINARY_FOLDER || DEFAULT_FOLDER}/${sub}`;

export const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

export class UploadError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

// Assinatura exigida pelo Cloudinary: sha1 dos parâmetros ordenados + segredo
export function signParams(params: Record<string, string>, secret: string): string {
  const base = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1").update(base + secret).digest("hex");
}

// Envia a imagem e devolve a URL segura
export async function uploadImage(file: File, folder = uploadFolder()): Promise<string> {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) throw new UploadError("Upload não configurado no servidor.", 503);
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) throw new UploadError("Use imagens PNG, JPG ou WebP.", 400);
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError("A imagem passa de 10MB.", 400);

  const timestamp = String(Math.floor(Date.now() / 1000));
  const body = new FormData();
  body.set("file", file);
  body.set("api_key", key);
  body.set("timestamp", timestamp);
  body.set("folder", folder);
  body.set("signature", signParams({ folder, timestamp }, secret));

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: "POST", body });
  if (!response.ok) throw new UploadError("Não foi possível enviar a imagem.", 502);

  const result = (await response.json()) as { secure_url?: string };
  if (!result.secure_url) throw new UploadError("Resposta inesperada do Cloudinary.", 502);
  return result.secure_url;
}
