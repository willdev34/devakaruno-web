/**
 * Caminho: src/lib/repositories/admin-courses.ts
 * Arquivo: admin-courses.ts
 * Descrição: Acesso do painel admin aos cursos: listagem com total de FAQs, leitura, checagem de slug, criação, edição (FAQs trocadas juntas) e exclusão.
 */
import { prisma } from "@/lib/prisma";

export type CourseFields = {
  icon: string;
  bgImage: string;
  title: string;
  text: string;
  detail: string;
  modalidade: string;
  duracao: string;
  local: string;
  price: string;
  whatsappLink: string;
};

export type FaqFields = { question: string; answer: string };

// Mesma ordem do site (criação); o total de FAQs aparece na listagem
export function listAdminCourses() {
  return prisma.course.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { faqs: true } } },
  });
}

export function getAdminCourse(id: string) {
  return prisma.course.findUnique({
    where: { id },
    include: { faqs: { orderBy: { order: "asc" } } },
  });
}

// Slug já usado por outro curso? (excludeId ignora o próprio curso na edição)
export async function isCourseSlugTaken(slug: string, excludeId?: string | null) {
  const found = await prisma.course.findUnique({ where: { slug }, select: { id: true } });
  return Boolean(found && found.id !== excludeId);
}

// FAQs numeradas na ordem recebida
const numbered = (faqs: FaqFields[]) => faqs.map((faq, index) => ({ ...faq, order: index + 1 }));

// Curso e FAQs criados na mesma operação
export function createCourse(data: CourseFields & { slug: string }, faqs: FaqFields[]) {
  return prisma.course.create({ data: { ...data, faqs: { create: numbered(faqs) } } });
}

// Atualiza o curso e troca todas as FAQs, numa transação. O slug não muda depois de criado
export async function updateCourse(id: string, data: CourseFields, faqs: FaqFields[]) {
  const [course] = await prisma.$transaction([
    prisma.course.update({ where: { id }, data }),
    prisma.courseFaq.deleteMany({ where: { courseId: id } }),
    prisma.courseFaq.createMany({ data: numbered(faqs).map((faq) => ({ ...faq, courseId: id })) }),
  ]);
  return course;
}

// As FAQs saem junto (cascade no banco)
export function deleteCourse(id: string) {
  return prisma.course.delete({ where: { id } });
}
