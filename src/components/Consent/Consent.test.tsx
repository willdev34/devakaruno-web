/**
 * Caminho: src/components/Consent/Consent.test.tsx
 * Arquivo: Consent.test.tsx
 * Descrição: Testes do aviso de cookies e do botão de preferências na Política de Privacidade.
 */
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CookieBanner from "./CookieBanner";
import CookiePreferencesButton from "./CookiePreferencesButton";
import { readConsent, saveConsent } from "@/lib/consent";

const m = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => m.pathname }));

describe("CookieBanner", () => {
  beforeEach(() => {
    window.localStorage.clear();
    m.pathname = "/";
  });

  it("aparece quando há rastreamento e ainda não há escolha, com link para a política", () => {
    render(<CookieBanner enabled />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Política de Privacidade" })).toHaveAttribute("href", "/politica-de-privacidade");
  });

  it("não aparece sem rastreamento configurado", () => {
    render(<CookieBanner enabled={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("não aparece no painel admin", () => {
    m.pathname = "/admin/posts";
    render(<CookieBanner enabled />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    m.pathname = "/admin";
    render(<CookieBanner enabled />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("não aparece quando o visitante já escolheu", () => {
    saveConsent("rejected");
    render(<CookieBanner enabled />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Aceitar salva a escolha e some", () => {
    render(<CookieBanner enabled />);

    fireEvent.click(screen.getByRole("button", { name: "Aceitar" }));

    expect(readConsent()).toBe("accepted");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Recusar salva a escolha e some", () => {
    render(<CookieBanner enabled />);

    fireEvent.click(screen.getByRole("button", { name: "Recusar" }));

    expect(readConsent()).toBe("rejected");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("CookiePreferencesButton", () => {
  const reload = vi.fn();

  beforeEach(() => {
    window.localStorage.clear();
    reload.mockReset();
    Object.defineProperty(window, "location", { configurable: true, value: { ...window.location, reload } });
  });

  it("mostra a situação atual", () => {
    render(<CookiePreferencesButton />);
    expect(screen.getByText("Você ainda não fez uma escolha.")).toBeInTheDocument();

    act(() => saveConsent("rejected"));
    expect(screen.getByText("Você recusou os cookies de análise e marketing.")).toBeInTheDocument();

    act(() => saveConsent("accepted"));
    expect(screen.getByText("Você aceitou os cookies de análise e marketing.")).toBeInTheDocument();
  });

  it("quem havia aceitado limpa a escolha e a página recarrega", () => {
    saveConsent("accepted");
    render(<CookiePreferencesButton />);

    fireEvent.click(screen.getByRole("button", { name: "Alterar minha escolha" }));

    expect(readConsent()).toBeNull();
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("quem havia recusado limpa a escolha sem recarregar", () => {
    saveConsent("rejected");
    render(<CookiePreferencesButton />);

    fireEvent.click(screen.getByRole("button", { name: "Alterar minha escolha" }));

    expect(readConsent()).toBeNull();
    expect(reload).not.toHaveBeenCalled();
  });
});
