/**
 * Caminho: src/app/admin/depoimentos/[id]/page.tsx
 * Arquivo: page.tsx
 * Descrição: Tela de edição de um depoimento, com botão de excluir.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import TestimonialForm from "@/components/Admin/Testimonials/TestimonialForm";
import DeleteButton from "@/components/Admin/Posts/DeleteButton";
import { getTestimonial } from "@/lib/repositories/admin-testimonials";
import { deleteTestimonialAction } from "../actions";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getTestimonial(id);
  if (!item) notFound();

  return (
    <>
      <Link href="/admin/depoimentos" className="text-sm text-muted hover:text-primary">← Depoimentos</Link>
      <div className="mb-6 mt-1 flex items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-bold">Editar depoimento</h1>
        <DeleteButton id={item.id} name={item.clientName} action={deleteTestimonialAction} redirectTo="/admin/depoimentos" />
      </div>
      <TestimonialForm
        testimonialId={item.id}
        initial={{ clientName: item.clientName, review: item.review, featured: item.featured }}
      />
    </>
  );
}
