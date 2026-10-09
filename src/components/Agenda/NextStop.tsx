/**
 * Caminho: src/components/Agenda/NextStop.tsx
 * Arquivo: NextStop.tsx
 * Descrição: Destaque da próxima cidade da agenda (ou da que está acontecendo agora), com período, local, mapa e CTA exclusivo para reservar horário no WhatsApp.
 */
import { Icon } from "@iconify/react";
import {
  agendaWhatsappLink,
  cityLabel,
  formatDateRange,
  getAgendaStatus,
  mapsLink,
  type AgendaLike,
} from "@/lib/agenda/utils";

type Props = { event: AgendaLike & { description?: string | null } };

export default function NextStop({ event }: Props) {
  const ongoing = getAgendaStatus(event) === "ongoing";

  return (
    <article className="overflow-hidden rounded-2xl bg-linear-to-br from-darkprimary via-primary to-secondary p-8 text-white shadow-xl sm:p-12">
      <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest">
        <span aria-hidden className={`h-2 w-2 rounded-full ${ongoing ? "animate-pulse bg-white" : "bg-white/70"}`} />
        {ongoing ? "Atendendo agora" : "Próxima parada"}
      </p>

      <h2 className="font-heading text-5xl font-semibold sm:text-6xl">{cityLabel(event)}</h2>

      <ul className="mt-6 space-y-3 text-lg">
        <li className="flex items-center gap-3">
          <Icon icon="solar:calendar-linear" width={24} aria-hidden />
          {formatDateRange(event.startDate, event.endDate)}
        </li>
        <li className="flex items-start gap-3">
          <Icon icon="solar:map-point-linear" width={24} aria-hidden className="mt-0.5 shrink-0" />
          <span>
            {event.venue}
            {event.address ? <span className="block text-base text-white/75">{event.address}</span> : null}
          </span>
        </li>
      </ul>

      {event.description ? <p className="mt-6 max-w-2xl text-white/85">{event.description}</p> : null}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <a
          href={agendaWhatsappLink(event)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-white px-7 py-4 font-semibold text-darkprimary transition hover:bg-white/90"
        >
          Reservar horário em {event.city}
        </a>
        <a
          href={mapsLink(event)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline-offset-4 hover:underline"
        >
          Ver no mapa
        </a>
      </div>
    </article>
  );
}
