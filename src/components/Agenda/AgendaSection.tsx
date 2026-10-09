/**
 * Caminho: src/components/Agenda/AgendaSection.tsx
 * Arquivo: AgendaSection.tsx
 * Descrição: Conteúdo da página Agenda: destaque da próxima parada, demais datas agrupadas por mês e convite para quem não encontrou a própria cidade.
 */
import { Icon } from "@iconify/react";
import { CITY_REQUEST_LINK, type AgendaLike } from "@/lib/agenda/utils";
import AgendaCard from "./AgendaCard";
import NextStop from "./NextStop";

type Event = AgendaLike & { id: string; description?: string | null };

const MONTHS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

// Agrupa as datas por mês de início, mantendo a ordem recebida
function groupByMonth(events: Event[]) {
  const groups: { key: string; title: string; events: Event[] }[] = [];
  for (const event of events) {
    const month = event.startDate.getUTCMonth();
    const year = event.startDate.getUTCFullYear();
    const key = `${year}-${month}`;
    const group = groups.find((item) => item.key === key);
    if (group) group.events.push(event);
    else groups.push({ key, title: `${MONTHS[month]} de ${year}`, events: [event] });
  }
  return groups;
}

export default function AgendaSection({ events }: { events: Event[] }) {
  const [next, ...others] = events;

  return (
    <section className="py-16 lg:py-24 dark:bg-dark">
      <div className="container mx-auto px-4 lg:max-w-(--breakpoint-lg)">
        <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-muted">
          Além dos atendimentos no Rio de Janeiro, estou em outras cidades em datas específicas. Veja onde e quando, e
          reserve seu horário direto pelo WhatsApp.
        </p>

        {next ? (
          <>
            <NextStop event={next} />

            {others.length > 0 && (
              <div className="mt-14">
                <h2 className="mb-2 font-heading text-3xl font-semibold text-midnight_text dark:text-white">Outras datas</h2>
                {groupByMonth(others).map((group) => (
                  <div key={group.key} className="mt-8">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">{group.title}</h3>
                    <div className="space-y-4">
                      {group.events.map((event) => (
                        <AgendaCard key={event.id} event={event} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <Icon icon="solar:calendar-linear" width={40} className="mx-auto text-primary" aria-hidden />
            <h2 className="mt-4 font-heading text-3xl font-semibold text-midnight_text dark:text-white">
              Nenhuma viagem marcada por enquanto
            </h2>
            <p className="mt-2 text-muted">As próximas cidades aparecem aqui assim que forem confirmadas.</p>
          </div>
        )}

        <div className="mt-14 rounded-2xl bg-primary/10 p-8 text-center">
          <h2 className="font-heading text-2xl font-semibold text-midnight_text dark:text-white">Não encontrou a sua cidade?</h2>
          <p className="mx-auto mt-2 max-w-xl text-muted">
            Conte onde você mora. Quando houver interesse suficiente em uma região, eu organizo uma nova data.
          </p>
          <a
            href={CITY_REQUEST_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-darkprimary"
          >
            Quero atendimento na minha cidade
          </a>
        </div>
      </div>
    </section>
  );
}
