/**
 * Caminho: src/components/QuemEOKaruno/Depoimentos/index.test.tsx
 * Arquivo: index.test.tsx
 * Descrição: Testes da seção "Mais depoimentos" da página Quem é o Karuno, com o repositório mockado.
 */
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Depoimentos from "./index";

const { getMoreTestimonials } = vi.hoisted(() => ({ getMoreTestimonials: vi.fn() }));

vi.mock("@/lib/repositories/testimonials", () => ({ getMoreTestimonials }));

const items = [
  { id: "1", clientName: "Carla", review: "Experiência única.", order: 0, featured: false, createdAt: new Date() },
  { id: "2", clientName: "Diego", review: "Muito acolhedor.", order: 1, featured: false, createdAt: new Date() },
];

describe("QuemEOKaruno/Depoimentos", () => {
  beforeEach(() => {
    getMoreTestimonials.mockReset();
  });

  it("mostra o título e um card por depoimento", async () => {
    getMoreTestimonials.mockResolvedValue(items);

    render(await Depoimentos());

    expect(screen.getByRole("heading", { name: "Mais depoimentos" })).toBeInTheDocument();
    expect(screen.getByText('"Experiência única."')).toBeInTheDocument();
    expect(screen.getByText("Diego")).toBeInTheDocument();
  });

  it("não renderiza a seção quando não há depoimentos", async () => {
    getMoreTestimonials.mockResolvedValue([]);

    const { container } = render(await Depoimentos());

    expect(container).toBeEmptyDOMElement();
  });
});
