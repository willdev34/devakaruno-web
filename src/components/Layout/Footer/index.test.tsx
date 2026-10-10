/**
 * Caminho: src/components/Layout/Footer/index.test.tsx
 * Arquivo: index.test.tsx
 * Descrição: Testes do rodapé: logo, slogan em três linhas, contato e crédito de desenvolvimento.
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Footer from "./index";
import { SiteSettingsProvider } from "@/components/Providers/SiteSettingsProvider";
import { DEFAULT_SETTINGS } from "@/lib/settings/defaults";

// O Icon do Iconify busca ícones pela rede: o mock só marca o lugar dele
vi.mock("@iconify/react/dist/iconify.js", () => ({ Icon: () => <span data-testid="icon" /> }));

describe("Layout/Footer", () => {
  it("mostra o logo com 55px de altura", () => {
    render(<Footer />);

    const logos = screen.getAllByAltText("Deva Karuno Terapias");
    expect(logos.length).toBeGreaterThan(0);
    logos.forEach((img) => expect(img).toHaveStyle({ height: "55px" }));
  });

  it("quebra a linha do slogan depois de cada ponto final", () => {
    render(<Footer />);

    const slogan = screen.getByText(/Encontre-se\./);
    expect(slogan.querySelectorAll("br")).toHaveLength(2);
    expect(slogan).toHaveTextContent("Encontre-se.Conecte-se.Transforme-se.");
  });

  it("mostra o copyright com o ano atual", () => {
    render(<Footer />);

    expect(
      screen.getByText(`© ${new Date().getFullYear()} Deva Karuno Terapias. Todos os direitos reservados.`)
    ).toBeInTheDocument();
  });

  it("mostra o crédito 'Desenvolvido por' com link para o portfólio em nova aba", () => {
    render(<Footer />);

    const credit = screen.getByRole("link", { name: "WPDev - Portfólio de William, Desenvolvedor Full Stack" });
    expect(credit).toHaveAttribute("href", "https://www.wpdevbr.com/");
    expect(credit).toHaveAttribute("target", "_blank");
    expect(credit).toHaveAttribute("rel", "noopener noreferrer");
    expect(credit).toHaveTextContent("Desenvolvido por");
  });

  it("carrega o logo da WPDev do Cloudinary, otimizado", () => {
    render(<Footer />);

    const logo = screen.getByAltText("WPDev");
    expect(logo.getAttribute("src")).toContain("res.cloudinary.com/do0uq7w4n/image/upload/f_auto,q_auto,w_240/");
    expect(logo.getAttribute("src")).toContain("wpdev-logo_xiyk1v.webp");
  });

  it("usa os dados das configurações: endereço, e-mail e WhatsApp", () => {
    render(
      <SiteSettingsProvider value={{ ...DEFAULT_SETTINGS, address: "Rua Nova, 10 - Niterói", email: "novo@exemplo.com", whatsappNumber: "5511999999999" }}>
        <Footer />
      </SiteSettingsProvider>,
    );

    expect(screen.getByText("Rua Nova, 10 - Niterói")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "novo@exemplo.com" })).toHaveAttribute("href", "mailto:novo@exemplo.com");
    expect(screen.getByRole("link", { name: "Agendar pelo WhatsApp" })).toHaveAttribute("href", expect.stringMatching(/^https:\/\/wa\.me\/5511999999999\?text=/));
  });

  it("mostra as quatro redes por padrão e esconde as que estiverem em branco", () => {
    const { unmount } = render(<Footer />);
    expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute("href", DEFAULT_SETTINGS.instagramUrl);
    expect(screen.getAllByTestId("icon")).toHaveLength(4);
    unmount();

    render(
      <SiteSettingsProvider value={{ ...DEFAULT_SETTINGS, facebookUrl: "", xUrl: "", tiktokUrl: "" }}>
        <Footer />
      </SiteSettingsProvider>,
    );
    expect(screen.getAllByTestId("icon")).toHaveLength(1);
    expect(screen.queryByRole("link", { name: "Facebook" })).not.toBeInTheDocument();
  });
});
