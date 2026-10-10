/**
 * Caminho: src/app/(site)/agenda/page.tsx
 * Arquivo: page.tsx
 * Descrição: Página pública Agenda: cidades e datas dos atendimentos fora do Rio de Janeiro, com CTA de reserva pelo WhatsApp.
 */
import JsonLd from "@/components/Seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import HeroSub from "@/components/SharedComponent/HeroSub";
import WhatsAppCTA from "@/components/Home/WhatsAppCTA";
import AgendaSection from "@/components/Agenda/AgendaSection";
import { getUpcomingAgenda } from "@/lib/repositories/agenda";
import { getSiteSettings } from "@/lib/repositories/site-settings";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Agenda de atendimentos",
  description: "Veja as cidades e datas em que a Deva Karuno atende fora do Rio de Janeiro e reserve seu horário pelo WhatsApp.",
  path: "/agenda",
});

export default async function AgendaPage() {
  const [events, { whatsappNumber }] = await Promise.all([getUpcomingAgenda(), getSiteSettings()]);

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Agenda", path: "/agenda" }])} />
      <HeroSub title="Agenda" bgImage="/images/background/hero-maos.jpg" />
      <AgendaSection events={events} whatsappNumber={whatsappNumber} />
      <WhatsAppCTA />
    </>
  );
}
