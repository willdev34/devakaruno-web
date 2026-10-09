/**
 * Caminho: src/app/admin/servicos/page.tsx
 * Arquivo: page.tsx
 * Descrição: Listagem de serviços da Home no admin, na ordem do site: posição, título, texto e ações.
 */
import Link from "next/link";
import { listAdminServices } from "@/lib/repositories/admin-services";
import DeleteButton from "@/components/Admin/Posts/DeleteButton";
import MoveButtons from "@/components/Admin/MoveButtons";
import { btnPrimary } from "@/components/Admin/styles";
import { deleteServiceAction, moveServiceAction } from "./actions";

// Trecho curto do texto para a tabela
const excerpt = (text: string, max = 90) => (text.length > max ? `${text.slice(0, max).trimEnd()}...` : text);

export default async function AdminServicesPage() {
  const items = await listAdminServices();

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">Serviços</h1>
          <p className="mt-1 text-sm text-muted">{items.length} serviço(s) no bloco da Home. Use as setas para mudar a ordem.</p>
        </div>
        <Link href="/admin/servicos/novo" className={btnPrimary}>+ Novo serviço</Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-black/5 bg-white shadow-sm">
        {items.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-muted">Nenhum serviço cadastrado ainda.</p>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-black/5 text-[11px] uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-3">Ordem</th>
                <th className="px-3 py-3">Serviço</th>
                <th className="px-3 py-3">Texto</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td className="px-5 py-4">
                    <MoveButtons
                      id={item.id}
                      name={item.title}
                      isFirst={index === 0}
                      isLast={index === items.length - 1}
                      action={moveServiceAction}
                    />
                  </td>
                  <td className="px-3 py-4 font-medium">{item.title}</td>
                  <td className="px-3 py-4 text-muted">{excerpt(item.text)}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-4">
                      <Link href={`/admin/servicos/${item.id}`} className="text-sm font-medium text-primary hover:underline">Editar</Link>
                      <DeleteButton id={item.id} name={item.title} action={deleteServiceAction} />
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
