/**
 * Caminho: src/app/(site)/cursos-e-vivencias/page.tsx
 * Arquivo: page.tsx
 * Descrição: Página de listagem de Cursos e Vivências.
 */
import JsonLd from "@/components/Seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { pageMetadata } from "@/lib/seo/metadata";
import HeroSub from "@/components/SharedComponent/HeroSub";
import CursosList from "@/components/Cursos/CursosList";
import { Metadata } from "next";

// Revalida a cada 60s para refletir mudanças nos cursos do banco
export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Cursos e Vivências de Autoconhecimento",
  description: "Cursos e vivências de autoconhecimento, respiração, meditação e relacionamentos com Deva Karuno. Veja os temas e fale pelo WhatsApp.",
  path: "/cursos-e-vivencias",
});

const Page = () => {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Cursos e Vivências", path: "/cursos-e-vivencias" }])} />
      <HeroSub title="Cursos e Vivências" bgImage="/images/background/hero-maos.jpg" />
      <CursosList />
    </>
  );
};

export default Page;