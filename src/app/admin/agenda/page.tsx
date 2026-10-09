/**
 * Caminho: src/app/admin/agenda/page.tsx
 * Arquivo: page.tsx
 * Descrição: Listagem da agenda do admin: cidade, período, local, situação (acontecendo, próxima, encerrada ou oculta) e ações.
 */
import Link from "next/link";
import { listAdminAgenda } from "@/lib/repositories/admin-agenda";
import { cityLabel, formatDateRange, getAgendaStatus, type AgendaStatus } from "@/lib/agenda/utils";
import DeleteButton from "@/components/Admin/Posts/DeleteButton";
import { btnPrimary } from "@/components/Admin/styles";
import { deleteAgendaAction } from "./actions";

const STATUS: Record<AgendaStatus | "hidden", { label: string; style: string }> = {
  ongoing: { label: "Acontecendo", style: "bg-secondary/15 text-secondary" },
  upcoming: { label: "Próxima", style: "bg-primary/10 text-primary" },
  past: { label: "Encerrada", style: "bg-black/5 text-muted" },
  hidden: { label: "Oculta", style: "bg-warning/15 text-warning" },
};

export default async function AdminAgendaPage() {
  const events = await listAdminAgenda();

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">Agenda</h1>
          <p className="mt-1 text-sm text-muted">{events.length} atendimento(s) em outras cidades</p>
        </div>
        <Link href="/admin/agenda/novo" className={btnPrimary}>+ Nova agenda</Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-black/5 bg-white shadow-sm">
        {events.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-muted">Nenhuma agenda cadastrada ainda.</p>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-black/5 text-[11px] uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-3">Cidade</th>
                <th className="px-3 py-3">Período</th>
                <th className="px-3 py-3">Local</th>
                <th className="px-3 py-3">Situação</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {events.map((event) => {
                const status = STATUS[event.published ? getAgendaStatus(event) : "hidden"];
                return (
                  <tr key={event.id}>
                    <td className="px-5 py-4 font-medium">{cityLabel(event)}</td>
                    <td className="px-3 py-4">{formatDateRange(event.startDate, event.endDate)}</td>
                    <td className="px-3 py-4 text-muted">{event.venue}</td>
                    <td className="px-3 py-4">
                      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${status.style}`}>{status.label}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-4">
                        <Link href={`/admin/agenda/${event.id}`} className="text-sm font-medium text-primary hover:underline">Editar</Link>
                        <DeleteButton id={event.id} name={`${event.city}`} action={deleteAgendaAction} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
