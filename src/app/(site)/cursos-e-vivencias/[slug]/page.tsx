/**
 * Caminho: src/app/(site)/cursos-e-vivencias/[slug]/page.tsx
 * Arquivo: page.tsx
 * Descrição: Página de detalhe de um curso específico, buscado pelo slug.
 */
import HeroSub from "@/components/SharedComponent/HeroSub";
import CursosDetail from "@/components/Cursos/CursosDetail";
import { CursosData } from "@/app/api/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const curso = CursosData.find((item) => item.slug === slug);
  return {
    title: curso ? `${curso.title} | Deva Karuno Terapias` : "Curso não encontrado | Deva Karuno Terapias",
  };
}

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const curso = CursosData.find((item) => item.slug === slug);

  if (!curso) {
    notFound();
  }

  return (
    <>
      <HeroSub title={curso.title} bgImage={curso.bgImage} />
      <CursosDetail curso={curso} />
    </>
  );
};

export default Page;