/**
 * Caminho: src/lib/consent.ts
 * Arquivo: consent.ts
 * Descrição: Guarda a escolha do visitante sobre cookies de análise e marketing (aceitar ou recusar) no navegador, sem depender do servidor.
 */
export const CONSENT_KEY = "dk-cookie-consent";
// Evento próprio para avisar a mesma aba quando a escolha muda (o evento "storage" só chega nas outras abas)
export const CONSENT_EVENT = "dk-consent-change";

export type ConsentChoice = "accepted" | "rejected";

// Lê a escolha salva; null quando o visitante ainda não escolheu (ou o navegador bloqueia o armazenamento)
export function readConsent(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "accepted" || value === "rejected" ? value : null;
  } catch {
    return null;
  }
}

function notify() {
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function saveConsent(choice: ConsentChoice): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // Sem armazenamento, a escolha vale só até recarregar a página
  }
  notify();
}

// Apaga a escolha: o aviso volta a aparecer
export function clearConsent(): void {
  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    // Nada a fazer
  }
  notify();
}
