/**
 * Caminho: src/components/TerapiaTantrica/AnamneseModal/index.test.tsx
 * Arquivo: index.test.tsx
 * Descrição: Testes do modal da ficha de anamnese: carregamento do formulário, aviso, WhatsApp e formas de fechar.
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AnamneseModal from "./index";
import { ANAMNESE_FORM_URL } from "@/lib/anamnese";
import { SiteSettingsProvider } from "@/components/Providers/SiteSettingsProvider";
import { DEFAULT_SETTINGS } from "@/lib/settings/defaults";

describe("TerapiaTantrica/AnamneseModal", () => {
  it("não carrega o formulário com o modal fechado", () => {
    render(<AnamneseModal open={false} onClose={vi.fn()} />);

    expect(screen.queryByTitle("Ficha de anamnese")).not.toBeInTheDocument();
  });

  it("carrega o formulário do Google quando abre", () => {
    render(<AnamneseModal open onClose={vi.fn()} />);

    expect(screen.getByTitle("Ficha de anamnese")).toHaveAttribute("src", ANAMNESE_FORM_URL);
    expect(screen.getByRole("dialog", { name: "Ficha de anamnese" })).toBeInTheDocument();
  });

  it("mostra o aviso de consentimento com link para a política", () => {
    render(<AnamneseModal open onClose={vi.fn()} />);

    expect(screen.getByText(/O preenchimento é voluntário/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Política de Privacidade" })).toHaveAttribute(
      "href",
      "/politica-de-privacidade"
    );
  });

  it("oferece o WhatsApp em nova aba", () => {
    render(<AnamneseModal open onClose={vi.fn()} />);

    const link = screen.getByRole("link", { name: "Falar no WhatsApp" });
    expect(link).toHaveAttribute("href", expect.stringMatching(/^https:\/\/wa\.me\/5521984121612\?text=/));
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("usa o número do WhatsApp das configurações do site", () => {
    render(
      <SiteSettingsProvider value={{ ...DEFAULT_SETTINGS, whatsappNumber: "5511999999999" }}>
        <AnamneseModal open onClose={vi.fn()} />
      </SiteSettingsProvider>,
    );

    expect(screen.getByRole("link", { name: "Falar no WhatsApp" })).toHaveAttribute("href", expect.stringMatching(/^https:\/\/wa\.me\/5511999999999\?text=/));
  });

  it("fecha pelo botão X", () => {
    const onClose = vi.fn();
    render(<AnamneseModal open onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("fecha ao clicar no fundo, mas não ao clicar dentro do modal", () => {
    const onClose = vi.fn();
    render(<AnamneseModal open onClose={onClose} />);
    const dialog = screen.getByRole("dialog");

    fireEvent.click(screen.getByRole("heading", { name: "Ficha de anamnese" }));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(dialog);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("avisa o pai quando o navegador fecha o dialog (tecla Esc)", () => {
    const onClose = vi.fn();
    render(<AnamneseModal open onClose={onClose} />);

    fireEvent(screen.getByRole("dialog"), new Event("close"));

    expect(onClose).toHaveBeenCalled();
  });

  it("trava a rolagem da página enquanto está aberto e libera ao fechar", () => {
    const { rerender } = render(<AnamneseModal open onClose={vi.fn()} />);
    expect(document.body.style.overflow).toBe("hidden");

    rerender(<AnamneseModal open={false} onClose={vi.fn()} />);
    expect(document.body.style.overflow).toBe("");
  });
});
