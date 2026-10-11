/**
 * Caminho: src/lib/whatsapp.ts
 * Arquivo: whatsapp.ts
 * Descrição: Número do WhatsApp da Deva Karuno e gerador de link com mensagem pronta.
 */
export const WHATSAPP_NUMBER = "5521984121612";

// Link do WhatsApp com a mensagem já preenchida (opcional). O número vem das configurações do site;
// sem ele, vale o número padrão.
export function whatsappLink(message?: string, number: string = WHATSAPP_NUMBER): string {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// Link dos botões gerais de agendamento (topo, rodapé, chamadas), com número e mensagem das configurações
export function siteWhatsappLink(settings: { whatsappNumber: string; whatsappMessage: string }): string {
  return whatsappLink(settings.whatsappMessage, settings.whatsappNumber);
}

// Troca o número de um link wa.me já pronto (como os guardados em cursos e serviços),
// mantendo a mensagem. Links de outros endereços passam sem mudança.
export function withWhatsappNumber(link: string, number: string): string {
  return link.replace(/^(https?:\/\/wa\.me\/)\d+/, `$1${number}`);
}

// Mensagem pronta de um link wa.me ("" se não houver ou se o link for inválido)
export function messageFromLink(link: string): string {
  try {
    return new URL(link).searchParams.get("text") ?? "";
  } catch {
    return "";
  }
}
