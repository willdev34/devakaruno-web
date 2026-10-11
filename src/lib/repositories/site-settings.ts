/**
 * Caminho: src/lib/repositories/site-settings.ts
 * Arquivo: site-settings.ts
 * Descrição: Leitura e gravação das configurações gerais do site. A leitura nunca falha: se o banco não responder ou ainda não houver linha, devolve os valores padrão.
 */
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { mergeSettings } from "@/lib/settings/defaults";
import type { SiteSettingsData } from "@/lib/settings/schema";

const SETTINGS_ID = "main";

// Configurações atuais (uma consulta por página renderizada, mesmo com vários componentes pedindo)
export const getSiteSettings = cache(async (): Promise<SiteSettingsData> => {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { id: SETTINGS_ID } });
    return mergeSettings(row);
  } catch (error) {
    // Configuração é secundária: o site segue com os padrões em vez de cair
    console.error("getSiteSettings:", error);
    return mergeSettings(null);
  }
});

// Cria a linha única no primeiro salvamento e atualiza nos seguintes
export function saveSiteSettings(data: SiteSettingsData) {
  return prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    create: { id: SETTINGS_ID, ...data },
    update: data,
  });
}
