/**
 * Caminho: src/components/TerapiaTantrica/AnamneseCTA/index.test.tsx
 * Arquivo: index.test.tsx
 * Descrição: Testes do CTA final da Terapia Tântrica: textos e abertura/fechamento do modal da anamnese.
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AnamneseCTA from "./index";

describe("TerapiaTantrica/AnamneseCTA", () => {
  it("exibe o título e o botão do atendimento", () => {
    render(<AnamneseCTA />);

    expect(screen.getByRole("heading", { name: "Inicie seu atendimento" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Iniciar atendimento" })).toBeInTheDocument();
  });

  it("começa sem carregar o formulário", () => {
    render(<AnamneseCTA />);

    expect(screen.queryByTitle("Ficha de anamnese")).not.toBeInTheDocument();
  });

  it("abre o modal com a ficha ao clicar no botão", () => {
    render(<AnamneseCTA />);

    fireEvent.click(screen.getByRole("button", { name: "Iniciar atendimento" }));

    expect(screen.getByTitle("Ficha de anamnese")).toBeInTheDocument();
  });

  it("fecha o modal e descarrega o formulário", () => {
    render(<AnamneseCTA />);
    fireEvent.click(screen.getByRole("button", { name: "Iniciar atendimento" }));

    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));

    expect(screen.queryByTitle("Ficha de anamnese")).not.toBeInTheDocument();
  });
});
