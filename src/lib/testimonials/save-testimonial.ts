/**
 * Caminho: src/lib/testimonials/save-testimonial.ts
 * Arquivo: save-testimonial.ts
 * Descrição: Caso de uso de salvar um depoimento: valida e cria ou atualiza. Sem Next nem sessão, para ser testável.
 */
import { testimonialInputSchema } from "@/lib/testimonials/schema";
import { createTestimonial, updateTestimonial } from "@/lib/repositories/admin-testimonials";

export type SaveTestimonialResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors: Record<string, string> };

export async function saveTestimonial(id: string | null, raw: unknown): Promise<SaveTestimonialResult> {
  const parsed = testimonialInputSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Revise os campos destacados.", fieldErrors };
  }

  const saved = id ? await updateTestimonial(id, parsed.data) : await createTestimonial(parsed.data);
  return { ok: true, id: saved.id };
}
