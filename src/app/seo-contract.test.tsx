/**
 * Caminho: src/app/seo-contract.test.tsx
 * Arquivo: seo-contract.test.tsx
 * Descrição: Contrato de SEO das páginas públicas: cada uma precisa de título, descrição de tamanho adequado, canonical igual à própria rota e Open Graph. Páginas técnicas precisam de noindex.
 */
import type { Metadata } from "next";
import { describe, expect, it, vi } from "vitest";

// As páginas importam componentes que falam com o banco; aqui só os metadados interessam
vi.mock("@/lib/prisma", () => ({ prisma: {} }));
vi.mock("@/lib/repositories/site-settings", () => ({ getSiteSettings: vi.fn() }));
// O carrossel da Home exige recursos de navegador que o teste não precisa
vi.mock("react-slick", () => ({ default: () => null }));

const PUBLIC_PAGES: [string, () => Promise<{ metadata: Metadata }>][] = [
  ["/", () => import("./page")],
  ["/agenda", () => import("./(site)/agenda/page")],
  ["/blog", () => import("./(site)/blog/page")],
  ["/contato", () => import("./(site)/contato/page")],
  ["/cursos-e-vivencias", () => import("./(site)/cursos-e-vivencias/page")],
  ["/quem-e-o-karuno", () => import("./(site)/quem-e-o-karuno/page")],
  ["/terapia-tantrica", () => import("./(site)/terapia-tantrica/page")],
  ["/politica-de-privacidade", () => import("./(site)/politica-de-privacidade/page")],
];

const TECHNICAL_PAGES: [string, () => Promise<{ metadata: Metadata }>][] = [
  ["/signin", () => import("./(site)/(auth)/signin/page")],
  ["/newsletter-obrigado", () => import("./(site)/newsletter-obrigado/page")],
];

describe.each(PUBLIC_PAGES)("SEO de %s", (path, load) => {
  it("tem título, descrição entre 70 e 170 caracteres, canonical e Open Graph", async () => {
    const { metadata } = await load();

    expect(metadata.title).toBeTruthy();
    expect(String(metadata.description).length).toBeGreaterThanOrEqual(70);
    expect(String(metadata.description).length).toBeLessThanOrEqual(170);
    expect(metadata.alternates?.canonical).toBe(path);
    expect(metadata.openGraph).toMatchObject({ locale: "pt_BR", url: path });
    expect(metadata.robots).toBeUndefined();
  });
});

describe.each(TECHNICAL_PAGES)("SEO de %s (página técnica)", (_path, load) => {
  it("não é indexada", async () => {
    const { metadata } = await load();

    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});

describe("títulos", () => {
  it("nenhum título carrega o nome do site duas vezes nem restos do template antigo", async () => {
    for (const [, load] of [...PUBLIC_PAGES, ...TECHNICAL_PAGES]) {
      const { metadata } = await load();
      const title = typeof metadata.title === "string" ? metadata.title : (metadata.title as { absolute: string }).absolute;

      expect(title).not.toMatch(/Venus/);
      if (typeof metadata.title === "string") expect(title).not.toContain("Deva Karuno Terapias");
    }
  });
});
