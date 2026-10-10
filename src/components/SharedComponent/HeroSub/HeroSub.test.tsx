/**
 * Caminho: src/components/SharedComponent/HeroSub/HeroSub.test.tsx
 * Arquivo: HeroSub.test.tsx
 * Descrição: Teste do cabeçalho das páginas internas: o título da página é o único h1 (importante para SEO e leitores de tela).
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HeroSub from "./index";

describe("HeroSub", () => {
  it("renderiza o título como h1 e usa a imagem de fundo informada", () => {
    const { container } = render(<HeroSub title="Contato" bgImage="/images/x.jpg" />);

    expect(screen.getByRole("heading", { level: 1, name: "Contato" })).toBeInTheDocument();
    expect(container.querySelector("section")).toHaveStyle({ backgroundImage: "url(/images/x.jpg)" });
  });

  it("sem imagem usa o fundo padrão", () => {
    const { container } = render(<HeroSub title="Blog" />);

    expect(container.querySelector("section")?.getAttribute("style")).toContain("hero-sub-banner");
  });
});
