/**
 * Caminho: src/lib/agenda/utils.ts
 * Arquivo: utils.ts
 * Descrição: Funções puras da agenda: período em português, status (acontecendo, próxima, encerrada), dia de hoje no Brasil, link do mapa e mensagem do WhatsApp.
 */
import { whatsappLink } from "@/lib/whatsapp";

export type AgendaLike = {
  city: string;
  state?: string | null;
  venue: string;
  address?: string | null;
  startDate: Date;
  endDate: Date;
};

export type AgendaStatus = "ongoing" | "upcoming" | "past";

const MONTHS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
export const MONTHS_SHORT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

// As datas da agenda são só o dia (sem hora), guardadas à meia-noite UTC: lemos sempre em UTC
const parts = (date: Date) => ({ d: date.getUTCDate(), m: date.getUTCMonth(), y: date.getUTCFullYear() });

// "12 de novembro", "12 a 15 de novembro" ou "28 de novembro a 2 de dezembro" (com o ano se não for o atual)
export function formatDateRange(start: Date, end: Date, currentYear = new Date().getFullYear()): string {
  const a = parts(start);
  const b = parts(end);
  const year = b.y !== currentYear ? ` de ${b.y}` : "";

  if (a.d === b.d && a.m === b.m && a.y === b.y) return `${a.d} de ${MONTHS[a.m]}${year}`;
  if (a.m === b.m && a.y === b.y) return `${a.d} a ${b.d} de ${MONTHS[b.m]}${year}`;
  return `${a.d} de ${MONTHS[a.m]} a ${b.d} de ${MONTHS[b.m]}${year}`;
}

// Dia de hoje no calendário de São Paulo, à meia-noite UTC (comparável com as datas do banco)
export function todayInBrazil(now = new Date()): Date {
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(now);
  return new Date(`${day}T00:00:00.000Z`);
}

export function getAgendaStatus(event: Pick<AgendaLike, "startDate" | "endDate">, today = todayInBrazil()): AgendaStatus {
  if (today < event.startDate) return "upcoming";
  if (today > event.endDate) return "past";
  return "ongoing";
}

// "Rio de Janeiro/RJ" ou só a cidade
export function cityLabel(event: Pick<AgendaLike, "city" | "state">): string {
  return event.state ? `${event.city}/${event.state}` : event.city;
}

export function mapsLink(event: AgendaLike): string {
  const query = [event.venue, event.address, event.city, event.state].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

// Mensagem pronta para reservar horário na cidade
export function agendaWhatsappLink(event: AgendaLike, currentYear?: number): string {
  const when = formatDateRange(event.startDate, event.endDate, currentYear);
  return whatsappLink(`Olá! Vi na agenda que você estará em ${cityLabel(event)} (${when}) e gostaria de reservar uma sessão.`);
}

export const CITY_REQUEST_LINK = whatsappLink(
  "Olá! Gostaria de saber se você pode atender na minha cidade. Minha cidade é: ",
);
