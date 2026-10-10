/**
 * Caminho: src/lib/seo/site.ts
 * Arquivo: site.ts
 * Descrição: Constantes de SEO do site (endereço oficial, nome, textos padrão) e regras de quando o site pode ser indexado pelos buscadores.
 */
// Endereço oficial: todo canonical, sitemap e Open Graph usam este domínio, em qualquer ambiente
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.devakarunoterapias.com.br").replace(/\/+$/, "");

export const SITE_NAME = "Deva Karuno Terapias";
export const PERSON_NAME = "Deva Karuno";

export const DEFAULT_TITLE = "Terapia Tântrica no Rio de Janeiro | Deva Karuno Terapias";
export const DEFAULT_DESCRIPTION =
  "Sessões de Terapia Tântrica, cursos e vivências de autoconhecimento com Deva Karuno, no Rio de Janeiro. Respiração, presença e bem-estar. Agende pelo WhatsApp.";

// Imagem de compartilhamento padrão (gerada em src/app/opengraph-image.tsx)
export const DEFAULT_OG_IMAGE = "/opengraph-image";
export const OG_SIZE = { width: 1200, height: 630 } as const;

// URL completa a partir de um caminho ("/blog" -> "https://.../blog"); URLs completas passam sem mudança
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

// Só o ambiente de produção da Vercel (ou um servidor próprio, sem VERCEL_ENV) é indexado.
// Previews e testes ficam fora do Google para não competir com o site oficial.
export function isIndexable(env: string | undefined = process.env.VERCEL_ENV): boolean {
  return env === undefined || env === "production";
}
