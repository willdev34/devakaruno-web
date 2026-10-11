/**
 * Caminho: src/components/Analytics/Analytics.test.tsx
 * Arquivo: Analytics.test.tsx
 * Descrição: Testes do rastreamento: só carrega o que está preenchido, não carrega no admin e recusa códigos fora do formato.
 */
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Analytics from "./index";

const m = vi.hoisted(() => ({ pathname: "/", consent: "accepted" as string }));

vi.mock("next/navigation", () => ({ usePathname: () => m.pathname }));
// Escolha de cookies controlada pelo teste
vi.mock("@/hooks/useCookieConsent", () => ({ useCookieConsent: () => m.consent }));
// Mostra o script como elemento comum para podermos inspecionar
vi.mock("next/script", () => ({
  default: ({ id, src, children }: { id?: string; src?: string; children?: React.ReactNode }) => (
    <script data-testid={id ?? "gtag-src"} data-src={src}>{children}</script>
  ),
}));

const none = { gtmId: "", gaId: "", metaPixelId: "" };

describe("Analytics", () => {
  beforeEach(() => {
    m.pathname = "/";
    m.consent = "accepted";
  });

  it("não carrega nada sem códigos", () => {
    const { container } = render(<Analytics {...none} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("carrega o Tag Manager com o código", () => {
    const { getByTestId } = render(<Analytics {...none} gtmId="GTM-ABC1234" />);

    expect(getByTestId("gtm").textContent).toContain("'GTM-ABC1234'");
  });

  it("carrega o GA4 com a biblioteca e a configuração", () => {
    const { getByTestId } = render(<Analytics {...none} gaId="G-ABCDEF1234" />);

    expect(getByTestId("gtag-src")).toHaveAttribute("data-src", "https://www.googletagmanager.com/gtag/js?id=G-ABCDEF1234");
    expect(getByTestId("ga4").textContent).toContain("gtag('config','G-ABCDEF1234')");
  });

  it("carrega o Meta Pixel com PageView", () => {
    const { getByTestId } = render(<Analytics {...none} metaPixelId="123456789012345" />);

    expect(getByTestId("meta-pixel").textContent).toContain("fbq('init','123456789012345')");
  });

  it.each(["unset", "pending", "rejected"])("não carrega nada com a escolha %s", (consent) => {
    m.consent = consent;
    const { container } = render(<Analytics gtmId="GTM-ABC1234" gaId="G-ABCDEF1234" metaPixelId="123456789012345" />);

    expect(container).toBeEmptyDOMElement();
  });

  it("não carrega no painel admin", () => {
    m.pathname = "/admin/artigos";
    const { container } = render(<Analytics gtmId="GTM-ABC1234" gaId="G-ABCDEF1234" metaPixelId="123456789012345" />);

    expect(container).toBeEmptyDOMElement();
    m.pathname = "/admin";
    expect(render(<Analytics gtmId="GTM-ABC1234" gaId="" metaPixelId="" />).container).toBeEmptyDOMElement();
  });

  it("recusa códigos fora do formato, mesmo vindos do banco", () => {
    const { container } = render(<Analytics gtmId={"GTM-X');alert(1);//"} gaId="UA-1" metaPixelId="12ab" />);

    expect(container).toBeEmptyDOMElement();
  });
});
