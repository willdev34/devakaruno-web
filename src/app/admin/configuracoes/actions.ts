/**
 * Caminho: src/app/admin/configuracoes/actions.ts
 * Arquivo: actions.ts
 * Descrição: Server Action das configurações do site: confere o admin, salva e atualiza todas as páginas, já que contato e rastreamento aparecem no site inteiro.
 */
"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-session";
import { saveSettings, type SaveSettingsResult } from "@/lib/settings/save-settings";

export async function saveSettingsAction(raw: unknown): Promise<SaveSettingsResult> {
  await requireAdmin();
  const result = await saveSettings(raw);
  if (result.ok) {
    // Layout raiz: rodapé, topo, rastreamento e botões de WhatsApp de todas as páginas
    revalidatePath("/", "layout");
  }
  return result;
}
