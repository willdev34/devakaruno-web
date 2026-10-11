/**
 * Caminho: src/components/Consent/CookiePreferencesButton.tsx
 * Arquivo: CookiePreferencesButton.tsx
 * Descrição: Botão da Política de Privacidade para o visitante rever a escolha de cookies. Se havia aceitado, recarrega a página para os scripts pararem.
 */
"use client";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { clearConsent } from "@/lib/consent";

export default function CookiePreferencesButton() {
  const consent = useCookieConsent();

  function handleClick() {
    const hadAccepted = consent === "accepted";
    clearConsent();
    // Scripts já carregados só param com um novo carregamento da página
    if (hadAccepted) window.location.reload();
  }

  const status =
    consent === "accepted" ? "Você aceitou os cookies de análise e marketing." : consent === "rejected" ? "Você recusou os cookies de análise e marketing." : "Você ainda não fez uma escolha.";

  return (
    <div className="mt-4 rounded-lg border border-black/10 p-4 dark:border-white/10">
      <p className="mb-3 text-sm text-dustGray dark:text-white/70">{status}</p>
      <button
        type="button"
        onClick={handleClick}
        className="rounded-md border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors duration-300 hover:bg-primary/10"
      >
        Alterar minha escolha
      </button>
    </div>
  );
}
