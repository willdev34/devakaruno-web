/**
 * Caminho: src/app/(site)/contact/page.tsx
 * Arquivo: page.tsx
 * Descrição: Página de Contato. CTA de WhatsApp em destaque pra clientes, mapa com endereço real, e formulário de parceria pra propostas de colaboração.
 */
import { pageMetadata } from "@/lib/seo/metadata";
import HeroSub from "@/components/SharedComponent/HeroSub";
import ContactInfo from "@/components/Contact/ContactInfo";
import ContactForm from "@/components/Contact/Form";
import WhatsAppCTA from "@/components/Home/WhatsAppCTA";
import { Metadata } from "next";

export const metadata: Metadata = pageMetadata({
  title: "Contato e agendamento",
  description: "Fale com Deva Karuno pelo WhatsApp para agendar uma sessão de Terapia Tântrica, tirar dúvidas ou propor uma parceria.",
  path: "/contato",
});

const Page = () => {
  return (
    <>
      <HeroSub title="Contato" bgImage="/images/background/hero-maos.jpg" />
      <WhatsAppCTA />
      <ContactInfo />
      <ContactForm />
    </>
  );
};

export default Page;