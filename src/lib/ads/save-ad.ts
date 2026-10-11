/**
 * Caminho: src/lib/ads/save-ad.ts
 * Arquivo: save-ad.ts
 * Descrição: Caso de uso de salvar um banner: valida, converte as datas do período para o horário de Brasília e cria ou atualiza. Sem Next nem sessão.
 */
import { adInputSchema } from "@/lib/ads/schema";
import { endOfDay, startOfDay } from "@/lib/ads/dates";
import { createAd, updateAd } from "@/lib/repositories/admin-ads";

export type SaveAdResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors: Record<string, string> };

export async function saveAd(id: string | null, raw: unknown): Promise<SaveAdResult> {
  const parsed = adInputSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Revise os campos destacados.", fieldErrors };
  }

  const { startsAt, endsAt, ...rest } = parsed.data;
  const data = {
    ...rest,
    startsAt: startsAt ? startOfDay(startsAt) : null,
    endsAt: endsAt ? endOfDay(endsAt) : null,
  };

  const ad = id ? await updateAd(id, data) : await createAd(data);
  return { ok: true, id: ad.id };
}
