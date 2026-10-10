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
import { SiteSettingsProvider } from "@/components/Providers/SiteSettingsProvider";
import { getSiteSettings } from "@/lib/repositories/site-settings";
import { TRACKING_PATTERNS } from "@/lib/settings/schema";
import type { Metadata } from "next";
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-heading" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-body" });
import NextTopLoader from 'nextjs-toploader';

// Verificação do Search Console (meta tag), quando o código está nas configurações do site
export async function generateMetadata(): Promise<Metadata> {
  const { searchConsoleCode } = await getSiteSettings();
  return searchConsoleCode && TRACKING_PATTERNS.searchConsoleCode.test(searchConsoleCode)
    ? { verification: { google: searchConsoleCode } }
    : {};
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Configurações do site (contato, redes e rastreamento), lidas uma vez por página
  const settings = await getSiteSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${cormorant.variable} ${dmSans.variable} font-body`}>
      <Analytics gtmId={settings.gtmId} gaId={settings.gaId} metaPixelId={settings.metaPixelId} />
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
