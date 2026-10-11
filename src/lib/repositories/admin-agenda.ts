/**
 * Caminho: src/lib/repositories/admin-agenda.ts
 * Arquivo: admin-agenda.ts
 * Descrição: Acesso do painel admin à agenda: listagem (mais recentes primeiro), leitura por id, criação, edição e exclusão.
 */
import { prisma } from "@/lib/prisma";

export type AgendaWriteData = {
  city: string;
  state: string | null;
  venue: string;
  address: string | null;
  startDate: Date;
  endDate: Date;
  description: string | null;
  published: boolean;
};

export function listAdminAgenda() {
  return prisma.agendaEvent.findMany({ orderBy: { startDate: "desc" } });
}

export function getAgendaEvent(id: string) {
  return prisma.agendaEvent.findUnique({ where: { id } });
}

export function createAgendaEvent(data: AgendaWriteData) {
  return prisma.agendaEvent.create({ data });
}

export function updateAgendaEvent(id: string, data: AgendaWriteData) {
  return prisma.agendaEvent.update({ where: { id }, data });
}

export function deleteAgendaEvent(id: string) {
  return prisma.agendaEvent.delete({ where: { id } });
}
