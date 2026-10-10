/**
 * Caminho: src/components/Home/Hero/index.test.tsx
 * Arquivo: index.test.tsx
 * Descrição: Testes do Hero da Home: imagens do Cloudinary otimizadas, parâmetros do movimento no mobile e botões de ação.
 */
import { DEFAULT_SETTINGS } from "@/lib/settings/defaults";
import { siteWhatsappLink } from "@/lib/whatsapp";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Hero, { MOBILE_PAN_DURATION_S } from "./index";
import { HerosectionData } from "./data";

// react-slick depende de matchMedia, que o jsdom não tem: o mock só renderiza os filhos
vi.mock("react-slick", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("Home/Hero", () => {
  it("renderiza uma imagem por slide, vinda do Cloudinary e otimizada", () => {
    render(<Hero />);

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(HerosectionData.length);
    images.forEach((img, index) => {
      expect(img.getAttribute("src")).toContain("res.cloudinary.com/do0uq7w4n/image/upload/f_auto,q_auto,w_2000/");
      expect(img.getAttribute("src")).toContain(HerosectionData[index].image.split("/upload/")[1]);
      expect(img).toHaveAttribute("srcset", expect.stringContaining("w_2800"));
    });
  });

  it("carrega só a primeira imagem com prioridade", () => {
    render(<Hero />);

    const images = screen.getAllByRole("img");
    expect(images[0]).toHaveAttribute("loading", "eager");
    expect(images[1]).toHaveAttribute("loading", "lazy");
  });

  it("usa o movimento padrão da esquerda para a direita quando o slide não define outro", () => {
    render(<Hero />);

    const first = screen.getAllByRole("img")[0];
    expect(first.style.getPropertyValue("--pan-from")).toBe("0%");
    expect(first.style.getPropertyValue("--pan-to")).toBe("100%");
    expect(first).toHaveClass("hero-image");
  });

  it("define a duração do movimento no mobile a partir do tempo do slide", () => {
    const { container } = render(<Hero />);

    expect(MOBILE_PAN_DURATION_S).toBe(12);
    expect(container.querySelector("section")?.style.getPropertyValue("--pan-duration")).toBe("12s");
  });

  it("mostra o título e os botões de ação em cada slide", () => {
    render(<Hero />);

    expect(screen.getAllByRole("heading", { name: "Encontre-se. Conecte-se. Transforme-se." })).toHaveLength(
      HerosectionData.length
    );
    expect(screen.getAllByRole("link", { name: "Agendar Sessão" })[0]).toHaveAttribute(
      "href",
      siteWhatsappLink(DEFAULT_SETTINGS)
    );
    expect(screen.getAllByRole("link", { name: "Conhecer Mais" })[0]).toHaveAttribute("href", "#sobre");
  });
});
