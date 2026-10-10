/**
 * Caminho: src/lib/seo/metadata.ts
 * Arquivo: metadata.ts
 * Descrição: Monta os metadados de cada página (título, descrição, canonical, Open Graph e Twitter) de um jeito único, para nenhuma página ficar sem eles.
 */
import type { Metadata } from "next";
import { cloudinaryOgUrl } from "@/lib/cloudinary";
import { DEFAULT_OG_IMAGE, OG_SIZE, SITE_NAME } from "./site";

type PageMetadataInput = {
  // Título curto da página; o nome do site é acrescentado pelo template do layout
  title: string;
  description: string;
  // Caminho da página ("/blog"), usado no canonical e no Open Graph
  path: string;
  // Imagem de compartilhamento (URL ou caminho); sem ela vale a imagem padrão do site
  image?: string;
  // Usa o título exatamente como está, sem acrescentar o nome do site (Home)
  absoluteTitle?: boolean;
  type?: "website" | "article";
  noindex?: boolean;
  // Só para artigos
  article?: { publishedTime: string; modifiedTime?: string; section?: string; tags?: string[]; authors?: string[] };
};

// Títulos de busca passam de ~60 caracteres e são cortados; o corte limpo fica por conta de quem escreve
export function pageMetadata(input: PageMetadataInput): Metadata {
  const { title, description, path, image, absoluteTitle, type = "website", noindex, article } = input;
  const shareTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  const shareImage = image ? cloudinaryOgUrl(image) : DEFAULT_OG_IMAGE;
  const images = [{ url: shareImage, ...(image ? {} : OG_SIZE), alt: title }];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "pt_BR",
      siteName: SITE_NAME,
      title: shareTitle,
      description,
      url: path,
      images,
      ...(article ? { ...article } : {}),
    },
    twitter: { card: "summary_large_image", title: shareTitle, description, images: [shareImage] },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
