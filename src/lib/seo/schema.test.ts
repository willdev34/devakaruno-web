/**
 * Caminho: src/lib/seo/schema.test.ts
 * Arquivo: schema.test.ts
 * Descrição: Testes dos dados estruturados: empresa local com contatos das configurações, artigo, curso, serviço, trilha de navegação e proteção do JSON no HTML.
 */
import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS } from "@/lib/settings/defaults";
import {
  blogPostingSchema,
  breadcrumbSchema,
  courseSchema,
  organizationSchema,
  parseAddress,
  personSchema,
  serializeJsonLd,
  siteGraph,
  therapyServiceSchema,
  websiteSchema,
} from "./schema";
import { SITE_URL } from "./site";

describe("parseAddress", () => {
  it("separa rua, cidade e estado", () => {
    expect(parseAddress("Centro, Rio de Janeiro - RJ")).toEqual({ streetAddress: "Centro", addressLocality: "Rio de Janeiro", addressRegion: "RJ" });
    expect(parseAddress("Rua A, 10, Centro, Niterói - RJ")).toEqual({ streetAddress: "Rua A, 10, Centro", addressLocality: "Niterói", addressRegion: "RJ" });
  });

  it("só cidade e estado: a cidade também vira o endereço de rua", () => {
    expect(parseAddress("São Paulo - SP")).toEqual({ streetAddress: "São Paulo", addressLocality: "São Paulo", addressRegion: "SP" });
  });

  it("texto fora do padrão vira só endereço de rua", () => {
    expect(parseAddress("Atendo em domicílio")).toEqual({ streetAddress: "Atendo em domicílio" });
  });
});

describe("organizationSchema", () => {
  it("usa contatos e redes das configurações", () => {
    const org = organizationSchema(DEFAULT_SETTINGS) as Record<string, unknown>;

    expect(org["@type"]).toEqual(["LocalBusiness", "ProfessionalService"]);
    expect(org["@id"]).toBe(`${SITE_URL}/#organization`);
    expect(org.telephone).toBe("+5521984121612");
    expect(org.email).toBe("karunodeva@gmail.com");
    expect(org.address).toMatchObject({ addressLocality: "Rio de Janeiro", addressRegion: "RJ", addressCountry: "BR" });
    expect(org.sameAs).toHaveLength(4);
  });

  it("omite redes em branco e contatos vazios, sem deixar campos vazios", () => {
    const org = organizationSchema({ ...DEFAULT_SETTINGS, instagramUrl: "", facebookUrl: "", xUrl: "", tiktokUrl: "", whatsappNumber: "", email: "" }) as Record<string, unknown>;

    expect(org).not.toHaveProperty("sameAs");
    expect(org.telephone).toBeUndefined();
    expect(org.email).toBeUndefined();
  });

  it("não inventa avaliações nem horários", () => {
    const text = JSON.stringify(organizationSchema(DEFAULT_SETTINGS));

    expect(text).not.toMatch(/aggregateRating|review|openingHours|priceRange/);
  });
});

describe("siteGraph", () => {
  it("reúne empresa, pessoa e site, ligados entre si", () => {
    const graph = siteGraph(DEFAULT_SETTINGS) as { "@context": string; "@graph": Record<string, unknown>[] };

    expect(graph["@context"]).toBe("https://schema.org");
    expect(graph["@graph"].map((n) => n["@type"])).toEqual([["LocalBusiness", "ProfessionalService"], "Person", "WebSite"]);
    expect(graph["@graph"][0].founder).toEqual({ "@id": `${SITE_URL}/#person` });
    expect(websiteSchema().publisher).toEqual({ "@id": `${SITE_URL}/#organization` });
    expect(websiteSchema().inLanguage).toBe("pt-BR");
  });

  it("a pessoa leva as redes e a página de apresentação", () => {
    const person = personSchema(DEFAULT_SETTINGS) as Record<string, unknown>;

    expect(person.url).toBe(`${SITE_URL}/quem-e-o-karuno`);
    expect(person.sameAs).toHaveLength(4);
    expect(personSchema({ ...DEFAULT_SETTINGS, instagramUrl: "", facebookUrl: "", xUrl: "", tiktokUrl: "" })).not.toHaveProperty("sameAs");
  });
});

describe("breadcrumbSchema", () => {
  it("começa na Home e numera as posições com URLs completas", () => {
    const list = breadcrumbSchema([{ name: "Blog", path: "/blog" }, { name: "Paz", path: "/blog/paz" }]) as { itemListElement: Record<string, unknown>[] };

    expect(list.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Início", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: "Paz", item: `${SITE_URL}/blog/paz` },
    ]);
  });
});

describe("blogPostingSchema", () => {
  const post = {
    slug: "paz",
    title: "Paz interior",
    excerpt: "Resumo",
    coverImage: "https://res.cloudinary.com/c/image/upload/v1/capa.jpg",
    date: "2026-06-10T12:00:00.000Z",
    updatedAt: "2026-06-12T12:00:00.000Z",
    tags: ["calma", "respiração"],
    category: { name: "Autoconhecimento" },
  };

  it("traz título, datas, imagem, autor, editora, seção e palavras-chave", () => {
    const article = blogPostingSchema(post) as Record<string, unknown>;

    expect(article["@type"]).toBe("BlogPosting");
    expect(article.headline).toBe("Paz interior");
    expect(article.datePublished).toBe(post.date);
    expect(article.dateModified).toBe(post.updatedAt);
    expect(article.image).toEqual([post.coverImage]);
    expect(article.author).toEqual({ "@id": `${SITE_URL}/#person` });
    expect(article.mainEntityOfPage).toEqual({ "@type": "WebPage", "@id": `${SITE_URL}/blog/paz` });
    expect(article.articleSection).toBe("Autoconhecimento");
    expect(article.keywords).toBe("calma, respiração");
  });

  it("sem categoria e sem tags omite os campos; imagem local vira URL completa; título limitado a 110", () => {
    const article = blogPostingSchema({ ...post, title: "x".repeat(200), category: null, tags: [], coverImage: "/capa.jpg" }) as Record<string, unknown>;

    expect(article).not.toHaveProperty("articleSection");
    expect(article).not.toHaveProperty("keywords");
    expect(article.image).toEqual([`${SITE_URL}/capa.jpg`]);
    expect((article.headline as string).length).toBe(110);
  });
});

describe("courseSchema e therapyServiceSchema", () => {
  it("curso com provedor e URL própria", () => {
    const course = courseSchema({ slug: "c", title: "Curso", text: "Texto", bgImage: "/bg.jpg" }) as Record<string, unknown>;

    expect(course).toMatchObject({ "@type": "Course", name: "Curso", description: "Texto", url: `${SITE_URL}/cursos-e-vivencias/c`, provider: { "@id": `${SITE_URL}/#organization` } });
  });

  it("serviço de terapia atendido no Rio de Janeiro", () => {
    expect(therapyServiceSchema()).toMatchObject({ "@type": "Service", serviceType: "Terapia Tântrica", areaServed: { name: "Rio de Janeiro" } });
  });
});

describe("serializeJsonLd", () => {
  it("escapa < para o conteúdo nunca fechar a tag script", () => {
    const html = serializeJsonLd({ name: "</script><script>alert(1)</script>" });

    expect(html).not.toContain("<");
    expect(JSON.parse(html).name).toBe("</script><script>alert(1)</script>");
  });
});
