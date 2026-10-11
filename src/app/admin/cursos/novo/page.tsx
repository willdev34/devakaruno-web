/**
 * Caminho: src/app/admin/cursos/novo/page.tsx
 * Arquivo: page.tsx
 * Descrição: Tela de novo curso do admin, com ícone padrão e mensagem de WhatsApp inicial.
 */
import Link from "next/link";
import CourseForm from "@/components/Admin/Courses/CourseForm";
import { ICON_OPTIONS } from "@/lib/courses/icons";

export default function NewCoursePage() {
  return (
    <>
      <Link href="/admin/cursos" className="text-sm text-muted hover:text-primary">← Cursos</Link>
      <h1 className="mb-6 mt-1 font-heading text-3xl font-bold">Novo curso</h1>
      <CourseForm
        courseId={null}
        initial={{
          title: "",
          slug: "",
          text: "",
          detail: "",
          modalidade: "",
          duracao: "",
          local: "",
          price: "",
          icon: ICON_OPTIONS[0].value,
          bgImage: "",
          whatsappMessage: "Olá! Vi o site da Deva Karuno Terapias e gostaria de saber mais sobre o curso ",
          faqs: [],
        }}
      />
    </>
  );
}
