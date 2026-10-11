/**
 * Caminho: src/lib/ads/schema.ts
 * Arquivo: schema.ts
 * Descrição: Validação (Zod) do formulário de banner do admin: nome interno, posição, imagem, link, texto alternativo, ativo e período opcional.
 */
import { z } from "zod";
import { AD_POSITION_VALUES } from "@/lib/ads/positions";

const isHttpUrl = (value: string) => /^https?:\/\//.test(value);
const dateField = z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida")]);

export const adInputSchema = z
  .object({
    name: z.string().trim().min(2, "Informe o nome do banner").max(80, "Máximo de 80 caracteres"),
    position: z.enum(AD_POSITION_VALUES, { message: "Escolha onde o banner aparece" }),
    imageUrl: z
      .string()
      .trim()
      .min(1, "Envie a imagem do banner")
      .refine((value) => value.startsWith("/") || isHttpUrl(value), "Imagem inválida"),
    linkUrl: z
      .string()
      .trim()
      .min(1, "Informe o link do anunciante")
      .refine(isHttpUrl, "O link precisa começar com http:// ou https://"),
    altText: z.string().trim().min(2, "Descreva a imagem").max(120, "Máximo de 120 caracteres"),
    active: z.boolean(),
    startsAt: dateField,
    endsAt: dateField,
  })
  .superRefine((data, ctx) => {
    if (data.startsAt && data.endsAt && data.endsAt < data.startsAt) {
      ctx.addIssue({ code: "custom", path: ["endsAt"], message: "O fim precisa ser depois do início" });
    }
  });

export type AdInput = z.infer<typeof adInputSchema>;
