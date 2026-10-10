/**
 * Caminho: src/lib/seo/seo.test.ts
 * Arquivo: seo.test.ts
 * Descrição: Testes das regras de SEO: URL absoluta, quando o site é indexável, metadados de página e lista do sitemap.
 */
import { describe, expect, it } from "vitest";
import { pageMetadata } from "./metadata";
import { absoluteUrl, DEFAULT_OG_IMAGE, isIndexable, SITE_URL } from "./site";
import { buildSitemap } from "./sitemap-entries";

describe("site", () => {
  it("monta URLs absolutas a partir de caminhos, com ou sem barra", () => {
    expect(absoluteUrl("/blog")).toBe(`${SITE_URL}/blog`);
    expect(absoluteUrl("blog")).toBe(`${SITE_URL}/blog`);
    expect(absoluteUrl("/")).toBe(`${SITE_URL}/`);
  });

  it("não mexe em URLs que já são completas", () => {
    expect(absoluteUrl("https://res.cloudinary.com/x.jpg")).toBe("https://res.cloudinary.com/x.jpg");
  });

  it("o endereço oficial não termina com barra", () => {
    expect(SITE_URL).not.toMatch(/\/$/);
  });

  it("só produção (ou servidor sem VERCEL_ENV) é indexável", () => {
    expect(isIndexable("production")).toBe(true);
    expect(isIndexable(undefined)).toBe(true);
    expect(isIndexable("preview")).toBe(false);
    expect(isIndexable("development")).toBe(false);
  });
});

describe("pageMetadata", () => {
  const base = { title: "Blog", description: "Descrição", path: "/blog" };

  it("preenche título, descrição, canonical, Open Graph e Twitter", () => {
    const meta = pageMetadata(base);

    expect(meta.title).toBe("Blog");
    expect(meta.description).toBe("Descrição");
    expect(meta.alternates?.canonical).toBe("/blog");
    expect(meta.openGraph).toMatchObject({ type: "website", locale: "pt_BR", title: "Blog | Deva Karuno Terapias", url: "/blog" });
    expect(meta.twitter).toMatchObject({ card: "summary_large_image", title: "Blog | Deva Karuno Terapias", images: [DEFAULT_OG_IMAGE] });
    expect(meta.robots).toBeUndefined();
  });

  it("sem imagem própria usa a padrão, com as medidas", () => {
    const images = pageMetadata(base).openGraph?.images as { url: string; width?: number; height?: number }[];

    expect(images[0]).toMatchObject({ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 });
  });

  it("com imagem do Cloudinary pede o recorte de compartilhamento", () => {
    const meta = pageMetadata({ ...base, image: "https://res.cloudinary.com/c/image/upload/v1/a.jpg" });
    const images = meta.openGraph?.images as { url: string }[];

    expect(images[0].url).toContain("f_jpg,q_auto,c_fill,g_auto,w_1200,h_630");
    expect(meta.twitter?.images).toEqual([images[0].url]);
  });

  it("título absoluto não recebe o nome do site", () => {
    const meta = pageMetadata({ ...base, title: "Terapia no Rio", absoluteTitle: true });

    expect(meta.title).toEqual({ absolute: "Terapia no Rio" });
    expect(meta.openGraph?.title).toBe("Terapia no Rio");
  });

  it("noindex bloqueia indexação e seguir links", () => {
    expect(pageMetadata({ ...base, noindex: true }).robots).toEqual({ index: false, follow: false });
  });

  it("artigos levam as datas, seção e tags no Open Graph", () => {
    const meta = pageMetadata({
      ...base,
      type: "article",
      article: { publishedTime: "2026-01-01T00:00:00Z", modifiedTime: "2026-02-01T00:00:00Z", section: "Autoconhecimento", tags: ["a"], authors: ["Deva Karuno"] },
    });

    expect(meta.openGraph).toMatchObject({ type: "article", publishedTime: "2026-01-01T00:00:00Z", modifiedTime: "2026-02-01T00:00:00Z", section: "Autoconhecimento", tags: ["a"] });
  });
});

describe("buildSitemap", () => {
  it("lista as páginas fixas, os cursos e os artigos, com datas só onde existem", () => {
    const updatedAt = new Date("2026-10-01T00:00:00Z");
    const entries = buildSitemap([{ slug: "paz", updatedAt }], [{ slug: "curso-a", updatedAt }]);
    const urls = entries.map((e) => e.url);

    expect(urls).toContain(`${SITE_URL}/`);
    expect(urls).toContain(`${SITE_URL}/terapia-tantrica`);
    expect(urls).toContain(`${SITE_URL}/cursos-e-vivencias/curso-a`);
    expect(urls).toContain(`${SITE_URL}/blog/paz`);
    expect(entries.find((e) => e.url.endsWith("/blog/paz"))?.lastModified).toBe(updatedAt);
    expect(entries.find((e) => e.url === `${SITE_URL}/`)?.lastModified).toBeUndefined();
  });

  it("não inclui páginas técnicas nem duplicatas", () => {
    const urls = buildSitemap([], []).map((e) => e.url);

    expect(urls.some((u) => /signin|admin|obrigado|em-construcao/.test(u))).toBe(false);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
