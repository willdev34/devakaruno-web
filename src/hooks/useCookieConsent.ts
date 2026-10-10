/**
 * Caminho: src/hooks/useCookieConsent.ts
 * Arquivo: useCookieConsent.ts
 * Descrição: Hook que acompanha a escolha de cookies do visitante. Devolve "pending" no servidor e na hidratação para o aviso não piscar.
 */
"use client";
import { useSyncExternalStore } from "react";
import { CONSENT_EVENT, readConsent, type ConsentChoice } from "@/lib/consent";

export type ConsentState = ConsentChoice | "unset" | "pending";

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useCookieConsent(): ConsentState {
  return useSyncExternalStore<ConsentState>(subscribe, () => readConsent() ?? "unset", () => "pending");
}
