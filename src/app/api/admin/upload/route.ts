/**
 * Caminho: src/app/api/admin/upload/route.ts
 * Arquivo: route.ts
 * Descrição: Recebe uma imagem do editor do admin e envia ao Cloudinary. Só o admin acessa.
 */
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-session";
import { UploadError, uploadFolder, uploadImage } from "@/lib/cloudinary-upload";

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Envie uma imagem." }, { status: 400 });
  }

  // Subpasta no Cloudinary: "cursos", "banners" e "biblioteca" são aceitas além do padrão "blog"
  const requested = form.get("folder");
  const sub = requested === "cursos" || requested === "banners" || requested === "biblioteca" ? requested : "blog";

  try {
    const url = await uploadImage(file, uploadFolder(sub));
    return NextResponse.json({ url });
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Erro ao enviar a imagem." }, { status: 500 });
  }
}
