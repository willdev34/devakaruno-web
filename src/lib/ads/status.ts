/**
 * Caminho: src/lib/ads/status.ts
 * Arquivo: status.ts
 * Descrição: Situação de um banner para o painel: desativado, agendado, encerrado ou no ar.
 */
export type AdStatus = "inactive" | "scheduled" | "expired" | "live";

export const AD_STATUS_LABEL: Record<AdStatus, string> = {
  inactive: "Desativado",
  scheduled: "Agendado",
  expired: "Encerrado",
  live: "No ar",
};

type Timing = { active: boolean; startsAt: Date | null; endsAt: Date | null };

export function adStatus(ad: Timing, now = new Date()): AdStatus {
  if (!ad.active) return "inactive";
  if (ad.startsAt && ad.startsAt > now) return "scheduled";
  if (ad.endsAt && ad.endsAt < now) return "expired";
  return "live";
}
