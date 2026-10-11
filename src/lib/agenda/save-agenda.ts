/**
 * Caminho: src/lib/agenda/save-agenda.ts
 * Arquivo: save-agenda.ts
 * Descrição: Caso de uso de salvar um atendimento da agenda: valida e cria ou atualiza. Sem Next nem sessão, para ser testável.
 */
import { agendaInputSchema } from "@/lib/agenda/schema";
import { createAgendaEvent, updateAgendaEvent, type AgendaWriteData } from "@/lib/repositories/admin-agenda";

export type SaveAgendaResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors: Record<string, string> };

export async function saveAgenda(id: string | null, raw: unknown): Promise<SaveAgendaResult> {
  const parsed = agendaInputSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Revise os campos destacados.", fieldErrors };
  }

  const input = parsed.data;
  const data: AgendaWriteData = {
    city: input.city,
    state: input.state || null,
    venue: input.venue,
    address: input.address || null,
    startDate: new Date(`${input.startDate}T00:00:00.000Z`),
    endDate: new Date(`${input.endDate}T00:00:00.000Z`),
    description: input.description || null,
    published: input.published,
  };

  const event = id ? await updateAgendaEvent(id, data) : await createAgendaEvent(data);
  return { ok: true, id: event.id };
}
