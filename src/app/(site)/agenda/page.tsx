/**
 * Caminho: src/app/(site)/agenda/page.tsx
 * Arquivo: page.tsx
 * Descrição: Página pública Agenda: cidades e datas dos atendimentos fora do Rio de Janeiro, com CTA de reserva pelo WhatsApp.
 */
import type { Metadata } from "next";
import HeroSub from "@/components/SharedComponent/HeroSub";
import WhatsAppCTA from "@/components/Home/WhatsAppCTA";
import AgendaSection from "@/components/Agenda/AgendaSection";
import { getUpcomingAgenda } from "@/lib/repositories/agenda";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Agenda | Deva Karuno Terapias",
  description: "Veja as cidades e datas em que a Deva Karuno atende fora do Rio de Janeiro e reserve seu horário pelo WhatsApp.",
};

export default async function AgendaPage() {
  const events = await getUpcomingAgenda();

  return (
    <>
      <HeroSub title="Agenda" bgImage="/images/background/hero-maos.jpg" />
      <AgendaSection events={events} />
      <WhatsAppCTA />
    </>
  );
}
