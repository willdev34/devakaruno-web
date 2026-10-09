/**
 * Caminho: src/components/Layout/Footer/index.test.tsx
 * Arquivo: index.test.tsx
 * Descrição: Testes do rodapé: logo, slogan em três linhas, contato e crédito de desenvolvimento.
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Footer from "./index";

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
});
