/**
 * Caminho: src/lib/testimonials/schema.ts
 * Arquivo: schema.ts
 * Descrição: Validação (Zod) do formulário de depoimento do admin: nome do cliente, texto e destaque na Home.
 */
import { z } from "zod";

export const testimonialInputSchema = z.object({
  clientName: z.string().trim().min(2, "Informe o nome").max(80, "Máximo de 80 caracteres"),
  review: z.string().trim().min(10, "Escreva o depoimento (mínimo de 10 caracteres)").max(1200, "Máximo de 1200 caracteres"),
  featured: z.boolean(),
});

export type TestimonialInput = z.infer<typeof testimonialInputSchema>;
