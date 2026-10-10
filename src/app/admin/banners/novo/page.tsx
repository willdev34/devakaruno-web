/**
 * Caminho: src/app/admin/banners/novo/page.tsx
 * Arquivo: page.tsx
 * Descrição: Tela de novo banner publicitário no admin.
 */
import Link from "next/link";
import AdForm from "@/components/Admin/Ads/AdForm";

export default function NewAdPage() {
  return (
    <>
      <Link href="/admin/banners" className="text-sm text-muted hover:text-primary">← Banners</Link>
      <h1 className="mb-6 mt-1 font-heading text-3xl font-bold">Novo banner</h1>
      <AdForm
        adId={null}
        initial={{ name: "", position: "BLOG_LIST", imageUrl: "", linkUrl: "", altText: "", active: true, startsAt: "", endsAt: "" }}
      />
    </>
  );
}
