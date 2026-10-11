/**
 * Caminho: src/components/Consent/CookieBanner.tsx
 * Arquivo: CookieBanner.tsx
 * Descrição: Aviso de cookies no rodapé da tela. Só aparece quando o site usa rastreamento, ainda não há escolha e fora do painel admin. Aceitar e recusar têm o mesmo destaque.
 */
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { saveConsent } from "@/lib/consent";

type Props = {
  // true quando há GTM, GA4 ou Pixel válido nas configurações; sem rastreamento não há o que pedir
  enabled: boolean;
};

const button =
  "rounded-md border border-primary px-5 py-2.5 text-sm font-semibold transition-colors duration-300";

export default function CookieBanner({ enabled }: Props) {
  const pathname = usePathname();
  const consent = useCookieConsent();

  const inAdmin = pathname === "/admin" || pathname?.startsWith("/admin/");
  if (!enabled || inAdmin || consent !== "unset") return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-dark sm:p-5"
    >
      <div className="container mx-auto flex flex-col gap-4 lg:max-w-(--breakpoint-xl) lg:flex-row lg:items-center lg:justify-between">
        <div className="text-sm leading-relaxed text-dustGray dark:text-white/70">
          <p id="cookie-banner-title" className="mb-1 text-base font-semibold text-midnight_text dark:text-white">
            Cookies neste site
          </p>
          <p>
            Usamos cookies de análise e de marketing para entender como o site é usado e melhorar o conteúdo. Eles só são ativados se você aceitar.
            Saiba mais na{" "}
            <Link href="/politica-de-privacidade" className="text-primary hover:text-secondary">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button type="button" onClick={() => saveConsent("rejected")} className={`${button} bg-transparent text-primary hover:bg-primary/10`}>
            Recusar
          </button>
          <button type="button" onClick={() => saveConsent("accepted")} className={`${button} bg-primary text-white hover:bg-darkprimary`}>
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
