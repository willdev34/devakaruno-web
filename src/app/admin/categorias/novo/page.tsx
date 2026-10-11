/**
 * Caminho: src/app/admin/categorias/novo/page.tsx
 * Arquivo: page.tsx
 * Descrição: Tela de nova categoria do blog no admin.
 */
import Link from "next/link";
import CategoryForm from "@/components/Admin/Categories/CategoryForm";

export default function NewCategoryPage() {
  return (
    <>
      <Link href="/admin/categorias" className="text-sm text-muted hover:text-primary">← Categorias</Link>
      <h1 className="mb-6 mt-1 font-heading text-3xl font-bold">Nova categoria</h1>
      <CategoryForm categoryId={null} initial={{ name: "", slug: "", description: "" }} />
    </>
  );
}
