/**
 * Caminho: src/app/(site)/terapia-tantrica/page.tsx
 * Arquivo: page.tsx
 * Descrição: Página completa de Terapia Tântrica: conceito, práticas, benefícios, como funciona, FAQ e início do atendimento (ficha de anamnese).
 */
import HeroSub from "@/components/SharedComponent/HeroSub";
import Conceito from "@/components/TerapiaTantrica/Conceito";
import RespiracaoConsciente from "@/components/TerapiaTantrica/RespiracaoConsciente";
import MeditacaoAtiva from "@/components/TerapiaTantrica/MeditacaoAtiva";
import Beneficios from "@/components/TerapiaTantrica/Beneficios";
import ComoFunciona from "@/components/TerapiaTantrica/ComoFunciona";
import FAQ from "@/components/TerapiaTantrica/FAQ";
import AnamneseCTA from "@/components/TerapiaTantrica/AnamneseCTA";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terapia Tântrica | Deva Karuno Terapias",
};

const Page = () => {
  return (
    <>
      <HeroSub title="Terapia Tântrica" bgImage="/images/background/hero-terapia-tantrica.jpg" />
      <Conceito />
      <RespiracaoConsciente />
      <MeditacaoAtiva />
      <Beneficios />
      <ComoFunciona />
      <FAQ />
      <AnamneseCTA />
    </>
  );
};

export default Page;