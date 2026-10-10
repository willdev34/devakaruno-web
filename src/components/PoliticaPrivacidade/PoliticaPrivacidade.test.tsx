/**
 * Caminho: src/components/PoliticaPrivacidade/PoliticaPrivacidade.test.tsx
 * Arquivo: PoliticaPrivacidade.test.tsx
 * Descrição: Testes da Política de Privacidade: seção de cookies, serviços de terceiros e botão de preferências.
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PoliticaPrivacidade from "./index";

describe("PoliticaPrivacidade", () => {
  it("explica os três usos de cookies e o consentimento", () => {
    render(<PoliticaPrivacidade />);

    expect(screen.getByRole("heading", { name: "3. Cookies e tecnologias de medição" })).toBeInTheDocument();
    expect(screen.getByText(/Google Tag Manager e Google Analytics mostram/)).toBeInTheDocument();
    expect(screen.getByText(/o Meta Pixel \(Meta/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Alterar minha escolha" })).toBeInTheDocument();
  });

  it("lista Google e Meta como terceiros e mantém a numeração em ordem", () => {
    render(<PoliticaPrivacidade />);

    expect(screen.getByText(/Google \(Tag Manager e Analytics\) e Meta \(Pixel\)/)).toBeInTheDocument();
    const titles = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(titles.map((t) => Number.parseInt(t ?? "", 10))).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});
