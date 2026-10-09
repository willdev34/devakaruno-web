/**
 * Caminho: src/app/admin/agenda/Pages.test.tsx
 * Arquivo: Pages.test.tsx
 * Descrição: Testes das páginas de agenda do admin: listagem com situação, nova agenda e edição (incluindo 404).
 */
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AdminAgendaPage from "./page";
import NewAgendaPage from "./novo/page";
import EditAgendaPage from "./[id]/page";

const m = vi.hoisted(() => ({
  listAdminAgenda: vi.fn(),
  getAgendaEvent: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/lib/repositories/admin-agenda", () => ({ listAdminAgenda: m.listAdminAgenda, getAgendaEvent: m.getAgendaEvent }));
vi.mock("next/navigation", () => ({ notFound: m.notFound }));
vi.mock("./actions", () => ({ deleteAgendaAction: vi.fn() }));
vi.mock("@/components/Admin/Agenda/AgendaForm", () => ({
  default: ({ eventId, initial }: { eventId: string | null; initial: Record<string, unknown> }) => (
    <div data-testid="form">{`${eventId}|${initial.state}|${initial.startDate}|${initial.published}`}</div>
  ),
}));
vi.mock("@/components/Admin/Posts/DeleteButton", () => ({ default: ({ name }: { name: string }) => <button>{`Excluir ${name}`}</button> }));

const d = (day: string) => new Date(`${day}T00:00:00.000Z`);
const event = (over = {}) => ({
  id: "1",
  city: "São Paulo",
  state: "SP",
  venue: "Espaço Lótus",
  address: null,
  description: null,
  published: true,
  startDate: d("2026-11-12"),
  endDate: d("2026-11-15"),
  ...over,
});

describe("admin/agenda", () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date("2026-10-09T15:00:00Z"));
    Object.values(m).forEach((fn) => fn.mockReset());
  });
  afterEach(() => vi.useRealTimers());

  it("lista com a situação de cada atendimento", async () => {
    m.listAdminAgenda.mockResolvedValue([
      event(),
      event({ id: "2", city: "Niterói", state: null, startDate: d("2026-10-08"), endDate: d("2026-10-10") }),
      event({ id: "3", city: "Santos", startDate: d("2026-01-01"), endDate: d("2026-01-02") }),
      event({ id: "4", city: "Campinas", published: false }),
    ]);

    render(await AdminAgendaPage());

    expect(screen.getByText("Próxima")).toBeInTheDocument();
    expect(screen.getByText("Acontecendo")).toBeInTheDocument();
    expect(screen.getByText("Encerrada")).toBeInTheDocument();
    expect(screen.getByText("Oculta")).toBeInTheDocument();
    expect(screen.getByText("São Paulo/SP")).toBeInTheDocument();
    expect(screen.getAllByText("12 a 15 de novembro").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Editar" })[0]).toHaveAttribute("href", "/admin/agenda/1");
    expect(screen.getByRole("link", { name: "+ Nova agenda" })).toBeInTheDocument();
  });

  it("lista vazia avisa", async () => {
    m.listAdminAgenda.mockResolvedValue([]);

    render(await AdminAgendaPage());

    expect(screen.getByText("Nenhuma agenda cadastrada ainda.")).toBeInTheDocument();
  });

  it("nova agenda abre o formulário vazio e visível", () => {
    render(<NewAgendaPage />);

    expect(screen.getByTestId("form")).toHaveTextContent("null|||true");
  });

  it("edição converte as datas para o campo de data", async () => {
    m.getAgendaEvent.mockResolvedValue(event({ address: "Rua A", description: "obs" }));

    render(await EditAgendaPage({ params: Promise.resolve({ id: "1" }) }));

    expect(screen.getByTestId("form")).toHaveTextContent("1|SP|2026-11-12|true");
    expect(screen.getByRole("button", { name: "Excluir São Paulo" })).toBeInTheDocument();
  });

  it("edição de atendimento inexistente dá 404", async () => {
    m.getAgendaEvent.mockResolvedValue(null);

    await expect(EditAgendaPage({ params: Promise.resolve({ id: "x" }) })).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
