/**
 * Caminho: src/app/(site)/cursos-e-vivencias/[slug]/page.tsx
 * Arquivo: page.tsx
 * Descrição: Página de detalhe de um curso específico, buscado no banco pelo slug (404 se não existir).
 */
import { pageMetadata } from "@/lib/seo/metadata";
import HeroSub from "@/components/SharedComponent/HeroSub";
import CursosDetail from "@/components/Cursos/CursosDetail";
import { getCourseBySlug } from "@/lib/repositories/courses";
import { getSiteSettings } from "@/lib/repositories/site-settings";
import { withWhatsappNumber } from "@/lib/whatsapp";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// Revalida a cada 60s para refletir mudanças nos cursos do banco
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const curso = await getCourseBySlug(slug);
  if (!curso) return { title: "Curso não encontrado", robots: { index: false, follow: false } };

  return pageMetadata({
    title: curso.title,
    description: curso.text,
    path: `/cursos-e-vivencias/${curso.slug}`,
    image: curso.bgImage,
  });
}

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const curso = await getCourseBySlug(slug);

  if (!curso) {
    notFound();
  }

  // O número vem das configurações do site; o link do curso só guarda a mensagem
  const { whatsappNumber } = await getSiteSettings();

  return (
    <>
      <HeroSub title={curso.title} bgImage={curso.bgImage} />
      <CursosDetail curso={{ ...curso, whatsappLink: withWhatsappNumber(curso.whatsappLink, whatsappNumber) }} />
    </>
  );
};

export default Page;