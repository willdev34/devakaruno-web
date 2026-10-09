/**
 * Caminho: src/lib/whatsapp.ts
 * Arquivo: whatsapp.ts
 * Descrição: Número do WhatsApp da Deva Karuno e gerador de link com mensagem pronta.
 */
export const WHATSAPP_NUMBER = "5521984121612";

// Link do WhatsApp com a mensagem já preenchida (opcional)
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// Mensagem pronta de um link wa.me ("" se não houver ou se o link for inválido)
export function messageFromLink(link: string): string {
  try {
    return new URL(link).searchParams.get("text") ?? "";
  } catch {
    return "";
  }
}
