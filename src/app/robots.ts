/**
 * Caminho: src/app/robots.ts
 * Arquivo: robots.ts
 * Descrição: robots.txt do site. Em produção libera tudo, menos painel e API, e aponta o sitemap. Em Preview e testes bloqueia tudo.
 */
import type { MetadataRoute } from "next";
import { SITE_URL, isIndexable } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
