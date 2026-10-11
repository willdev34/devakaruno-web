/**
 * Caminho: src/app/admin/imagens/page.tsx
 * Arquivo: page.tsx
 * Descrição: Biblioteca de imagens do admin: envio em lote, grade com as imagens do Cloudinary (mais novas primeiro), onde cada uma está em uso e paginação.
 */
import Link from "next/link";
import { UploadError } from "@/lib/cloudinary-upload";
import { listMedia, type MediaPage } from "@/lib/media/cloudinary-admin";
import { findUsages } from "@/lib/media/usage";
import { listImageSources } from "@/lib/repositories/admin-media";
import MediaUploader from "@/components/Admin/Media/MediaUploader";
import MediaCard from "@/components/Admin/Media/MediaCard";
import { btnGhost } from "@/components/Admin/styles";

// Mensagem amigável para cada tipo de falha ao falar com o Cloudinary
function loadError(error: unknown): string {
  if (error instanceof UploadError && error.status === 503) {
    return "O Cloudinary ainda não está configurado neste ambiente (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET).";
  }
  return "Não foi possível carregar as imagens agora. Tente novamente em instantes.";
}

export default async function AdminMediaPage({ searchParams }: { searchParams: Promise<{ cursor?: string }> }) {
  const { cursor } = await searchParams;

  let page: MediaPage | null = null;
  let error = "";
  try {
    page = await listMedia(cursor);
  } catch (err) {
    error = loadError(err);
  }

  const sources = page ? await listImageSources() : [];

  return (
    <>
      <div>
        <h1 className="font-heading text-3xl font-bold">Imagens</h1>
        <p className="mt-1 text-sm text-muted">
          Biblioteca do Cloudinary. Só é possível excluir imagens das pastas do site que não estejam em uso.
        </p>
      </div>

      <div className="mt-6">
        <MediaUploader />
      </div>

      {error && <p role="alert" className="mt-6 rounded-lg bg-error/10 px-4 py-3 text-sm text-error">{error}</p>}

      {page && page.items.length === 0 && (
        <p className="mt-6 rounded-xl border border-black/5 bg-white px-6 py-10 text-center text-sm text-muted shadow-sm">
          {cursor ? "Não há mais imagens." : "Nenhuma imagem enviada ainda."}
        </p>
      )}

      {page && page.items.length > 0 && (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {page.items.map((item) => (
            <MediaCard key={item.publicId} item={{ ...item, usages: findUsages(item.publicId, sources) }} />
          ))}
        </ul>
      )}

      {page && (cursor || page.nextCursor) && (
        <div className="mt-6 flex justify-between">
          {cursor ? <Link href="/admin/imagens" className={btnGhost}>Voltar ao início</Link> : <span />}
          {page.nextCursor && (
            <Link href={`/admin/imagens?cursor=${encodeURIComponent(page.nextCursor)}`} className={btnGhost}>Próximas imagens</Link>
          )}
        </div>
      )}
    </>
  );
}
