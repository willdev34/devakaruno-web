/**
 * Caminho: src/lib/media/format.ts
 * Arquivo: format.ts
 * Descrição: Formatação de tamanho e data das imagens para a biblioteca.
 */
// 1536 -> "1,5 KB"; 2621440 -> "2,5 MB"
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} KB`;
  return `${(kb / 1024).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} MB`;
}

// "2026-10-10T12:00:00Z" -> "10/10/2026" (vazio se a data for inválida)
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
}
