/**
 * Caminho: src/components/Admin/Posts/PostsTable.test.tsx
 * Arquivo: PostsTable.test.tsx
 * Descrição: Testes da tabela de artigos com seleção: marcar um, marcar todos, ações em lote com confirmação, erro do servidor e limpeza.
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PostsTable, { type PostRow } from "./PostsTable";

const m = vi.hoisted(() => ({ refresh: vi.fn(), bulkPostsAction: vi.fn() }));

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: m.refresh }) }));
vi.mock("@/app/admin/artigos/actions", () => ({ bulkPostsAction: m.bulkPostsAction, deletePostAction: vi.fn() }));
vi.mock("./DeleteButton", () => ({ default: ({ name }: { name: string }) => <button>{`Excluir ${name}`}</button> }));

const row = (over: Partial<PostRow> = {}): PostRow => ({
  id: "1",
  title: "Artigo A",
  featured: false,
  status: "published",
  tags: ["calma"],
  readingMinutes: 3,
  publishedLabel: "10/10/2026 09:00",
  ...over,
});
const posts = [row(), row({ id: "2", title: "Artigo B", featured: true, status: "draft", publishedLabel: "-" })];

describe("PostsTable", () => {
  beforeEach(() => {
    Object.values(m).forEach((fn) => fn.mockReset());
    vi.restoreAllMocks();
    m.bulkPostsAction.mockResolvedValue({ ok: true, count: 1 });
  });

  it("mostra os artigos e esconde a barra de lote enquanto nada está selecionado", () => {
    render(<PostsTable posts={posts} />);

    expect(screen.getByText("Artigo A")).toBeInTheDocument();
    expect(screen.getByText("Destaque")).toBeInTheDocument();
    expect(screen.getAllByText("3 min")).toHaveLength(2);
    expect(screen.queryByRole("region", { name: "Ações em lote" })).not.toBeInTheDocument();
  });

  it("lista vazia mostra o aviso e nenhuma caixa de seleção", () => {
    render(<PostsTable posts={[]} />);

    expect(screen.getByText("Nenhum artigo por aqui ainda.")).toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("marcar e desmarcar um artigo atualiza a contagem", () => {
    render(<PostsTable posts={posts} />);

    fireEvent.click(screen.getByRole("checkbox", { name: "Selecionar Artigo A" }));
    expect(screen.getByText("1 selecionado(s)")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("checkbox", { name: "Selecionar Artigo A" }));
    expect(screen.queryByRole("region", { name: "Ações em lote" })).not.toBeInTheDocument();
  });

  it("selecionar todos e desfazer", () => {
    render(<PostsTable posts={posts} />);

    fireEvent.click(screen.getByRole("checkbox", { name: "Selecionar todos os artigos" }));
    expect(screen.getByText("2 selecionado(s)")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("checkbox", { name: "Selecionar todos os artigos" }));
    expect(screen.queryByText("2 selecionado(s)")).not.toBeInTheDocument();
  });

  it.each([
    ["Publicar agora", "publish"],
    ["Voltar para rascunho", "unpublish"],
    ["Excluir selecionados", "delete"],
  ])("%s envia a ação %s com os ids marcados, depois limpa e atualiza", async (button, action) => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<PostsTable posts={posts} />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Selecionar todos os artigos" }));

    fireEvent.click(screen.getByRole("button", { name: button }));

    await waitFor(() => expect(m.refresh).toHaveBeenCalled());
    expect(m.bulkPostsAction).toHaveBeenCalledWith({ action, ids: ["1", "2"] });
    expect(screen.queryByRole("region", { name: "Ações em lote" })).not.toBeInTheDocument();
  });

  it("não faz nada se a pessoa cancelar a confirmação", () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    render(<PostsTable posts={posts} />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Selecionar Artigo A" }));

    fireEvent.click(screen.getByRole("button", { name: "Excluir selecionados" }));

    expect(m.bulkPostsAction).not.toHaveBeenCalled();
  });

  it("mostra o erro do servidor e mantém a seleção", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    m.bulkPostsAction.mockResolvedValue({ ok: false, error: "No máximo 100 artigos por vez" });
    render(<PostsTable posts={posts} />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Selecionar Artigo A" }));

    fireEvent.click(screen.getByRole("button", { name: "Publicar agora" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("No máximo 100 artigos por vez");
    expect(screen.getByText("1 selecionado(s)")).toBeInTheDocument();
    expect(m.refresh).not.toHaveBeenCalled();
  });

  it("Limpar seleção fecha a barra", () => {
    render(<PostsTable posts={posts} />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Selecionar Artigo A" }));

    fireEvent.click(screen.getByRole("button", { name: "Limpar seleção" }));

    expect(screen.queryByRole("region", { name: "Ações em lote" })).not.toBeInTheDocument();
  });
});
