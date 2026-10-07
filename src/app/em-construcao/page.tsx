/**
 * Caminho: src/app/em-construcao/page.tsx
 * Arquivo: page.tsx
 * Descrição: Página exibida enquanto o site está em construção (MAINTENANCE_MODE=true).
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Em construção | Deva Karuno Terapias",
  description: "O novo site da Deva Karuno Terapias está sendo preparado.",
  robots: { index: false, follow: false },
};

const WHATSAPP_LINK =
  "https://wa.me/5521984121612?text=Ol%C3%A1%21%20Gostaria%20de%20saber%20mais%20sobre%20as%20sess%C3%B5es%20da%20Deva%20Karuno%20Terapias.";

export default function EmConstrucaoPage() {
  return (
    <main className="min-h-[70vh] bg-dark flex items-center justify-center px-4 pt-40 pb-20">
      <div className="max-w-xl text-center">
        <h1 className="text-3xl lg:text-5xl font-semibold text-white mb-5">
          Nosso novo site está sendo preparado
        </h1>
        <p className="text-white/70 text-base lg:text-lg mb-10">
          Estamos finalizando os últimos detalhes para receber você com cuidado.
          Enquanto isso, se quiser conversar sobre as sessões, é só chamar no
          WhatsApp.
        </p>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-white text-base font-semibold bg-linear-to-r from-primary to-secondary px-8 py-4 rounded-md hover:opacity-90 transition-opacity duration-300"
        >
          Falar no WhatsApp
        </a>
      </div>
    </main>
  );
}
