/**
 * Caminho: src/lib/courses/schema.ts
 * Arquivo: schema.ts
 * Descrição: Validação (Zod) do formulário de curso do admin: dados do curso, mensagem do WhatsApp e lista de FAQs.
 */
import { z } from "zod";

const faqSchema = z.object({
  question: z.string().trim().min(5, "Escreva a pergunta").max(200, "Máximo de 200 caracteres"),
  answer: z.string().trim().min(5, "Escreva a resposta").max(1500, "Máximo de 1500 caracteres"),
});

export const courseInputSchema = z.object({
  title: z.string().trim().min(3, "Informe o título").max(120, "Máximo de 120 caracteres"),
  slug: z
    .string()
    .trim()
    .min(3, "Informe o slug")
    .max(100, "Máximo de 100 caracteres")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use só letras minúsculas, números e hífen"),
  text: z.string().trim().min(10, "Escreva o texto do card").max(400, "Máximo de 400 caracteres"),
  detail: z.string().trim().min(20, "Escreva a descrição completa").max(4000, "Máximo de 4000 caracteres"),
  modalidade: z.string().trim().min(2, "Informe a modalidade").max(40, "Máximo de 40 caracteres"),
  duracao: z.string().trim().min(2, "Informe a duração").max(40, "Máximo de 40 caracteres"),
  local: z.string().trim().min(2, "Informe o local").max(200, "Máximo de 200 caracteres"),
  price: z.string().trim().min(1, "Informe o investimento").max(40, "Máximo de 40 caracteres"),
  icon: z.string().trim().min(1, "Escolha o ícone"),
  bgImage: z.string().trim().min(1, "Envie ou informe a imagem de fundo"),
  whatsappMessage: z.string().trim().min(5, "Escreva a mensagem do WhatsApp").max(300, "Máximo de 300 caracteres"),
  faqs: z.array(faqSchema).max(20, "Máximo de 20 perguntas"),
});

export type CourseInput = z.infer<typeof courseInputSchema>;
export type FaqInput = z.infer<typeof faqSchema>;
