/**
 * Caminho: src/components/Agenda/AgendaCard.tsx
 * Arquivo: AgendaCard.tsx
 * Descrição: Card de uma data da agenda: bloco com o dia e o mês, cidade, local e botão para reservar horário no WhatsApp.
 */
import { Icon } from "@iconify/react";
import {
  MONTHS_SHORT,
  agendaWhatsappLink,
  cityLabel,
  formatDateRange,
  mapsLink,
  type AgendaLike,
} from "@/lib/agenda/utils";

type Props = { event: AgendaLike & { description?: string | null }; whatsappNumber?: string };

export default function AgendaCard({ event, whatsappNumber }: Props) {
  const startDay = event.startDate.getUTCDate();
  const endDay = event.endDate.getUTCDate();
  const sameDay = event.startDate.getTime() === event.endDate.getTime();

  return (
    <article className="flex flex-col gap-5 rounded-xl border border-border/50 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-dark_border dark:bg-darklight sm:flex-row sm:items-center">
      <div
        aria-hidden
        className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary"
      >
        <span className="text-2xl font-bold leading-none">{sameDay ? startDay : `${startDay}-${endDay}`}</span>
        <span className="mt-1 text-sm font-semibold uppercase">{MONTHS_SHORT[event.startDate.getUTCMonth()]}</span>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-heading text-2xl font-semibold text-midnight_text dark:text-white">{cityLabel(event)}</h3>
        <p className="text-sm text-muted">{formatDateRange(event.startDate, event.endDate)}</p>
        <p className="mt-2 flex items-start gap-2 text-sm text-midnight_text dark:text-white/80">
          <Icon icon="solar:map-point-linear" width={18} aria-hidden className="mt-0.5 shrink-0" />
          <span>
            {event.venue}
            {event.address ? ` · ${event.address}` : ""}{" "}
            <a href={mapsLink(event)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              mapa
            </a>
          </span>
        </p>
        {event.description ? <p className="mt-2 text-sm text-muted">{event.description}</p> : null}
      </div>

      <a
        href={agendaWhatsappLink(event, undefined, whatsappNumber)}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-lg bg-linear-to-r from-primary to-secondary px-5 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
      >
        Reservar em {event.city}
      </a>
    </article>
  );
}
