/**
 * Caminho: src/app/(site)/quem-e-o-karuno/page.tsx
 * Arquivo: page.tsx
 * Descrição: Página Quem é o Karuno, com biografia, formação/credenciais, depoimentos e CTA de agendamento.
 */
import HeroSub from "@/components/SharedComponent/HeroSub";
import Bio from "@/components/QuemEOKaruno/Bio";
import Formacao from "@/components/QuemEOKaruno/Formacao";
import Depoimentos from "@/components/QuemEOKaruno/Depoimentos";
import WhatsAppCTA from "@/components/Home/WhatsAppCTA";
import { Metadata } from "next";

// Revalida a cada 60s para refletir mudanças nos depoimentos do banco
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Quem é o Karuno | Deva Karuno Terapias",
};

const Page = () => {
  return (
    <>
      <HeroSub
        title="Quem é o Karuno"
        bgImage="/images/background/hero-maos.jpg"
      />
      <Bio />
      <Formacao />
      <Depoimentos />
      <WhatsAppCTA />
    </>
  );
};

export default Page;