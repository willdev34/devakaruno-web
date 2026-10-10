/**
 * Caminho: src/lib/settings/defaults.ts
 * Arquivo: defaults.ts
 * Descrição: Valores padrão das configurações do site. São os dados que já estavam fixos no código e valem enquanto nada foi salvo no admin, ou se o banco não responder.
 */
import type { SiteSettingsData } from "@/lib/settings/schema";

export const DEFAULT_SETTINGS: SiteSettingsData = {
  whatsappNumber: "5521984121612",
  whatsappMessage: "Olá! Vi o site da Deva Karuno Terapias e gostaria de agendar uma sessão.",
  email: "karunodeva@gmail.com",
  address: "Centro, Rio de Janeiro - RJ",
  instagramUrl: "https://www.instagram.com/devakarunoterapias/",
  facebookUrl: "https://www.facebook.com/devakarunoterapias/",
  xUrl: "https://x.com/devakaruno",
  tiktokUrl: "https://www.tiktok.com/@deva.karuno",
  gtmId: "",
  gaId: "",
  metaPixelId: "",
  searchConsoleCode: "",
};

// Campos que nunca podem ficar vazios no site: se vierem vazios do banco, vale o padrão
const REQUIRED_KEYS = ["whatsappNumber", "whatsappMessage", "email", "address"] as const;

// Junta a linha do banco com os padrões
export function mergeSettings(row: Partial<SiteSettingsData> | null): SiteSettingsData {
  if (!row) return DEFAULT_SETTINGS;
  const merged = { ...DEFAULT_SETTINGS, ...row };
  for (const key of REQUIRED_KEYS) {
    if (!merged[key]) merged[key] = DEFAULT_SETTINGS[key];
  }
  return merged;
}
