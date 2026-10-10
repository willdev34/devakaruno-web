// @vitest-environment node
/**
 * Caminho: src/lib/seo/next-config.test.ts
 * Arquivo: next-config.test.ts
 * Descrição: Testes dos cabeçalhos configurados em next.config.mjs: segurança em todas as páginas e cache nas imagens estáticas.
 */
import { describe, expect, it } from "vitest";
import * as nextConfigModule from "../../../next.config.mjs";

type Header = { key: string; value: string };
type Rule = { source: string; headers: Header[] };
const config = nextConfigModule.default as unknown as { poweredByHeader: boolean; headers: () => Promise<Rule[]> };
const { securityHeaders, staticAssetHeaders } = nextConfigModule as unknown as { securityHeaders: Header[]; staticAssetHeaders: Header[] };

const headerMap = (headers: Header[]) => Object.fromEntries(headers.map((h) => [h.key, h.value]));

describe("next.config", () => {
  it("não expõe a tecnologia do servidor", () => {
    expect(config.poweredByHeader).toBe(false);
  });

  it("aplica cabeçalhos de segurança em todas as rotas", async () => {
    const rules = await config.headers();
    const all = rules.find((rule) => rule.source === "/:path*")!;

    expect(headerMap(all.headers)).toMatchObject({
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Frame-Options": "SAMEORIGIN",
    });
    expect(headerMap(securityHeaders)["Permissions-Policy"]).toContain("camera=()");
  });

  it("dá cache às imagens do site, sem congelar para sempre", async () => {
    const rules = await config.headers();
    const images = rules.find((rule) => rule.source === "/images/:path*")!;

    expect(images.headers).toEqual(staticAssetHeaders);
    expect(headerMap(staticAssetHeaders)["Cache-Control"]).toMatch(/max-age=86400.*stale-while-revalidate/);
    expect(headerMap(staticAssetHeaders)["Cache-Control"]).not.toContain("immutable");
  });
});
