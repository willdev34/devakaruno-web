/**
 * Caminho: src/lib/categories/schema.ts
 * Arquivo: schema.ts
 * Descrição: Validação (Zod) do formulário de categoria do blog: nome, slug e descrição curta.
 */
import { z } from "zod";

export const categoryInputSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome").max(40, "Máximo de 40 caracteres"),
  slug: z
    .string()
    .trim()
    .min(2, "Informe o slug")
    .max(60, "Máximo de 60 caracteres")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use só letras minúsculas, números e hífen"),
  description: z.string().trim().max(200, "Máximo de 200 caracteres"),
});

export type CategoryInput = z.infer<typeof categoryInputSchema>;
