/**
 * Caminho: src/lib/whatsapp.test.ts
 * Arquivo: whatsapp.test.ts
 * Descrição: Testes do gerador de link do WhatsApp.
 */
import { describe, expect, it } from "vitest";
import { messageFromLink, whatsappLink } from "./whatsapp";

describe("whatsappLink", () => {
  it("devolve o link simples sem mensagem", () => {
    expect(whatsappLink()).toBe("https://wa.me/5521984121612");
  });

  it("codifica a mensagem", () => {
    expect(whatsappLink("Olá! Quero agendar")).toBe("https://wa.me/5521984121612?text=Ol%C3%A1!%20Quero%20agendar");
  });
});

describe("messageFromLink", () => {
  it("lê a mensagem de um link com texto", () => {
    expect(messageFromLink("https://wa.me/5521984121612?text=Ol%C3%A1%21%20Quero%20agendar")).toBe("Olá! Quero agendar");
  });

  it("devolve vazio sem texto ou com link inválido", () => {
    expect(messageFromLink("https://wa.me/5521984121612")).toBe("");
    expect(messageFromLink("isso não é um link")).toBe("");
  });
});
