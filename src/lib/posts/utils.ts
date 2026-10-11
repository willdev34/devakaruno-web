/**
 * Caminho: src/lib/posts/utils.ts
 * Arquivo: utils.ts
 * Descrição: Funções puras dos artigos: slug a partir do título, tempo de leitura e regra de publicação (rascunho, agora ou agendado).
 */

// "Terapia Tântrica: mitos" -> "terapia-tantrica-mitos"
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const WORDS_PER_MINUTE = 200;

// Minutos de leitura (mínimo 1), contando palavras do texto
export function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export type PublishMode = "draft" | "now" | "schedule";

// Traduz o modo escolhido no formulário para os campos do banco
export function resolvePublication(mode: PublishMode, scheduledAt?: Date, now = new Date()) {
  if (mode === "draft") return { published: false, publishedAt: now };
  if (mode === "schedule" && scheduledAt) return { published: true, publishedAt: scheduledAt };
  return { published: true, publishedAt: now };
}

// Caminho inverso: modo do formulário a partir do post salvo
export function modeFromPost(post: { published: boolean; publishedAt: Date }, now = new Date()): PublishMode {
  if (!post.published) return "draft";
  return post.publishedAt > now ? "schedule" : "now";
}
