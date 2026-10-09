/**
 * Caminho: src/lib/repositories/agenda.ts
 * Arquivo: agenda.ts
 * Descrição: Leitura pública da agenda: atendimentos publicados que ainda não terminaram, do mais próximo para o mais distante.
 */
import { prisma } from "@/lib/prisma";
import { todayInBrazil } from "@/lib/agenda/utils";

export function getUpcomingAgenda(now = new Date()) {
  return prisma.agendaEvent.findMany({
    where: { published: true, endDate: { gte: todayInBrazil(now) } },
    orderBy: { startDate: "asc" },
  });
}
