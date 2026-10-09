/**
 * Caminho: src/app/admin/artigos/Pages.test.tsx
 * Arquivo: Pages.test.tsx
 * Descrição: Testes das páginas de artigos do admin: listagem com filtros, novo artigo e edição (incluindo 404).
 */
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminPostsPage from "./page";
import NewPostPage from "./novo/page";
import EditPostPage from "./[id]/page";

const m = vi.hoisted(() => ({
  listAdminPosts: vi.fn(),
  getAdminPost: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/lib/repositories/admin-posts", () => ({ listAdminPosts: m.listAdminPosts, getAdminPost: m.getAdminPost }));
vi.mock("next/navigation", () => ({ notFound: m.notFound, useRouter: () => ({}) }));
vi.mock("./actions", () => ({ deletePostAction: vi.fn() }));
vi.mock("@/components/Admin/Posts/PostForm", () => ({
  default: ({ postId, initial }: { postId: string | null; initial: { mode: string; scheduledAt?: string } }) => (
    <div data-testid="form">{`${postId}|${initial.mode}|${initial.scheduledAt ?? ""}`}</div>
  ),
}));
vi.mock("@/components/Admin/Posts/DeleteButton", () => ({ default: ({ name }: { name: string }) => <button>{`Excluir ${name}`}</button> }));

const post = (over = {}) => ({
  id: "1",
  title: "Artigo A",
  tags: ["python"],
  featured: false,
  published: true,
  publishedAt: new Date("2026-06-10T12:00:00Z"),
  content: "texto ".repeat(10),
  subtitle: null,
  slug: "a",
  excerpt: "r",
  coverImage: "/c.jpg",
  ...over,
});

describe("admin/artigos", () => {
  beforeEach(() => {
    Object.values(m).forEach((fn) => fn.mockReset());
  });

  it("lista artigos com status, tags, leitura e ações", async () => {
    m.listAdminPosts.mockResolvedValue([post(), post({ id: "2", title: "Rascunho B", published: false, featured: true, tags: [] })]);

    render(await AdminPostsPage({ searchParams: Promise.resolve({}) }));

    expect(m.listAdminPosts).toHaveBeenCalledWith({ status: "all", q: "" });
    expect(screen.getByText("Artigo A")).toBeInTheDocument();
    expect(screen.getByText("python")).toBeInTheDocument();
    expect(screen.getByText("Destaque")).toBeInTheDocument();
    expect(screen.getAllByText("1 min")).toHaveLength(2);
    expect(screen.getByText("10/06/2026 09:00")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Editar" })[0]).toHaveAttribute("href", "/admin/artigos/1");
    expect(screen.getByRole("link", { name: "+ Novo artigo" })).toBeInTheDocument();
  });

  it("aplica filtro de status e busca, ignorando status inválido", async () => {
    m.listAdminPosts.mockResolvedValue([]);

    render(await AdminPostsPage({ searchParams: Promise.resolve({ status: "draft", q: "mitos" }) }));
    expect(m.listAdminPosts).toHaveBeenLastCalledWith({ status: "draft", q: "mitos" });
    expect(screen.getByRole("link", { name: "Rascunhos" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("Nenhum artigo por aqui ainda.")).toBeInTheDocument();
    expect(screen.getByText("0 artigo(s) encontrado(s)")).toBeInTheDocument();

    render(await AdminPostsPage({ searchParams: Promise.resolve({ status: "qualquer" }) }));
    expect(m.listAdminPosts).toHaveBeenLastCalledWith({ status: "all", q: "" });
  });

  it("novo artigo abre o formulário vazio", () => {
    render(<NewPostPage />);

    expect(screen.getByTestId("form")).toHaveTextContent("null|now|");
  });

  it("edição carrega o artigo e mostra excluir", async () => {
    m.getAdminPost.mockResolvedValue(post());

    render(await EditPostPage({ params: Promise.resolve({ id: "1" }) }));

    expect(screen.getByTestId("form")).toHaveTextContent("1|now|");
    expect(screen.getByRole("button", { name: "Excluir Artigo A" })).toBeInTheDocument();
  });

  it("edição de artigo agendado passa a data para o formulário", async () => {
    const when = new Date(Date.now() + 86_400_000);
    m.getAdminPost.mockResolvedValue(post({ publishedAt: when, subtitle: "Sub" }));

    render(await EditPostPage({ params: Promise.resolve({ id: "1" }) }));

    expect(screen.getByTestId("form")).toHaveTextContent(`1|schedule|${when.toISOString()}`);
  });

  it("edição de artigo inexistente dá 404", async () => {
    m.getAdminPost.mockResolvedValue(null);

    await expect(EditPostPage({ params: Promise.resolve({ id: "x" }) })).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
