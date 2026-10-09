/**
 * Caminho: src/app/admin/cursos/[id]/page.tsx
 * Arquivo: page.tsx
 * Descrição: Tela de edição de um curso, com as FAQs carregadas e botão de excluir.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import CourseForm from "@/components/Admin/Courses/CourseForm";
import DeleteButton from "@/components/Admin/Posts/DeleteButton";
import { getAdminCourse } from "@/lib/repositories/admin-courses";
import { messageFromLink } from "@/lib/whatsapp";
import { deleteCourseAction } from "../actions";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getAdminCourse(id);
  if (!course) notFound();

  return (
    <>
      <Link href="/admin/cursos" className="text-sm text-muted hover:text-primary">← Cursos</Link>
      <div className="mb-6 mt-1 flex items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-bold">Editar curso</h1>
        <DeleteButton id={course.id} name={course.title} action={deleteCourseAction} redirectTo="/admin/cursos" />
      </div>
      <CourseForm
        courseId={course.id}
        initial={{
          title: course.title,
          slug: course.slug,
          text: course.text,
          detail: course.detail,
          modalidade: course.modalidade,
          duracao: course.duracao,
          local: course.local,
          price: course.price,
          icon: course.icon,
          bgImage: course.bgImage,
          // O link guardado traz a mensagem no parâmetro text
          whatsappMessage: messageFromLink(course.whatsappLink),
          faqs: course.faqs.map((faq) => ({ question: faq.question, answer: faq.answer })),
        }}
      />
    </>
  );
}
