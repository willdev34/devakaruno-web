/**
 * Caminho: src/app/(site)/cursos-e-vivencias/page.tsx
 * Arquivo: page.tsx
 * Descrição: Página de listagem de Cursos e Vivências.
 */
import HeroSub from "@/components/SharedComponent/HeroSub";
import CursosList from "@/components/Cursos/CursosList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cursos e Vivências | Deva Karuno Terapias",
};

const Page = () => {
  return (
    <>
      <HeroSub title="Cursos e Vivências" bgImage="/images/background/hero-maos.jpg" />
      <CursosList />
    </>
  );
};

export default Page;