/**
 * Caminho: src/components/Home/Testimonial/Testimonial.test.tsx
 * Arquivo: Testimonial.test.tsx
 * Descrição: Testes do bloco de Depoimentos da Home: título, itens do carrossel vindos do banco e seção oculta quando vazio.
 */
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Testimonial from "./index";
import TestimonialCarousel from "./TestimonialCarousel";

const { getFeaturedTestimonials } = vi.hoisted(() => ({ getFeaturedTestimonials: vi.fn() }));

vi.mock("@/lib/repositories/testimonials", () => ({ getFeaturedTestimonials }));

// react-slick depende de matchMedia, que o jsdom não tem: o mock só renderiza os filhos
vi.mock("react-slick", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="slider">{children}</div>,
}));

const items = [
  { id: "1", clientName: "Ana", review: "Foi muito bom.", order: 0, featured: true, createdAt: new Date() },
  { id: "2", clientName: "Bruno", review: "Recomendo.", order: 1, featured: true, createdAt: new Date() },
];

describe("Home/Testimonial", () => {
  beforeEach(() => {
    getFeaturedTestimonials.mockReset();
  });

  it("mostra o título da seção e os depoimentos em destaque", async () => {
    getFeaturedTestimonials.mockResolvedValue(items);

    render(await Testimonial());

    expect(
      screen.getByRole("heading", { name: "O que dizem as pessoas que já passaram por aqui" })
    ).toBeInTheDocument();
    expect(screen.getByText(/Foi muito bom\./)).toBeInTheDocument();
    expect(screen.getByText("Bruno")).toBeInTheDocument();
  });

  it("não renderiza a seção quando não há depoimentos", async () => {
    getFeaturedTestimonials.mockResolvedValue([]);

    const { container } = render(await Testimonial());

    expect(container).toBeEmptyDOMElement();
  });
});

describe("Home/Testimonial/TestimonialCarousel", () => {
  it("renderiza um slide por depoimento, com o texto entre aspas", () => {
    render(<TestimonialCarousel items={items} />);

    expect(screen.getByText('"Foi muito bom."')).toBeInTheDocument();
    expect(screen.getByText('"Recomendo."')).toBeInTheDocument();
    expect(screen.getByText("Ana")).toBeInTheDocument();
  });
});
