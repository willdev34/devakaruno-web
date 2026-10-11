/**
 * Caminho: src/components/Home/WhatsAppCTA/index.tsx
 * Arquivo: index.tsx
 * Descrição: CTA de agendamento via WhatsApp, seção escura fixa, substitui UrgentDonation e Volunteer na Home.
 */
"use client";
import { siteWhatsappLink } from "@/lib/whatsapp";
import { useSiteSettings } from "@/components/Providers/SiteSettingsProvider";

const WhatsAppCTA = () => {
  const settings = useSiteSettings();

  return (
    <section className="bg-dark py-20 lg:py-28">
      <div className="container mx-auto lg:max-w-(--breakpoint-xl) px-4 text-center">
        <h2 className="text-3xl lg:text-4xl font-semibold text-white mb-5">
          Pronto para começar?
        </h2>
        <p className="text-white/70 text-base lg:max-w-60% mx-auto mb-8">
          Agende uma conversa e descubra o caminho mais adequado para o seu momento.
        </p>
        <a
          href={siteWhatsappLink(settings)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-white text-base font-semibold bg-linear-to-r from-primary to-secondary px-8 py-4 rounded-md hover:opacity-90 transition-opacity duration-300"
        >
          Agendar Sessão
        </a>
      </div>
    </section>
  );
};

export default WhatsAppCTA;