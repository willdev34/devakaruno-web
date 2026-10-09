/**
 * Caminho: src/lib/posts/schema.ts
 * Arquivo: schema.ts
 * Descrição: Validação (Zod) do formulário de artigo do admin: rascunho flexível, publicação com campos obrigatórios, slug, tags e agendamento no futuro.
 */
import { z } from "zod";

const isUrlOrPath = (value: string) => value.startsWith("/") || /^https?:\/\//.test(value);

export const postInputSchema = z
  .object({
    title: z.string().trim().min(3, "Informe o título"),
    subtitle: z.string().trim().max(200, "Máximo de 200 caracteres").optional(),
    slug: z
      .string()
      .trim()
      .min(1, "Informe o slug")
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use letras minúsculas, números e hífens"),
    // Rascunho aceita esses três vazios; para publicar ou agendar eles são exigidos (superRefine)
    excerpt: z.string().trim().max(300, "Máximo de 300 caracteres"),
    content: z.string().trim(),
    coverImage: z.string().trim(),
    tags: z
      .array(z.string().trim().min(1).max(30))
      .max(10, "Máximo de 10 tags")
      .transform((tags) => Array.from(new Set(tags))),
    // Id da categoria; vazio ou ausente = sem categoria
    categoryId: z.string().trim().optional(),
    featured: z.boolean(),
    mode: z.enum(["draft", "now", "schedule"]),
    // ISO com fuso, convertido no navegador a partir do campo de data e hora
    scheduledAt: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.mode !== "draft") {
      if (data.excerpt.length < 10) {
        ctx.addIssue({ code: "custom", path: ["excerpt"], message: "Escreva um resumo de pelo menos 10 caracteres" });
      }
      if (data.content.length < 20) {
        ctx.addIssue({ code: "custom", path: ["content"], message: "Escreva o conteúdo do artigo" });
      }
      if (!isUrlOrPath(data.coverImage)) {
        ctx.addIssue({ code: "custom", path: ["coverImage"], message: "Envie uma imagem ou informe uma URL válida" });
      }
    }
    if (data.mode !== "schedule") return;
    const date = data.scheduledAt ? new Date(data.scheduledAt) : null;
    if (!date || Number.isNaN(date.getTime()) || date <= new Date()) {
      ctx.addIssue({ code: "custom", path: ["scheduledAt"], message: "Escolha uma data e hora no futuro" });
    }
  });

export type PostInput = z.infer<typeof postInputSchema>;
