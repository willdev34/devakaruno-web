/**
 * Caminho: src/app/admin/cursos/page.tsx
 * Arquivo: page.tsx
 * Descrição: Listagem de cursos do admin: título, modalidade, investimento, total de FAQs e ações (ver no site, editar, excluir).
 */
import Link from "next/link";
import { listAdminCourses } from "@/lib/repositories/admin-courses";
import DeleteButton from "@/components/Admin/Posts/DeleteButton";
import { btnPrimary } from "@/components/Admin/styles";
import { deleteCourseAction } from "./actions";

export default async function AdminCoursesPage() {
  const courses = await listAdminCourses();

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">Cursos e vivências</h1>
          <p className="mt-1 text-sm text-muted">{courses.length} curso(s), na ordem em que foram criados</p>
        </div>
        <Link href="/admin/cursos/novo" className={btnPrimary}>+ Novo curso</Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-black/5 bg-white shadow-sm">
        {courses.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-muted">Nenhum curso cadastrado ainda.</p>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-black/5 text-[11px] uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-3">Curso</th>
                <th className="px-3 py-3">Modalidade</th>
                <th className="px-3 py-3">Investimento</th>
                <th className="px-3 py-3">FAQs</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {courses.map((course) => (
                <tr key={course.id}>
                  <td className="px-5 py-4 font-medium">{course.title}</td>
                  <td className="px-3 py-4 text-muted">{course.modalidade}</td>
                  <td className="px-3 py-4">{course.price}</td>
                  <td className="px-3 py-4 text-muted">{course._count.faqs}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-4">
                      <Link href={`/cursos-e-vivencias/${course.slug}`} target="_blank" className="text-sm font-medium text-muted hover:underline">Ver no site</Link>
                      <Link href={`/admin/cursos/${course.id}`} className="text-sm font-medium text-primary hover:underline">Editar</Link>
                      <DeleteButton id={course.id} name={course.title} action={deleteCourseAction} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
