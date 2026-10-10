/**
 * Caminho: src/components/Admin/Settings/SettingsForm.test.tsx
 * Arquivo: SettingsForm.test.tsx
 * Descrição: Testes do formulário de configurações: valores iniciais, validação, salvar com aviso e erros do servidor.
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_SETTINGS } from "@/lib/settings/defaults";
import SettingsForm from "./SettingsForm";

const m = vi.hoisted(() => ({ refresh: vi.fn(), saveSettingsAction: vi.fn() }));

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: m.refresh }) }));
vi.mock("@/app/admin/configuracoes/actions", () => ({ saveSettingsAction: m.saveSettingsAction }));

describe("SettingsForm", () => {
  beforeEach(() => {
    Object.values(m).forEach((fn) => fn.mockReset());
    m.saveSettingsAction.mockResolvedValue({ ok: true });
  });

  it("mostra os valores atuais", () => {
    render(<SettingsForm initial={DEFAULT_SETTINGS} />);

    expect(screen.getByLabelText("Número do WhatsApp *")).toHaveValue("5521984121612");
    expect(screen.getByLabelText("E-mail de contato *")).toHaveValue("karunodeva@gmail.com");
    expect(screen.getByLabelText("Google Tag Manager")).toHaveValue("");
  });

  it("mostra erros de formato sem enviar", async () => {
    render(<SettingsForm initial={DEFAULT_SETTINGS} />);

    fireEvent.change(screen.getByLabelText("Google Tag Manager"), { target: { value: "abc" } });
    fireEvent.change(screen.getByLabelText("E-mail de contato *"), { target: { value: "x" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByText("Use o formato GTM-XXXXXXX")).toBeInTheDocument();
    expect(screen.getByText("E-mail inválido")).toBeInTheDocument();
    expect(m.saveSettingsAction).not.toHaveBeenCalled();
  });

  it("salva e avisa que deu certo", async () => {
    render(<SettingsForm initial={DEFAULT_SETTINGS} />);

    fireEvent.change(screen.getByLabelText("Google Tag Manager"), { target: { value: "GTM-ABC1234" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByText(/Configurações salvas/)).toBeInTheDocument();
    expect(m.saveSettingsAction).toHaveBeenCalledWith(expect.objectContaining({ gtmId: "GTM-ABC1234" }));
    expect(m.refresh).toHaveBeenCalled();
  });

  it("mostra os erros devolvidos pelo servidor", async () => {
    m.saveSettingsAction.mockResolvedValue({ ok: false, error: "Revise os campos destacados.", fieldErrors: { address: "Erro do servidor" } });
    render(<SettingsForm initial={DEFAULT_SETTINGS} />);

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() => expect(screen.getByText("Revise os campos destacados.")).toBeInTheDocument());
    expect(screen.getByText("Erro do servidor")).toBeInTheDocument();
    expect(screen.queryByText(/Configurações salvas/)).not.toBeInTheDocument();
  });
});
