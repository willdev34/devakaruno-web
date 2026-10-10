/**
 * Caminho: src/lib/settings/save-settings.ts
 * Arquivo: save-settings.ts
 * Descrição: Caso de uso de salvar as configurações do site: valida, deixa o número do WhatsApp só com dígitos e grava. Sem Next nem sessão, para ser testável.
 */
import { siteSettingsSchema } from "@/lib/settings/schema";
import { saveSiteSettings } from "@/lib/repositories/site-settings";

export type SaveSettingsResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors: Record<string, string> };

export async function saveSettings(raw: unknown): Promise<SaveSettingsResult> {
  const parsed = siteSettingsSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Revise os campos destacados.", fieldErrors };
  }

  await saveSiteSettings({ ...parsed.data, whatsappNumber: parsed.data.whatsappNumber.replace(/\D/g, "") });
  return { ok: true };
}
