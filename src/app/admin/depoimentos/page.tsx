/**
 * Caminho: src/app/admin/depoimentos/page.tsx
 * Arquivo: page.tsx
 * Descrição: Listagem de depoimentos do admin, na ordem do site: posição, cliente, trecho, onde aparece (Home ou Quem é o Karuno) e ações.
 */
import Link from "next/link";
import { listAdminTestimonials } from "@/lib/repositories/admin-testimonials";
import DeleteButton from "@/components/Admin/Posts/DeleteButton";
import MoveButtons from "@/components/Admin/MoveButtons";
import { btnPrimary } from "@/components/Admin/styles";
import { deleteTestimonialAction, moveTestimonialAction } from "./actions";

// Trecho curto do texto para a tabela
const excerpt = (text: string, max = 90) => (text.length > max ? `${text.slice(0, max).trimEnd()}...` : text);

export default async function AdminTestimonialsPage() {
  const items = await listAdminTestimonials();

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">Depoimentos</h1>
          <p className="mt-1 text-sm text-muted">{items.length} depoimento(s). Use as setas para mudar a ordem no site.</p>
        </div>
        <Link href="/admin/depoimentos/novo" className={btnPrimary}>+ Novo depoimento</Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-black/5 bg-white shadow-sm">
        {items.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-muted">Nenhum depoimento cadastrado ainda.</p>
        ) : (
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-black/5 text-[11px] uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-3">Ordem</th>
                <th className="px-3 py-3">Cliente</th>
                <th className="px-3 py-3">Depoimento</th>
                <th className="px-3 py-3">Aparece em</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td className="px-5 py-4">
                    <MoveButtons
                      id={item.id}
                      name={item.clientName}
                      isFirst={index === 0}
                      isLast={index === items.length - 1}
                      action={moveTestimonialAction}
                    />
                  </td>
                  <td className="px-3 py-4 font-medium">{item.clientName}</td>
                  <td className="px-3 py-4 text-muted">{excerpt(item.review)}</td>
                  <td className="px-3 py-4">
                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${item.featured ? "bg-primary/10 text-primary" : "bg-black/5 text-muted"}`}>
                      {item.featured ? "Home" : "Quem é o Karuno"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-4">
                      <Link href={`/admin/depoimentos/${item.id}`} className="text-sm font-medium text-primary hover:underline">Editar</Link>
                      <DeleteButton id={item.id} name={item.clientName} action={deleteTestimonialAction} />
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
