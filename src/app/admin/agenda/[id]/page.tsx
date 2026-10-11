/**
 * Caminho: src/app/admin/agenda/[id]/page.tsx
 * Arquivo: page.tsx
 * Descrição: Tela de edição de um atendimento da agenda, com botão de excluir.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import AgendaForm from "@/components/Admin/Agenda/AgendaForm";
import DeleteButton from "@/components/Admin/Posts/DeleteButton";
import { getAgendaEvent } from "@/lib/repositories/admin-agenda";
import { deleteAgendaAction } from "../actions";

// Date do banco (meia-noite UTC) -> "YYYY-MM-DD" do campo de data
const toDay = (date: Date) => date.toISOString().slice(0, 10);

export default async function EditAgendaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getAgendaEvent(id);
  if (!event) notFound();

  return (
    <>
      <Link href="/admin/agenda" className="text-sm text-muted hover:text-primary">← Agenda</Link>
      <div className="mb-6 mt-1 flex items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-bold">Editar agenda</h1>
        <DeleteButton id={event.id} name={event.city} action={deleteAgendaAction} redirectTo="/admin/agenda" />
      </div>
      <AgendaForm
        eventId={event.id}
        initial={{
          city: event.city,
          state: event.state ?? "",
          venue: event.venue,
          address: event.address ?? "",
          startDate: toDay(event.startDate),
          endDate: toDay(event.endDate),
          description: event.description ?? "",
          published: event.published,
        }}
      />
    </>
  );
}
