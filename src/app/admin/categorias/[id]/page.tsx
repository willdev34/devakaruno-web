/**
 * Caminho: src/app/admin/categorias/[id]/page.tsx
 * Arquivo: page.tsx
 * Descrição: Tela de edição de uma categoria do blog, com botão de excluir.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryForm from "@/components/Admin/Categories/CategoryForm";
import DeleteButton from "@/components/Admin/Posts/DeleteButton";
import { getCategory } from "@/lib/repositories/admin-categories";
import { deleteCategoryAction } from "../actions";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await getCategory(id);
  if (!category) notFound();

  return (
    <>
      <Link href="/admin/categorias" className="text-sm text-muted hover:text-primary">← Categorias</Link>
      <div className="mb-6 mt-1 flex items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-bold">Editar categoria</h1>
        <DeleteButton id={category.id} name={category.name} action={deleteCategoryAction} redirectTo="/admin/categorias" />
      </div>
      <CategoryForm
        categoryId={category.id}
        initial={{ name: category.name, slug: category.slug, description: category.description ?? "" }}
      />
    </>
  );
}
