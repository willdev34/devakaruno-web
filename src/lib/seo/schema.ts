/**
 * Caminho: src/lib/seo/schema.ts
 * Arquivo: schema.ts
 * Descrição: Montagem dos dados estruturados (Schema.org, JSON-LD): empresa local, site, artigo, curso, serviço, pessoa e trilha de navegação. Funções puras, sem acesso a banco.
 */
import type { SiteSettingsData } from "@/lib/settings/schema";
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, PERSON_NAME, SITE_NAME, SITE_URL, absoluteUrl } from "./site";

export type JsonLdNode = Record<string, unknown>;

// Identificadores fixos para as entidades se referenciarem entre si
const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const PERSON_ID = `${SITE_URL}/#person`;

// "Centro, Rio de Janeiro - RJ" -> rua "Centro", cidade "Rio de Janeiro", estado "RJ".
// Texto fora desse padrão vira só o endereço de rua.
export function parseAddress(text: string): { streetAddress: string; addressLocality?: string; addressRegion?: string } {
  const match = text.match(/^(?:(.*),\s*)?([^,]+?)\s*-\s*([A-Z]{2})\s*$/);
  if (!match) return { streetAddress: text };
  const [, street, city, state] = match;
  return { streetAddress: street ?? city, addressLocality: city, addressRegion: state };
}

// "5521984121612" -> "+5521984121612"
const phoneOf = (number: string) => (number ? `+${number.replace(/\D/g, "")}` : undefined);

const socialLinks = (s: SiteSettingsData) => [s.instagramUrl, s.facebookUrl, s.xUrl, s.tiktokUrl].filter(Boolean);

// Empresa local e a pessoa responsável, com os contatos vindos das configurações do site
export function organizationSchema(settings: SiteSettingsData): JsonLdNode {
  const sameAs = socialLinks(settings);
  return {
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    logo: absoluteUrl("/images/logo/logo.svg"),
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    telephone: phoneOf(settings.whatsappNumber),
    email: settings.email || undefined,
    address: { "@type": "PostalAddress", addressCountry: "BR", ...parseAddress(settings.address) },
    areaServed: { "@type": "City", name: "Rio de Janeiro" },
    founder: { "@id": PERSON_ID },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function personSchema(settings: SiteSettingsData): JsonLdNode {
  const sameAs = socialLinks(settings);
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: PERSON_NAME,
    jobTitle: "Terapeuta tântrico",
    url: absoluteUrl("/quem-e-o-karuno"),
    image: absoluteUrl("/images/sobre/perfil-deva-karuno-2026.jpg"),
    worksFor: { "@id": ORG_ID },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function websiteSchema(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "pt-BR",
    publisher: { "@id": ORG_ID },
  };
}

// Tudo que vale para o site inteiro, em um único bloco
export function siteGraph(settings: SiteSettingsData): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationSchema(settings), personSchema(settings), websiteSchema()],
  };
}

export type Crumb = { name: string; path: string };

// Trilha de navegação: o primeiro item é sempre a Home
export function breadcrumbSchema(crumbs: Crumb[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Início", path: "/" }, ...crumbs].map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

type PostInput = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  date: string;
  updatedAt: string;
  tags: string[];
  category?: { name: string } | null;
};

export function blogPostingSchema(post: PostInput): JsonLdNode {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: post.title.slice(0, 110),
    description: post.excerpt,
    image: [absoluteUrl(post.coverImage)],
    datePublished: post.date,
    dateModified: post.updatedAt,
    inLanguage: "pt-BR",
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
    ...(post.category ? { articleSection: post.category.name } : {}),
    ...(post.tags.length > 0 ? { keywords: post.tags.join(", ") } : {}),
  };
}

type CourseInput = { slug: string; title: string; text: string; bgImage: string };

export function courseSchema(course: CourseInput): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.text,
    url: absoluteUrl(`/cursos-e-vivencias/${course.slug}`),
    image: absoluteUrl(course.bgImage),
    inLanguage: "pt-BR",
    provider: { "@id": ORG_ID },
  };
}

// A terapia como serviço prestado na cidade do Rio de Janeiro
export function therapyServiceSchema(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Terapia Tântrica",
    serviceType: "Terapia Tântrica",
    description:
      "Sessões individuais de Terapia Tântrica voltadas ao autoconhecimento, à respiração, à presença no corpo e ao bem-estar, com atendimento profissional.",
    url: absoluteUrl("/terapia-tantrica"),
    areaServed: { "@type": "City", name: "Rio de Janeiro" },
    provider: { "@id": ORG_ID },
  };
}

// Serializa para dentro de <script>: o "<" é escapado para o conteúdo nunca fechar a tag
export function serializeJsonLd(data: JsonLdNode): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
