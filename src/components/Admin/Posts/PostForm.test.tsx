/**
 * Caminho: src/components/Admin/Posts/PostForm.test.tsx
 * Arquivo: PostForm.test.tsx
 * Descrição: Testes do formulário de artigo: slug automático, validação, categoria, rascunho, publicação, agendamento e erros do servidor.
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PostForm from "./PostForm";

const { push, refresh, savePostAction } = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn(), savePostAction: vi.fn() }));

vi.mock("next/navigation", () => ({ useRouter: () => ({ push, refresh }) }));
vi.mock("@/app/admin/artigos/actions", () => ({ savePostAction }));
vi.mock("@/lib/admin-upload-client", () => ({ uploadImageClient: vi.fn() }));
vi.mock("../Editor/RichEditor", () => ({
  default: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <textarea aria-label="editor" value={value} onChange={(event) => onChange(event.target.value)} />
  ),
}));

const categories = [{ id: "c1", name: "Autoconhecimento" }, { id: "c2", name: "Relacionamentos" }];
const empty = { title: "", subtitle: "", slug: "", excerpt: "", seoTitle: "", seoDescription: "", content: "", coverImage: "", tags: [], categoryId: "", featured: false, mode: "now" as const };
const filled = {
  ...empty,
  title: "Meu artigo",
  slug: "meu-artigo",
  excerpt: "Um resumo com tamanho suficiente.",
  content: "Conteúdo do artigo com texto suficiente.",
  coverImage: "https://x/capa.jpg",
};

describe("PostForm", () => {
  beforeEach(() => {
    [push, refresh, savePostAction].forEach((fn) => fn.mockReset());
    savePostAction.mockResolvedValue({ ok: true, id: "1", slug: "meu-artigo" });
  });

  it("gera o slug a partir do título até a pessoa editar o slug", () => {
    render(<PostForm postId={null} categories={categories} initial={empty} />);

    fireEvent.change(screen.getByLabelText("Título *"), { target: { value: "Terapia Tântrica" } });
    expect(screen.getByLabelText("Slug *")).toHaveValue("terapia-tantrica");

    fireEvent.change(screen.getByLabelText("Slug *"), { target: { value: "meu-slug" } });
    fireEvent.change(screen.getByLabelText("Título *"), { target: { value: "Outro título" } });
    expect(screen.getByLabelText("Slug *")).toHaveValue("meu-slug");
  });

  it("não mexe no slug de artigo existente", () => {
    render(<PostForm postId="1" categories={categories} initial={filled} />);

    fireEvent.change(screen.getByLabelText("Título *"), { target: { value: "Novo título" } });

    expect(screen.getByLabelText("Slug *")).toHaveValue("meu-artigo");
  });

  it("mostra erros e não envia quando faltam campos", async () => {
    render(<PostForm postId={null} categories={categories} initial={empty} />);

    fireEvent.click(screen.getByRole("button", { name: "Publicar artigo" }));

    expect(await screen.findByText("Informe o título")).toBeInTheDocument();
    expect(screen.getByText("Escreva o conteúdo do artigo")).toBeInTheDocument();
    expect(savePostAction).not.toHaveBeenCalled();
  });

  it("publica e volta para a listagem", async () => {
    render(<PostForm postId={null} categories={categories} initial={filled} />);

    fireEvent.click(screen.getByRole("button", { name: "Publicar artigo" }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/admin/artigos"));
    expect(savePostAction).toHaveBeenCalledWith(null, expect.objectContaining({ mode: "now", slug: "meu-artigo" }));
  });

  it("salva rascunho só com título e slug", async () => {
    render(<PostForm postId={null} categories={categories} initial={{ ...empty, title: "Rascunho", slug: "rascunho" }} />);

    fireEvent.click(screen.getByRole("button", { name: "Salvar rascunho" }));

    await waitFor(() => expect(savePostAction).toHaveBeenCalled());
    expect(savePostAction.mock.calls[0][1]).toMatchObject({ mode: "draft", title: "Rascunho" });
  });

  it("agenda com data futura convertida para ISO", async () => {
    render(<PostForm postId="9" categories={categories} initial={filled} />);

    fireEvent.click(screen.getByLabelText(/Agendar/));
    const future = new Date(Date.now() + 2 * 86_400_000);
    const pad = (n: number) => String(n).padStart(2, "0");
    const local = `${future.getFullYear()}-${pad(future.getMonth() + 1)}-${pad(future.getDate())}T10:00`;
    fireEvent.change(screen.getByLabelText("Data e hora"), { target: { value: local } });
    fireEvent.click(screen.getByRole("button", { name: "Agendar artigo" }));

    await waitFor(() => expect(savePostAction).toHaveBeenCalled());
    const [id, payload] = savePostAction.mock.calls[0];
    expect(id).toBe("9");
    expect(payload.mode).toBe("schedule");
    expect(payload.scheduledAt).toBe(new Date(local).toISOString());
  });

  it("agendar sem data mostra erro", async () => {
    render(<PostForm postId={null} categories={categories} initial={filled} />);

    fireEvent.click(screen.getByLabelText(/Agendar/));
    fireEvent.click(screen.getByRole("button", { name: "Agendar artigo" }));

    expect(await screen.findByText("Escolha uma data e hora no futuro")).toBeInTheDocument();
  });

  it("limpa a data quando o campo é apagado e mostra a data de um artigo já agendado", () => {
    const scheduledAt = new Date(Date.now() + 86_400_000).toISOString();
    render(<PostForm postId="1" categories={categories} initial={{ ...filled, mode: "schedule", scheduledAt }} />);

    const field = screen.getByLabelText("Data e hora") as HTMLInputElement;
    expect(field.value).not.toBe("");

    fireEvent.change(field, { target: { value: "" } });
    expect(field.value).toBe("");
  });

  it("mostra os erros devolvidos pelo servidor", async () => {
    savePostAction.mockResolvedValue({ ok: false, error: "Esse slug já está em uso.", fieldErrors: { slug: "Esse slug já está em uso" } });
    render(<PostForm postId={null} categories={categories} initial={filled} />);

    fireEvent.click(screen.getByRole("button", { name: "Publicar artigo" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Esse slug já está em uso.");
    expect(screen.getByText("Esse slug já está em uso")).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("erro do servidor sem campos só mostra o aviso", async () => {
    savePostAction.mockResolvedValue({ ok: false, error: "Falhou" });
    render(<PostForm postId={null} categories={categories} initial={filled} />);

    fireEvent.click(screen.getByRole("button", { name: "Publicar artigo" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Falhou");
  });

  it("oferece as categorias e envia a escolhida", async () => {
    render(<PostForm postId={null} categories={categories} initial={filled} />);

    expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual(["Sem categoria", "Autoconhecimento", "Relacionamentos"]);

    fireEvent.change(screen.getByLabelText("Categoria do artigo"), { target: { value: "c2" } });
    fireEvent.click(screen.getByRole("button", { name: "Publicar artigo" }));

    await waitFor(() => expect(savePostAction).toHaveBeenCalledWith(null, expect.objectContaining({ categoryId: "c2" })));
  });

  it("mantém a categoria de um artigo existente", () => {
    render(<PostForm postId="1" categories={categories} initial={{ ...filled, categoryId: "c1" }} />);

    expect(screen.getByLabelText("Categoria do artigo")).toHaveValue("c1");
  });

  it("sem categorias cadastradas, convida a criar uma", () => {
    render(<PostForm postId={null} categories={[]} initial={filled} />);

    expect(screen.getByRole("link", { name: "Criar categoria" })).toHaveAttribute("href", "/admin/categorias/novo");
  });

  it("mostra o erro de categoria devolvido pelo servidor", async () => {
    savePostAction.mockResolvedValue({ ok: false, error: "Revise.", fieldErrors: { categoryId: "Categoria não encontrada" } });
    render(<PostForm postId={null} categories={categories} initial={filled} />);

    fireEvent.click(screen.getByRole("button", { name: "Publicar artigo" }));

    expect(await screen.findByText("Categoria não encontrada")).toBeInTheDocument();
  });

  describe("SEO para o Google", () => {
    it("a prévia usa o título e o resumo do artigo enquanto os campos de SEO estão vazios", () => {
      render(<PostForm postId="1" categories={categories} initial={filled} />);
      const preview = screen.getByLabelText("Prévia no Google");

      expect(preview).toHaveTextContent("Meu artigo | Deva Karuno Terapias");
      expect(preview).toHaveTextContent("Um resumo com tamanho suficiente.");
      expect(preview).toHaveTextContent("blog › meu-artigo");
    });

    it("a prévia e os contadores acompanham o que a pessoa digita", () => {
      render(<PostForm postId="1" categories={categories} initial={filled} />);

      fireEvent.change(screen.getByLabelText(/Título para o Google/), { target: { value: "Terapia Tântrica no Rio" } });
      fireEvent.change(screen.getByLabelText(/Descrição para o Google/), { target: { value: "Entenda como funciona." } });

      const preview = screen.getByLabelText("Prévia no Google");
      expect(preview).toHaveTextContent("Terapia Tântrica no Rio | Deva Karuno Terapias");
      expect(preview).toHaveTextContent("Entenda como funciona.");
      expect(screen.getByText("(23/60)")).toBeInTheDocument();
      expect(screen.getByText("(22/160)")).toBeInTheDocument();
    });

    it("o contador fica vermelho quando passa do tamanho ideal", () => {
      render(<PostForm postId="1" categories={categories} initial={filled} />);

      fireEvent.change(screen.getByLabelText(/Título para o Google/), { target: { value: "x".repeat(65) } });

      expect(screen.getByText("(65/60)")).toHaveClass("text-error");
    });

    it("envia título e descrição de SEO ao salvar", async () => {
      render(<PostForm postId={null} categories={categories} initial={filled} />);

      fireEvent.change(screen.getByLabelText(/Título para o Google/), { target: { value: "Título SEO" } });
      fireEvent.change(screen.getByLabelText(/Descrição para o Google/), { target: { value: "Descrição SEO" } });
      fireEvent.click(screen.getByRole("button", { name: "Publicar artigo" }));

      await waitFor(() => expect(savePostAction).toHaveBeenCalled());
      expect(savePostAction.mock.calls[0][1]).toMatchObject({ seoTitle: "Título SEO", seoDescription: "Descrição SEO" });
    });

    it("mostra o erro quando passa do limite", async () => {
      render(<PostForm postId={null} categories={categories} initial={filled} />);

      fireEvent.change(screen.getByLabelText(/Título para o Google/), { target: { value: "x".repeat(71) } });
      fireEvent.click(screen.getByRole("button", { name: "Publicar artigo" }));

      expect(await screen.findByText("Máximo de 70 caracteres")).toBeInTheDocument();
      expect(savePostAction).not.toHaveBeenCalled();
    });
  });
});
