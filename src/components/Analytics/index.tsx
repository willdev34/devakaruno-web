/**
 * Caminho: src/components/Analytics/index.tsx
 * Arquivo: index.tsx
 * Descrição: Carrega Google Tag Manager, Google Analytics 4 e Meta Pixel quando os códigos estão preenchidos nas configurações e o visitante aceitou os cookies. Não carrega no painel admin e confere o formato de cada código antes de colocá-lo no script.
 */
"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { TRACKING_PATTERNS } from "@/lib/settings/schema";
import { useCookieConsent } from "@/hooks/useCookieConsent";

type Props = { gtmId: string; gaId: string; metaPixelId: string };

// Só devolve o código se estiver no formato esperado
const valid = (value: string, pattern: RegExp) => (pattern.test(value) ? value : "");

export default function Analytics(props: Props) {
  const pathname = usePathname();
  const consent = useCookieConsent();
  // Sem aceite explícito nada é carregado (LGPD)
  if (consent !== "accepted") return null;
  // O painel admin não entra nas métricas
  if (pathname === "/admin" || pathname?.startsWith("/admin/")) return null;

  const gtmId = valid(props.gtmId, TRACKING_PATTERNS.gtmId);
  const gaId = valid(props.gaId, TRACKING_PATTERNS.gaId);
  const pixelId = valid(props.metaPixelId, TRACKING_PATTERNS.metaPixelId);

  return (
    <>
      {gtmId && (
        <>
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
        </>
      )}

      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      )}

      {pixelId && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src='https://connect.facebook.net/en_US/fbevents.js';s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script');fbq('init','${pixelId}');fbq('track','PageView');`}
          </Script>
        </>
      )}
    </>
  );
}
