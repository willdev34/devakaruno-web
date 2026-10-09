/**
 * Caminho: src/lib/whatsapp.test.ts
 * Arquivo: whatsapp.test.ts
 * Descrição: Testes do gerador de link do WhatsApp.
 */
import { describe, expect, it } from "vitest";
import { whatsappLink } from "./whatsapp";

describe("whatsappLink", () => {
  it("devolve o link simples sem mensagem", () => {
    expect(whatsappLink()).toBe("https://wa.me/5521984121612");
  });

  it("codifica a mensagem", () => {
    expect(whatsappLink("Olá! Quero agendar")).toBe("https://wa.me/5521984121612?text=Ol%C3%A1!%20Quero%20agendar");
  });
});
