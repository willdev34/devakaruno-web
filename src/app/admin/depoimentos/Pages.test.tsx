/**
 * Caminho: src/app/admin/depoimentos/Pages.test.tsx
 * Arquivo: Pages.test.tsx
 * Descrição: Testes das páginas de depoimentos do admin: listagem (ordem, destaque, trecho), novo e edição (incluindo 404).
 */
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminTestimonialsPage from "./page";
import NewTestimonialPage from "./novo/page";
import EditTestimonialPage from "./[id]/page";

const m = vi.hoisted(() => ({
  listAdminTestimonials: vi.fn(),
  getTestimonial: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/lib/repositories/admin-testimonials", () => ({
  listAdminTestimonials: m.listAdminTestimonials,
  getTestimonial: m.getTestimonial,
}));
vi.mock("next/navigation", () => ({ notFound: m.notFound }));
vi.mock("./actions", () => ({ deleteTestimonialAction: vi.fn(), moveTestimonialAction: vi.fn() }));
vi.mock("@/components/Admin/MoveButtons", () => ({
  default: ({ name, isFirst, isLast }: { name: string; isFirst: boolean; isLast: boolean }) => (
    <div data-testid="move">{`${name}|${isFirst}|${isLast}`}</div>
  ),
}));
vi.mock("@/components/Admin/Testimonials/TestimonialForm", () => ({
  default: ({ testimonialId, initial }: { testimonialId: string | null; initial: Record<string, unknown> }) => (
    <div data-testid="form">{`${testimonialId}|${initial.clientName}|${initial.featured}`}</div>
  ),
}));
vi.mock("@/components/Admin/Posts/DeleteButton", () => ({ default: ({ name }: { name: string }) => <button>{`Excluir ${name}`}</button> }));

const item = (over = {}) => ({ id: "1", clientName: "Ana", review: "Atendimento muito acolhedor.", featured: true, order: 1, ...over });

describe("admin/depoimentos", () => {
  beforeEach(() => Object.values(m).forEach((fn) => fn.mockReset()));

  it("lista com destino, trecho e posição de cada depoimento", async () => {
    m.listAdminTestimonials.mockResolvedValue([
      item(),
      item({ id: "2", clientName: "Bruno", featured: false, review: "x".repeat(200) }),
    ]);

    render(await AdminTestimonialsPage());

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Quem é o Karuno")).toBeInTheDocument();
    expect(screen.getByText(`${"x".repeat(90)}...`)).toBeInTheDocument();
    expect(screen.getAllByTestId("move").map((el) => el.textContent)).toEqual(["Ana|true|false", "Bruno|false|true"]);
    expect(screen.getAllByRole("link", { name: "Editar" })[1]).toHaveAttribute("href", "/admin/depoimentos/2");
    expect(screen.getByRole("link", { name: "+ Novo depoimento" })).toHaveAttribute("href", "/admin/depoimentos/novo");
  });

  it("lista vazia avisa", async () => {
    m.listAdminTestimonials.mockResolvedValue([]);

    render(await AdminTestimonialsPage());

    expect(screen.getByText("Nenhum depoimento cadastrado ainda.")).toBeInTheDocument();
  });

  it("novo abre o formulário vazio e sem destaque", () => {
    render(<NewTestimonialPage />);

    expect(screen.getByTestId("form")).toHaveTextContent("null||false");
  });

  it("edição carrega os dados e o botão de excluir", async () => {
    m.getTestimonial.mockResolvedValue(item());

    render(await EditTestimonialPage({ params: Promise.resolve({ id: "1" }) }));

    expect(screen.getByTestId("form")).toHaveTextContent("1|Ana|true");
    expect(screen.getByRole("button", { name: "Excluir Ana" })).toBeInTheDocument();
  });

  it("edição de depoimento inexistente dá 404", async () => {
    m.getTestimonial.mockResolvedValue(null);

    await expect(EditTestimonialPage({ params: Promise.resolve({ id: "x" }) })).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
