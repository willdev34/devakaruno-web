/**
 * Caminho: src/lib/seo/sitemap-entries.ts
 * Arquivo: sitemap-entries.ts
 * Descrição: Monta a lista de URLs do sitemap: páginas fixas, artigos publicados e cursos. Se o banco falhar, devolve só as páginas fixas.
 */
import type { MetadataRoute } from "next";
import { absoluteUrl } from "./site";

export type SitemapPost = { slug: string; updatedAt: Date };
export type SitemapCourse = { slug: string; updatedAt: Date };

type Entry = MetadataRoute.Sitemap[number];

// Páginas fixas e o peso relativo de cada uma
const STATIC_PAGES: { path: string; priority: number; changeFrequency: Entry["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/terapia-tantrica", priority: 0.9, changeFrequency: "monthly" },
  { path: "/quem-e-o-karuno", priority: 0.7, changeFrequency: "monthly" },
  { path: "/cursos-e-vivencias", priority: 0.8, changeFrequency: "weekly" },
  { path: "/agenda", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.8, changeFrequency: "daily" },
  { path: "/contato", priority: 0.6, changeFrequency: "yearly" },
  { path: "/politica-de-privacidade", priority: 0.2, changeFrequency: "yearly" },
];

export function buildSitemap(posts: SitemapPost[], courses: SitemapCourse[]): MetadataRoute.Sitemap {
  return [
    ...STATIC_PAGES.map(({ path, priority, changeFrequency }): Entry => ({ url: absoluteUrl(path), priority, changeFrequency })),
    ...courses.map((course): Entry => ({
      url: absoluteUrl(`/cursos-e-vivencias/${course.slug}`),
      lastModified: course.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    })),
    ...posts.map((post): Entry => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    })),
  ];
}
