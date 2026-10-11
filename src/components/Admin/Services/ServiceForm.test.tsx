/**
 * Caminho: src/components/Admin/Services/ServiceForm.test.tsx
 * Arquivo: ServiceForm.test.tsx
 * Descrição: Testes do formulário de serviço: validação, ícones, salvar e erros do servidor.
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ServiceForm from "./ServiceForm";

const m = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn(), saveServiceAction: vi.fn() }));

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: m.push, refresh: m.refresh }) }));
vi.mock("@/app/admin/servicos/actions", () => ({ saveServiceAction: m.saveServiceAction }));

const icon = "/images/services/icon-individual.svg";
const empty = { title: "", text: "", icon, whatsappMessage: "" };
const filled = { title: "Casais", text: "Sessão para casais, com acolhimento.", icon, whatsappMessage: "Olá! Quero saber mais." };

describe("ServiceForm", () => {
  beforeEach(() => {
    Object.values(m).forEach((fn) => fn.mockReset());
    m.saveServiceAction.mockResolvedValue({ ok: true, id: "1" });
  });

  it("mostra erros quando faltam campos", async () => {
    render(<ServiceForm serviceId={null} initial={empty} />);

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByText("Informe o título")).toBeInTheDocument();
    expect(screen.getByText("Escreva o texto do card")).toBeInTheDocument();
    expect(screen.getByText("Escreva a mensagem do WhatsApp")).toBeInTheDocument();
    expect(m.saveServiceAction).not.toHaveBeenCalled();
  });

  it("oferece os três ícones padrão", () => {
    render(<ServiceForm serviceId={null} initial={empty} />);

    expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual(["Individual", "Casais", "Cursos"]);
  });

  it("mantém um ícone atual que não é padrão", () => {
    render(<ServiceForm serviceId="1" initial={{ ...filled, icon: "/images/custom.svg" }} />);

    expect(screen.getAllByRole("option").map((option) => option.textContent)).toContain("Atual");
    expect(screen.getByLabelText("Ícone *")).toHaveValue("/images/custom.svg");
  });

  it("salva e volta para a listagem", async () => {
    render(<ServiceForm serviceId="9" initial={filled} />);

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() => expect(m.push).toHaveBeenCalledWith("/admin/servicos"));
    expect(m.saveServiceAction).toHaveBeenCalledWith("9", { ...filled });
  });

  it("mostra os erros devolvidos pelo servidor", async () => {
    m.saveServiceAction.mockResolvedValue({ ok: false, error: "Revise os campos.", fieldErrors: { title: "Título inválido" } });
    render(<ServiceForm serviceId={null} initial={filled} />);

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Revise os campos.");
    expect(screen.getByText("Título inválido")).toBeInTheDocument();
    expect(m.push).not.toHaveBeenCalled();
  });
});
