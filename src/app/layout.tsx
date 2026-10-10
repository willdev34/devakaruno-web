import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import SiteChrome from "@/components/Layout/SiteChrome";
import { ThemeProvider } from "next-themes";
import ScrollToTop from '@/components/ScrollToTop';
import Aoscompo from "@/utils/aos";
import SessionProviderComp from "@/components/nextauth/SessionProvider";
import { AuthDialogProvider } from "./context/AuthDialogContext";
import Analytics from "@/components/Analytics";
import CookieBanner from "@/components/Consent/CookieBanner";
import { hasTracking } from "@/lib/settings/tracking";
import { SiteSettingsProvider } from "@/components/Providers/SiteSettingsProvider";
import { getSiteSettings } from "@/lib/repositories/site-settings";
import { TRACKING_PATTERNS } from "@/lib/settings/schema";
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, DEFAULT_TITLE, OG_SIZE, PERSON_NAME, SITE_NAME, SITE_URL, isIndexable } from "@/lib/seo/site";
import type { Metadata } from "next";
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-heading" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-body" });
import NextTopLoader from 'nextjs-toploader';

// Metadados padrão de todas as páginas (cada página sobrescreve o que precisar) e verificação do Search Console
export async function generateMetadata(): Promise<Metadata> {
  const { searchConsoleCode } = await getSiteSettings();
  const verified = searchConsoleCode && TRACKING_PATTERNS.searchConsoleCode.test(searchConsoleCode);

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: DEFAULT_TITLE, template: `%s | ${SITE_NAME}` },
    description: DEFAULT_DESCRIPTION,
    applicationName: SITE_NAME,
    authors: [{ name: PERSON_NAME }],
    creator: PERSON_NAME,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: SITE_NAME,
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      url: "/",
      images: [{ url: DEFAULT_OG_IMAGE, ...OG_SIZE, alt: SITE_NAME }],
    },
    twitter: { card: "summary_large_image", title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, images: [DEFAULT_OG_IMAGE] },
    // Previews e testes nunca entram no Google
    robots: isIndexable()
      ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } }
      : { index: false, follow: false },
    ...(verified ? { verification: { google: searchConsoleCode } } : {}),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Configurações do site (contato, redes e rastreamento), lidas uma vez por página
  const settings = await getSiteSettings();

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${cormorant.variable} ${dmSans.variable} font-body`}>
      <Analytics gtmId={settings.gtmId} gaId={settings.gaId} metaPixelId={settings.metaPixelId} />
      <CookieBanner enabled={hasTracking(settings)} />
      <NextTopLoader color="#FF4D7E" />
        <SiteSettingsProvider value={settings}>
        <AuthDialogProvider>
      <SessionProviderComp>
        <ThemeProvider
          attribute="class"
          enableSystem={true}
          defaultTheme="system"
        >
          <Aoscompo>
            <SiteChrome><Header /></SiteChrome>
            
            {children}
            
            <SiteChrome><Footer /></SiteChrome>
          </Aoscompo>
          <ScrollToTop />
        </ThemeProvider>
        </SessionProviderComp>
        </AuthDialogProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
