/**
 * Caminho: src/app/admin/banners/[id]/page.tsx
 * Arquivo: page.tsx
 * Descrição: Tela de edição de um banner publicitário, com botão de excluir.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import AdForm from "@/components/Admin/Ads/AdForm";
import DeleteButton from "@/components/Admin/Posts/DeleteButton";
import { getAd } from "@/lib/repositories/admin-ads";
import { toDateInput } from "@/lib/ads/dates";
import type { AdPosition } from "@/lib/ads/positions";
import { deleteAdAction } from "../actions";

export default async function EditAdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ad = await getAd(id);
  if (!ad) notFound();

  return (
    <>
      <Link href="/admin/banners" className="text-sm text-muted hover:text-primary">← Banners</Link>
      <div className="mb-6 mt-1 flex items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-bold">Editar banner</h1>
        <DeleteButton id={ad.id} name={ad.name} action={deleteAdAction} redirectTo="/admin/banners" />
      </div>
      <AdForm
        adId={ad.id}
        initial={{
          name: ad.name,
          position: ad.position as AdPosition,
          imageUrl: ad.imageUrl,
          linkUrl: ad.linkUrl,
          altText: ad.altText,
          active: ad.active,
          startsAt: toDateInput(ad.startsAt),
          endsAt: toDateInput(ad.endsAt),
        }}
      />
    </>
  );
}
