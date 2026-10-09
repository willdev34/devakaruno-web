/**
 * Caminho: src/components/Layout/Header/Logo/index.test.tsx
 * Arquivo: index.test.tsx
 * Descrição: Testes do Logo: altura padrão, altura personalizada e versão sempre branca.
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Logo from "./index";

describe("Layout/Header/Logo", () => {
  it("usa 88px de altura por padrão e linka para a Home", () => {
    render(<Logo />);

    const images = screen.getAllByAltText("Deva Karuno Terapias");
    expect(images).toHaveLength(2);
    images.forEach((img) => expect(img).toHaveStyle({ height: "88px" }));
    expect(screen.getByRole("link")).toHaveAttribute("href", "/");
  });

  it("aceita uma altura personalizada nas duas versões (clara e escura)", () => {
    render(<Logo height={44} />);

    screen.getAllByAltText("Deva Karuno Terapias").forEach((img) => expect(img).toHaveStyle({ height: "44px" }));
  });

  it("na versão sempre branca renderiza uma única imagem, também com altura personalizada", () => {
    render(<Logo forceWhite height={44} />);

    const images = screen.getAllByAltText("Deva Karuno Terapias");
    expect(images).toHaveLength(1);
    expect(images[0]).toHaveStyle({ height: "44px" });
  });
});
