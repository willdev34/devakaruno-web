/**
 * Caminho: src/app/admin/categorias/Pages.test.tsx
 * Arquivo: Pages.test.tsx
 * Descrição: Testes das páginas de categorias do admin: listagem com total de artigos, nova e edição (incluindo 404).
 */
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminCategoriesPage from "./page";
import NewCategoryPage from "./novo/page";
import EditCategoryPage from "./[id]/page";

const m = vi.hoisted(() => ({
  listAdminCategories: vi.fn(),
  getCategory: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/lib/repositories/admin-categories", () => ({ listAdminCategories: m.listAdminCategories, getCategory: m.getCategory }));
vi.mock("next/navigation", () => ({ notFound: m.notFound }));
vi.mock("./actions", () => ({ deleteCategoryAction: vi.fn() }));
vi.mock("@/components/Admin/Categories/CategoryForm", () => ({
  default: ({ categoryId, initial }: { categoryId: string | null; initial: Record<string, string> }) => (
    <div data-testid="form">{`${categoryId}|${initial.name}|${initial.slug}|${initial.description}`}</div>
  ),
}));
vi.mock("@/components/Admin/Posts/DeleteButton", () => ({ default: ({ name }: { name: string }) => <button>{`Excluir ${name}`}</button> }));

const category = (over = {}) => ({ id: "1", name: "Autoconhecimento", slug: "autoconhecimento", description: null, _count: { posts: 3 }, ...over });

describe("admin/categorias", () => {
  beforeEach(() => Object.values(m).forEach((fn) => fn.mockReset()));

  it("lista com slug e total de artigos", async () => {
    m.listAdminCategories.mockResolvedValue([category(), category({ id: "2", name: "Relacionamentos", slug: "relacionamentos", _count: { posts: 0 } })]);

    render(await AdminCategoriesPage());

    expect(screen.getByText("autoconhecimento")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Editar" })[1]).toHaveAttribute("href", "/admin/categorias/2");
    expect(screen.getByRole("link", { name: "+ Nova categoria" })).toHaveAttribute("href", "/admin/categorias/novo");
  });

  it("lista vazia avisa", async () => {
    m.listAdminCategories.mockResolvedValue([]);

    render(await AdminCategoriesPage());

    expect(screen.getByText("Nenhuma categoria cadastrada ainda.")).toBeInTheDocument();
  });

  it("nova abre o formulário vazio", () => {
    render(<NewCategoryPage />);

    expect(screen.getByTestId("form")).toHaveTextContent("null|||");
  });

  it("edição carrega os dados, com descrição vazia quando não há", async () => {
    m.getCategory.mockResolvedValue(category());

    render(await EditCategoryPage({ params: Promise.resolve({ id: "1" }) }));

    expect(screen.getByTestId("form")).toHaveTextContent("1|Autoconhecimento|autoconhecimento|");
    expect(screen.getByRole("button", { name: "Excluir Autoconhecimento" })).toBeInTheDocument();
  });

  it("edição de categoria inexistente dá 404", async () => {
    m.getCategory.mockResolvedValue(null);

    await expect(EditCategoryPage({ params: Promise.resolve({ id: "x" }) })).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
