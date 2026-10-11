/**
 * Caminho: src/lib/courses/save-course.ts
 * Arquivo: save-course.ts
 * Descrição: Caso de uso de salvar um curso: valida, impede slug repetido, monta o link do WhatsApp e cria ou atualiza com as FAQs. Sem Next nem sessão.
 */
import { courseInputSchema } from "@/lib/courses/schema";
import { whatsappLink } from "@/lib/whatsapp";
import { createCourse, isCourseSlugTaken, updateCourse } from "@/lib/repositories/admin-courses";

export type SaveCourseResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors: Record<string, string> };

const fail = (fieldErrors: Record<string, string>): SaveCourseResult => ({
  ok: false,
  error: "Revise os campos destacados.",
  fieldErrors,
});

export async function saveCourse(id: string | null, raw: unknown): Promise<SaveCourseResult> {
  const parsed = courseInputSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return fail(fieldErrors);
  }

  const { slug, whatsappMessage, faqs, ...rest } = parsed.data;
  const fields = { ...rest, whatsappLink: whatsappLink(whatsappMessage) };

  // Edição não troca o slug: o endereço do curso continua o mesmo
  if (id) {
    const course = await updateCourse(id, fields, faqs);
    return { ok: true, id: course.id };
  }

  if (await isCourseSlugTaken(slug)) return fail({ slug: "Já existe um curso com esse slug" });
  const course = await createCourse({ ...fields, slug }, faqs);
  return { ok: true, id: course.id };
}
