/**
 * Caminho: src/lib/whatsapp.test.ts
 * Arquivo: whatsapp.test.ts
 * Descrição: Testes do gerador de link do WhatsApp.
 */
import { describe, expect, it } from "vitest";
import { messageFromLink, whatsappLink, withWhatsappNumber } from "./whatsapp";

describe("whatsappLink", () => {
  it("devolve o link simples sem mensagem", () => {
    expect(whatsappLink()).toBe("https://wa.me/5521984121612");
  });

  it("codifica a mensagem", () => {
    expect(whatsappLink("Olá! Quero agendar")).toBe("https://wa.me/5521984121612?text=Ol%C3%A1!%20Quero%20agendar");
  });
});

describe("whatsappLink com número das configurações", () => {
  it("usa o número informado no lugar do padrão", () => {
    expect(whatsappLink("Oi", "5511999999999")).toBe("https://wa.me/5511999999999?text=Oi");
    expect(whatsappLink(undefined, "5511999999999")).toBe("https://wa.me/5511999999999");
  });
});

describe("withWhatsappNumber", () => {
  it("troca o número e mantém a mensagem", () => {
    expect(withWhatsappNumber("https://wa.me/5521984121612?text=Ol%C3%A1", "5511999999999")).toBe("https://wa.me/5511999999999?text=Ol%C3%A1");
    expect(withWhatsappNumber("https://wa.me/5521984121612", "5511999999999")).toBe("https://wa.me/5511999999999");
  });

  it("não mexe em links que não são do wa.me", () => {
    expect(withWhatsappNumber("https://exemplo.com/5521984121612", "5511999999999")).toBe("https://exemplo.com/5521984121612");
    expect(withWhatsappNumber("", "5511999999999")).toBe("");
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
