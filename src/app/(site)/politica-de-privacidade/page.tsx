/**
 * Caminho: src/app/(site)/politica-de-privacidade/page.tsx
 * Arquivo: page.tsx
 * Descrição: Página da Política de Privacidade.
 */
import { pageMetadata } from "@/lib/seo/metadata";
import HeroSub from "@/components/SharedComponent/HeroSub";
import PoliticaPrivacidade from "@/components/PoliticaPrivacidade";
import { Metadata } from "next";

export const metadata: Metadata = pageMetadata({
  title: "Política de Privacidade",
  description: "Como o site da Deva Karuno Terapias trata dados pessoais, usa cookies e respeita os direitos previstos na LGPD.",
  path: "/politica-de-privacidade",
});

const Page = () => {
  return (
    <>
      <HeroSub title="Política de Privacidade" bgImage="/images/background/hero-maos.jpg" />
      <PoliticaPrivacidade />
    </>
  );
};

export default Page;