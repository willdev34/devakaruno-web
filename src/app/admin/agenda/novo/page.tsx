/**
 * Caminho: src/app/admin/agenda/novo/page.tsx
 * Arquivo: page.tsx
 * Descrição: Tela de nova agenda (atendimento em outra cidade) do admin.
 */
import Link from "next/link";
import AgendaForm from "@/components/Admin/Agenda/AgendaForm";

export default function NewAgendaPage() {
  return (
    <>
      <Link href="/admin/agenda" className="text-sm text-muted hover:text-primary">← Agenda</Link>
      <h1 className="mb-6 mt-1 font-heading text-3xl font-bold">Nova agenda</h1>
      <AgendaForm
        eventId={null}
        initial={{ city: "", state: "", venue: "", address: "", startDate: "", endDate: "", description: "", published: true }}
      />
    </>
  );
}
