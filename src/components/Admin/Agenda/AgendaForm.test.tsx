/**
 * Caminho: src/components/Admin/Agenda/AgendaForm.test.tsx
 * Arquivo: AgendaForm.test.tsx
 * Descrição: Testes do formulário de agenda: validação, data final acompanhando a inicial, salvar e erros do servidor.
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AgendaForm from "./AgendaForm";

const { push, refresh, saveAgendaAction } = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn(), saveAgendaAction: vi.fn() }));

vi.mock("next/navigation", () => ({ useRouter: () => ({ push, refresh }) }));
vi.mock("@/app/admin/agenda/actions", () => ({ saveAgendaAction }));

const empty = { city: "", state: "", venue: "", address: "", startDate: "", endDate: "", description: "", published: true };
const filled = { ...empty, city: "Niterói", venue: "Casa Verde", startDate: "2026-12-01", endDate: "2026-12-03" };

describe("AgendaForm", () => {
  beforeEach(() => {
    [push, refresh, saveAgendaAction].forEach((fn) => fn.mockReset());
    saveAgendaAction.mockResolvedValue({ ok: true, id: "1" });
  });

  it("mostra erros quando faltam campos", async () => {
    render(<AgendaForm eventId={null} initial={empty} />);

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByText("Informe a cidade")).toBeInTheDocument();
    expect(screen.getByText("Informe o local de atendimento")).toBeInTheDocument();
    expect(saveAgendaAction).not.toHaveBeenCalled();
  });

  it("a data final acompanha a inicial quando está vazia ou antes", () => {
    render(<AgendaForm eventId={null} initial={empty} />);

    fireEvent.change(screen.getByLabelText("Data inicial *"), { target: { value: "2026-11-10" } });
    expect(screen.getByLabelText("Data final *")).toHaveValue("2026-11-10");

    fireEvent.change(screen.getByLabelText("Data final *"), { target: { value: "2026-11-15" } });
    fireEvent.change(screen.getByLabelText("Data inicial *"), { target: { value: "2026-11-12" } });
    expect(screen.getByLabelText("Data final *")).toHaveValue("2026-11-15");

    fireEvent.change(screen.getByLabelText("Data inicial *"), { target: { value: "2026-11-20" } });
    expect(screen.getByLabelText("Data final *")).toHaveValue("2026-11-20");
  });

  it("salva e volta para a listagem", async () => {
    render(<AgendaForm eventId="9" initial={filled} />);

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/admin/agenda"));
    expect(saveAgendaAction).toHaveBeenCalledWith("9", expect.objectContaining({ city: "Niterói", published: true }));
  });

  it("mostra os erros devolvidos pelo servidor", async () => {
    saveAgendaAction.mockResolvedValue({ ok: false, error: "Revise os campos.", fieldErrors: { city: "Cidade inválida" } });
    render(<AgendaForm eventId={null} initial={filled} />);

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Revise os campos.");
    expect(screen.getByText("Cidade inválida")).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });
});
