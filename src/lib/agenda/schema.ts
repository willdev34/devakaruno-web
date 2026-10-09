/**
 * Caminho: src/lib/agenda/schema.ts
 * Arquivo: schema.ts
 * Descrição: Validação (Zod) do formulário de agenda do admin: cidade, UF, local, endereço, período (fim não antes do início) e publicação.
 */
import { z } from "zod";

const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Informe a data");

export const agendaInputSchema = z
  .object({
    city: z.string().trim().min(2, "Informe a cidade"),
    state: z
      .string()
      .trim()
      .toUpperCase()
      .refine((value) => value === "" || /^[A-Z]{2}$/.test(value), "Use a sigla com 2 letras (ex: SP)"),
    venue: z.string().trim().min(2, "Informe o local de atendimento"),
    address: z.string().trim().max(200, "Máximo de 200 caracteres"),
    startDate: day,
    endDate: day,
    description: z.string().trim().max(500, "Máximo de 500 caracteres"),
    published: z.boolean(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    path: ["endDate"],
    message: "A data final não pode ser antes da inicial",
  });

export type AgendaInput = z.infer<typeof agendaInputSchema>;
