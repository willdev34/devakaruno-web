/**
 * Caminho: src/components/Agenda/Agenda.test.tsx
 * Arquivo: Agenda.test.tsx
 * Descrição: Testes da página pública da agenda: destaque, cards por mês, CTAs de WhatsApp, estado vazio e a página que busca os dados.
 */
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AgendaSection from "./AgendaSection";
import AgendaCard from "./AgendaCard";
import NextStop from "./NextStop";
import AgendaPage from "@/app/(site)/agenda/page";

const { getUpcomingAgenda } = vi.hoisted(() => ({ getUpcomingAgenda: vi.fn() }));
vi.mock("@/lib/repositories/site-settings", () => ({ getSiteSettings: async () => ({ whatsappNumber: "5511999999999" }) }));

vi.mock("@iconify/react", () => ({ Icon: () => null }));
vi.mock("@/lib/repositories/agenda", () => ({ getUpcomingAgenda }));
vi.mock("@/components/SharedComponent/HeroSub", () => ({ default: ({ title }: { title: string }) => <h1>{title}</h1> }));
vi.mock("@/components/Home/WhatsAppCTA", () => ({ default: () => <div>cta-final</div> }));

const d = (day: string) => new Date(`${day}T00:00:00.000Z`);
const event = (over = {}) => ({
  id: "1",
  city: "São Paulo",
  state: "SP",
  venue: "Espaço Lótus",
  address: "Rua A, 10",
  description: "Atendimentos de manhã",
  startDate: d("2026-11-12"),
  endDate: d("2026-11-15"),
  ...over,
});

describe("Agenda", () => {
  beforeEach(() => vi.useFakeTimers().setSystemTime(new Date("2026-10-09T15:00:00Z")));
  afterEach(() => vi.useRealTimers());

  it("NextStop mostra cidade, período, local, observação e CTA com a cidade", () => {
    render(<NextStop event={event()} />);

    expect(screen.getByRole("heading", { name: "São Paulo/SP" })).toBeInTheDocument();
    expect(screen.getByText("12 a 15 de novembro")).toBeInTheDocument();
    expect(screen.getByText("Rua A, 10")).toBeInTheDocument();
    expect(screen.getByText("Atendimentos de manhã")).toBeInTheDocument();
    expect(screen.getByText("Próxima parada")).toBeInTheDocument();
    const cta = screen.getByRole("link", { name: "Reservar horário em São Paulo" });
    expect(decodeURIComponent(cta.getAttribute("href")!)).toContain("São Paulo/SP (12 a 15 de novembro)");
    expect(screen.getByRole("link", { name: "Ver no mapa" })).toHaveAttribute("href", expect.stringContaining("google.com/maps"));
  });

  it("NextStop indica quando já está acontecendo e aceita evento simples", () => {
    render(<NextStop event={event({ startDate: d("2026-10-08"), endDate: d("2026-10-10"), address: null, description: null, state: null })} />);

    expect(screen.getByText("Atendendo agora")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "São Paulo" })).toBeInTheDocument();
  });

  it("AgendaCard mostra o bloco de data e o CTA", () => {
    render(<AgendaCard event={event()} />);

    expect(screen.getByText("12-15")).toBeInTheDocument();
    expect(screen.getByText("nov")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Reservar em São Paulo" })).toHaveAttribute("href", expect.stringContaining("wa.me"));
  });

  it("AgendaCard de um dia só mostra um número e funciona sem endereço", () => {
    render(<AgendaCard event={event({ endDate: d("2026-11-12"), address: null, description: null })} />);

    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.queryByText(/Rua A/)).not.toBeInTheDocument();
  });

  it("AgendaSection destaca a primeira e agrupa as outras por mês", () => {
    render(
      <AgendaSection
        events={[
          event(),
          event({ id: "2", city: "Niterói", state: "RJ", startDate: d("2026-11-20"), endDate: d("2026-11-21") }),
          event({ id: "3", city: "Curitiba", state: "PR", startDate: d("2026-12-03"), endDate: d("2026-12-04") }),
        ]}
      />,
    );

    expect(screen.getByRole("heading", { name: "São Paulo/SP" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "novembro de 2026" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "dezembro de 2026" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Niterói/RJ" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Quero atendimento na minha cidade" })).toHaveAttribute("href", expect.stringContaining("wa.me"));
  });

  it("AgendaSection com uma só data não mostra 'Outras datas'", () => {
    render(<AgendaSection events={[event()]} />);

    expect(screen.queryByText("Outras datas")).not.toBeInTheDocument();
  });

  it("AgendaSection vazia avisa e mantém o convite para pedir a cidade", () => {
    render(<AgendaSection events={[]} />);

    expect(screen.getByText("Nenhuma viagem marcada por enquanto")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Quero atendimento na minha cidade" })).toBeInTheDocument();
  });

  it("o número do WhatsApp das configurações chega aos botões de reserva e ao convite", () => {
    render(<AgendaSection events={[event(), event({ id: "2", city: "Niterói", state: "RJ", startDate: d("2026-11-20"), endDate: d("2026-11-21") })]} whatsappNumber="5511999999999" />);

    expect(screen.getByRole("link", { name: "Reservar horário em São Paulo" })).toHaveAttribute("href", expect.stringContaining("wa.me/5511999999999"));
    expect(screen.getByRole("link", { name: "Reservar em Niterói" })).toHaveAttribute("href", expect.stringContaining("wa.me/5511999999999"));
    expect(screen.getByRole("link", { name: "Quero atendimento na minha cidade" })).toHaveAttribute("href", expect.stringContaining("wa.me/5511999999999"));
  });

  it("a página busca a agenda e monta título, lista e CTA final", async () => {
    getUpcomingAgenda.mockResolvedValue([event()]);

    render(await AgendaPage());

    // A página lê o número nas configurações e repassa
    expect(screen.getByRole("link", { name: "Reservar horário em São Paulo" })).toHaveAttribute("href", expect.stringContaining("wa.me/5511999999999"));

    expect(screen.getByRole("heading", { name: "Agenda" })).toBeInTheDocument();
    expect(screen.getByText("Próxima parada")).toBeInTheDocument();
    expect(screen.getByText("cta-final")).toBeInTheDocument();
  });
});
