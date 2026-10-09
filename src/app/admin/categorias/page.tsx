/**
 * Caminho: src/app/admin/categorias/page.tsx
 * Arquivo: page.tsx
 * Descrição: Listagem de categorias do blog no admin: nome, slug, total de artigos e ações.
 */
import Link from "next/link";
import { listAdminCategories } from "@/lib/repositories/admin-categories";
import DeleteButton from "@/components/Admin/Posts/DeleteButton";
import { btnPrimary } from "@/components/Admin/styles";
import { deleteCategoryAction } from "./actions";

export default async function AdminCategoriesPage() {
  const categories = await listAdminCategories();

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">Categorias</h1>
          <p className="mt-1 text-sm text-muted">{categories.length} categoria(s) do blog. Cada artigo tem no máximo uma.</p>
        </div>
        <Link href="/admin/categorias/novo" className={btnPrimary}>+ Nova categoria</Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-black/5 bg-white shadow-sm">
        {categories.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-muted">Nenhuma categoria cadastrada ainda.</p>
        ) : (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-black/5 text-[11px] uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-3">Nome</th>
                <th className="px-3 py-3">Slug</th>
                <th className="px-3 py-3">Artigos</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-5 py-4 font-medium">{category.name}</td>
                  <td className="px-3 py-4 text-muted">{category.slug}</td>
                  <td className="px-3 py-4 text-muted">{category._count.posts}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-4">
                      <Link href={`/admin/categorias/${category.id}`} className="text-sm font-medium text-primary hover:underline">Editar</Link>
                      <DeleteButton id={category.id} name={category.name} action={deleteCategoryAction} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
