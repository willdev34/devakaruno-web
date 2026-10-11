// @vitest-environment node
/**
 * Caminho: src/app/seo-files.test.ts
 * Arquivo: seo-files.test.ts
 * Descrição: Testes de robots.txt, sitemap.xml e da imagem padrão de compartilhamento.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const m = vi.hoisted(() => ({ getSitemapPosts: vi.fn(), getSitemapCourses: vi.fn() }));
vi.mock("@/lib/repositories/posts", () => ({ getSitemapPosts: m.getSitemapPosts }));
vi.mock("@/lib/repositories/courses", () => ({ getSitemapCourses: m.getSitemapCourses }));

describe("robots", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("em produção libera o site, bloqueia painel e API e aponta o sitemap", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const { default: robots } = await import("./robots");

    const result = robots();

    expect(result.rules).toEqual({ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] });
    expect(result.sitemap).toMatch(/\/sitemap\.xml$/);
  });

  it("em Preview bloqueia tudo e não anuncia sitemap", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    const { default: robots } = await import("./robots");

    const result = robots();

    expect(result.rules).toEqual({ userAgent: "*", disallow: "/" });
    expect(result.sitemap).toBeUndefined();
  });
});

describe("sitemap", () => {
  beforeEach(() => Object.values(m).forEach((fn) => fn.mockReset()));

  it("junta páginas fixas, cursos e artigos do banco", async () => {
    m.getSitemapPosts.mockResolvedValue([{ slug: "paz", updatedAt: new Date() }]);
    m.getSitemapCourses.mockResolvedValue([{ slug: "curso-a", updatedAt: new Date() }]);
    const { default: sitemap } = await import("./sitemap");

    const urls = (await sitemap()).map((e) => e.url);

    expect(urls.some((u) => u.endsWith("/blog/paz"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/cursos-e-vivencias/curso-a"))).toBe(true);
  });

  it("se o banco falhar, publica só as páginas fixas", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    m.getSitemapPosts.mockRejectedValue(new Error("sem banco"));
    m.getSitemapCourses.mockResolvedValue([]);
    const { default: sitemap } = await import("./sitemap");

    const urls = (await sitemap()).map((e) => e.url);

    expect(urls.length).toBeGreaterThan(5);
    expect(urls.some((u) => u.includes("/blog/"))).toBe(false);
    expect(console.error).toHaveBeenCalled();
  });
});

describe("opengraph-image", () => {
  it("gera uma imagem 1200x630", async () => {
    const mod = await import("./opengraph-image");

    const response = mod.default();

    expect(response).toBeInstanceOf(Response);
    expect(mod.size).toEqual({ width: 1200, height: 630 });
    expect(mod.contentType).toBe("image/png");
  });
});
