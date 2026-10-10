/**
 * Caminho: src/app/sitemap.ts
 * Arquivo: sitemap.ts
 * Descrição: sitemap.xml do site, atualizado a cada hora. Se o banco não responder, publica só as páginas fixas em vez de falhar.
 */
import type { MetadataRoute } from "next";
import { getSitemapCourses } from "@/lib/repositories/courses";
import { getSitemapPosts } from "@/lib/repositories/posts";
import { buildSitemap } from "@/lib/seo/sitemap-entries";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [posts, courses] = await Promise.all([getSitemapPosts(), getSitemapCourses()]);
    return buildSitemap(posts, courses);
  } catch (error) {
    console.error("sitemap: falha ao ler o banco, publicando só as páginas fixas", error);
    return buildSitemap([], []);
  }
}
