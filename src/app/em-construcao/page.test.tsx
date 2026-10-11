/**
 * Caminho: src/app/em-construcao/page.test.tsx
 * Arquivo: page.test.tsx
 * Descrição: Teste da página "em construção": o botão de WhatsApp usa o número das configurações do site.
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import EmConstrucaoPage from "./page";

vi.mock("@/lib/repositories/site-settings", () => ({ getSiteSettings: async () => ({ whatsappNumber: "5511999999999" }) }));

describe("em-construcao", () => {
  it("mostra o aviso e o WhatsApp com o número das configurações", async () => {
    render(await EmConstrucaoPage());

    expect(screen.getByRole("heading", { name: "Nosso novo site está sendo preparado" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Falar no WhatsApp" })).toHaveAttribute("href", expect.stringMatching(/^https:\/\/wa\.me\/5511999999999\?text=/));
  });
});
