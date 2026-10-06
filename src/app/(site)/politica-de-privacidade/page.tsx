/**
 * Caminho: src/app/(site)/politica-de-privacidade/page.tsx
 * Arquivo: page.tsx
 * Descrição: Página da Política de Privacidade.
 */
import HeroSub from "@/components/SharedComponent/HeroSub";
import PoliticaPrivacidade from "@/components/PoliticaPrivacidade";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | Deva Karuno Terapias",
};

const Page = () => {
  return (
    <>
      <HeroSub title="Política de Privacidade" bgImage="/images/background/hero-maos.jpg" />
      <PoliticaPrivacidade />
    </>
  );
};

export default Page;