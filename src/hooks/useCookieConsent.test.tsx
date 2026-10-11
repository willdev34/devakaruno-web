/**
 * Caminho: src/hooks/useCookieConsent.test.tsx
 * Arquivo: useCookieConsent.test.tsx
 * Descrição: Testes do hook de escolha de cookies: estado inicial, reação a mudanças e valor do servidor.
 */
import { act, renderHook } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it } from "vitest";
import { clearConsent, saveConsent } from "@/lib/consent";
import { useCookieConsent } from "./useCookieConsent";

function Probe() {
  return <p>{useCookieConsent()}</p>;
}

describe("useCookieConsent", () => {
  beforeEach(() => window.localStorage.clear());

  it("começa como unset quando não há escolha", () => {
    const { result } = renderHook(() => useCookieConsent());
    expect(result.current).toBe("unset");
  });

  it("acompanha aceitar, recusar e limpar", () => {
    const { result } = renderHook(() => useCookieConsent());

    act(() => saveConsent("accepted"));
    expect(result.current).toBe("accepted");
    act(() => saveConsent("rejected"));
    expect(result.current).toBe("rejected");
    act(() => clearConsent());
    expect(result.current).toBe("unset");
  });

  it("reage à mudança vinda de outra aba (evento storage)", () => {
    const { result } = renderHook(() => useCookieConsent());

    act(() => {
      window.localStorage.setItem("dk-cookie-consent", "accepted");
      window.dispatchEvent(new Event("storage"));
    });
    expect(result.current).toBe("accepted");
  });

  it("no servidor devolve pending, para o aviso não piscar na hidratação", () => {
    expect(renderToString(<Probe />)).toContain("pending");
  });
});
