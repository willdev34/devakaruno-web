/**
 * Caminho: src/lib/consent.test.ts
 * Arquivo: consent.test.ts
 * Descrição: Testes da escolha de cookies: leitura, gravação, limpeza, aviso de mudança e navegador sem armazenamento.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CONSENT_EVENT, CONSENT_KEY, clearConsent, readConsent, saveConsent } from "./consent";

describe("consent", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it("sem escolha salva devolve null", () => {
    expect(readConsent()).toBeNull();
  });

  it("salva e lê aceitar e recusar", () => {
    saveConsent("accepted");
    expect(readConsent()).toBe("accepted");
    saveConsent("rejected");
    expect(readConsent()).toBe("rejected");
  });

  it("ignora valores estranhos no armazenamento", () => {
    window.localStorage.setItem(CONSENT_KEY, "talvez");
    expect(readConsent()).toBeNull();
  });

  it("clearConsent apaga a escolha", () => {
    saveConsent("accepted");
    clearConsent();
    expect(readConsent()).toBeNull();
  });

  it("avisa a própria aba quando a escolha muda", () => {
    const listener = vi.fn();
    window.addEventListener(CONSENT_EVENT, listener);
    saveConsent("accepted");
    clearConsent();
    window.removeEventListener(CONSENT_EVENT, listener);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("não quebra quando o navegador bloqueia o armazenamento", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("bloqueado");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("bloqueado");
    });
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("bloqueado");
    });

    expect(readConsent()).toBeNull();
    expect(() => saveConsent("accepted")).not.toThrow();
    expect(() => clearConsent()).not.toThrow();
  });
});
