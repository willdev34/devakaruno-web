/**
 * Caminho: src/lib/services/schema.ts
 * Arquivo: schema.ts
 * Descrição: Validação (Zod) do formulário de serviço da Home: título, texto do card, ícone e mensagem do WhatsApp.
 */
import { z } from "zod";

export const serviceInputSchema = z.object({
  title: z.string().trim().min(3, "Informe o título").max(80, "Máximo de 80 caracteres"),
  text: z.string().trim().min(10, "Escreva o texto do card").max(300, "Máximo de 300 caracteres"),
  icon: z.string().trim().min(1, "Escolha o ícone"),
  whatsappMessage: z.string().trim().min(5, "Escreva a mensagem do WhatsApp").max(300, "Máximo de 300 caracteres"),
});

export type ServiceInput = z.infer<typeof serviceInputSchema>;
