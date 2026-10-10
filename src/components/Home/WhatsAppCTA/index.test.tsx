/**
 * Caminho: src/components/Home/WhatsAppCTA/index.test.tsx
 * Arquivo: index.test.tsx
 * Descrição: Testes do CTA de agendamento: textos da seção e link do botão para o WhatsApp.
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WhatsAppCTA from "./index";
import { SiteSettingsProvider } from "@/components/Providers/SiteSettingsProvider";
import { DEFAULT_SETTINGS } from "@/lib/settings/defaults";

describe("Home/WhatsAppCTA", () => {
  it("exibe o título e a chamada da seção", () => {
    render(<WhatsAppCTA />);

    expect(screen.getByRole("heading", { name: "Pronto para começar?" })).toBeInTheDocument();
    expect(screen.getByText(/Agende uma conversa/)).toBeInTheDocument();
  });

  it("aponta o botão Agendar Sessão para o WhatsApp em nova aba", () => {
    render(<WhatsAppCTA />);

    const button = screen.getByRole("link", { name: "Agendar Sessão" });
    expect(button).toHaveAttribute("href", expect.stringMatching(/^https:\/\/wa\.me\/5521984121612\?text=/));
    expect(button).toHaveAttribute("target", "_blank");
    expect(button).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("usa o número e a mensagem das configurações do site", () => {
    render(
      <SiteSettingsProvider value={{ ...DEFAULT_SETTINGS, whatsappNumber: "5511999999999", whatsappMessage: "Oi, quero agendar" }}>
        <WhatsAppCTA />
      </SiteSettingsProvider>,
    );

    expect(screen.getByRole("link", { name: "Agendar Sessão" })).toHaveAttribute("href", "https://wa.me/5511999999999?text=Oi%2C%20quero%20agendar");
  });
});
