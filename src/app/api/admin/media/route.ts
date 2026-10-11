/**
 * Caminho: src/app/api/admin/media/route.ts
 * Arquivo: route.ts
 * Descrição: Lista as imagens do Cloudinary (uma página por vez) para o seletor de imagens dos formulários do admin. Só o admin acessa.
 */
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-session";
import { UploadError } from "@/lib/cloudinary-upload";
import { listMedia } from "@/lib/media/cloudinary-admin";

export async function GET(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const cursor = new URL(request.url).searchParams.get("cursor") || undefined;
  try {
    return NextResponse.json(await listMedia(cursor));
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Erro ao listar as imagens." }, { status: 500 });
  }
}
