/**
 * Caminho: src/app/admin/depoimentos/novo/page.tsx
 * Arquivo: page.tsx
 * Descrição: Tela de novo depoimento do admin.
 */
import Link from "next/link";
import TestimonialForm from "@/components/Admin/Testimonials/TestimonialForm";

export default function NewTestimonialPage() {
  return (
    <>
      <Link href="/admin/depoimentos" className="text-sm text-muted hover:text-primary">← Depoimentos</Link>
      <h1 className="mb-6 mt-1 font-heading text-3xl font-bold">Novo depoimento</h1>
      <TestimonialForm testimonialId={null} initial={{ clientName: "", review: "", featured: false }} />
    </>
  );
}
