/**
 * Caminho: src/lib/ads/dates.ts
 * Arquivo: dates.ts
 * Descrição: Datas dos banners no horário de Brasília. O formulário usa só a data (AAAA-MM-DD): o início vale desde 00:00 e o fim até 23:59 daquele dia.
 */
const OFFSET = "-03:00";

export function startOfDay(date: string): Date {
  return new Date(`${date}T00:00:00.000${OFFSET}`);
}

export function endOfDay(date: string): Date {
  return new Date(`${date}T23:59:59.999${OFFSET}`);
}

// Data do banco -> valor do campo de data do formulário (vazio quando não há data)
export function toDateInput(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" });
}
