/**
 * Caminho: src/lib/settings/schema.ts
 * Arquivo: schema.ts
 * Descrição: Validação (Zod) das configurações gerais do site: contato, WhatsApp, redes sociais e códigos de rastreamento. Os códigos seguem formatos estritos porque entram em scripts da página.
 */
import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .refine((value) => value === "" || /^https?:\/\/\S+$/.test(value), "O link precisa começar com http:// ou https://");

// Aceita vazio (recurso desligado) ou o formato exato do código
const optionalCode = (pattern: RegExp, message: string) =>
  z.string().trim().refine((value) => value === "" || pattern.test(value), message);

export const siteSettingsSchema = z.object({
  whatsappNumber: z
    .string()
    .trim()
    .refine((value) => /^\d{10,15}$/.test(value.replace(/\D/g, "")), "Informe com DDI e DDD, só números (ex.: 5521999999999)"),
  whatsappMessage: z.string().trim().min(5, "Escreva a mensagem inicial").max(300, "Máximo de 300 caracteres"),
  email: z
    .string()
    .trim()
    .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), "E-mail inválido"),
  address: z.string().trim().min(3, "Informe o endereço").max(120, "Máximo de 120 caracteres"),
  instagramUrl: optionalUrl,
  facebookUrl: optionalUrl,
  xUrl: optionalUrl,
  tiktokUrl: optionalUrl,
  gtmId: optionalCode(/^GTM-[A-Z0-9]{4,10}$/, "Use o formato GTM-XXXXXXX"),
  gaId: optionalCode(/^G-[A-Z0-9]{6,12}$/, "Use o formato G-XXXXXXXXXX"),
  metaPixelId: optionalCode(/^\d{8,20}$/, "O ID do Pixel tem só números (8 a 20 dígitos)"),
  searchConsoleCode: optionalCode(/^[A-Za-z0-9_-]{20,100}$/, "Cole só o código do content=\"...\" da verificação"),
});

export type SiteSettingsData = z.infer<typeof siteSettingsSchema>;
