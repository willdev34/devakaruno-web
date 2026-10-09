/**
 * Caminho: src/lib/posts/save-post.test.ts
 * Arquivo: save-post.test.ts
 * Descrição: Testes do caso de uso de salvar artigo: validação, slug repetido, criação, edição e agendamento.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { savePost } from "./save-post";

const repo = vi.hoisted(() => ({
  createAdminPost: vi.fn(),
  updateAdminPost: vi.fn(),
  isSlugTaken: vi.fn(),
  ensureAuthor: vi.fn(),
}));

const categories = vi.hoisted(() => ({ categoryExists: vi.fn() }));

vi.mock("@/lib/repositories/admin-posts", () => repo);
vi.mock("@/lib/repositories/admin-categories", () => categories);

const author = { email: "dono@site.com", name: "Deva" };
const valid = {
  title: "Meu artigo",
  subtitle: "",
  slug: "meu-artigo",
  excerpt: "Um resumo com tamanho suficiente.",
  content: "Conteúdo do artigo com texto suficiente.",
  coverImage: "/images/blog/capa.svg",
  tags: ["autoconhecimento"],
  featured: false,
  mode: "now",
};

describe("savePost", () => {
  beforeEach(() => {
    Object.values(repo).forEach((fn) => fn.mockReset());
    repo.isSlugTaken.mockResolvedValue(false);
    categories.categoryExists.mockReset();
    categories.categoryExists.mockResolvedValue(true);
    repo.ensureAuthor.mockResolvedValue({ id: "u1" });
    repo.createAdminPost.mockResolvedValue({ id: "p1", slug: "meu-artigo" });
    repo.updateAdminPost.mockResolvedValue({ id: "p1", slug: "meu-artigo" });
  });

  it("devolve erros por campo quando a validação falha", async () => {
    const result = await savePost(null, { ...valid, title: "" }, author);

    expect(result).toMatchObject({ ok: false, fieldErrors: { title: expect.any(String) } });
    expect(repo.createAdminPost).not.toHaveBeenCalled();
  });

  it("recusa slug já usado por outro artigo", async () => {
    repo.isSlugTaken.mockResolvedValue(true);

    const result = await savePost(null, valid, author);

    expect(result).toMatchObject({ ok: false, fieldErrors: { slug: expect.any(String) } });
  });

  it("cria o artigo publicado agora, com o autor admin", async () => {
    const result = await savePost(null, valid, author);

    expect(result).toEqual({ ok: true, id: "p1", slug: "meu-artigo" });
    const [data, authorId] = repo.createAdminPost.mock.calls[0];
    expect(authorId).toBe("u1");
    expect(data).toMatchObject({ published: true, subtitle: null, tags: ["autoconhecimento"] });
  });

  it("salva como rascunho", async () => {
    await savePost(null, { ...valid, mode: "draft" }, author);

    expect(repo.createAdminPost.mock.calls[0][0].published).toBe(false);
  });

  it("agenda para a data escolhida", async () => {
    const future = new Date(Date.now() + 86_400_000);

    await savePost(null, { ...valid, mode: "schedule", scheduledAt: future.toISOString() }, author);

    expect(repo.createAdminPost.mock.calls[0][0]).toMatchObject({ published: true, publishedAt: future });
  });

  it("atualiza quando recebe o id, sem recriar o autor", async () => {
    const result = await savePost("p1", valid, author);

    expect(result).toMatchObject({ ok: true, id: "p1" });
    expect(repo.updateAdminPost).toHaveBeenCalledWith("p1", expect.objectContaining({ slug: "meu-artigo" }));
    expect(repo.isSlugTaken).toHaveBeenCalledWith("meu-artigo", "p1");
    expect(repo.ensureAuthor).not.toHaveBeenCalled();
  });

  describe("categoria", () => {
    it("sem categoria grava null e nem consulta o banco", async () => {
      await savePost(null, { ...valid, categoryId: "" }, author);

      expect(repo.createAdminPost).toHaveBeenCalledWith(expect.objectContaining({ categoryId: null }), "u1");
      expect(categories.categoryExists).not.toHaveBeenCalled();
    });

    it("grava a categoria escolhida quando ela existe", async () => {
      await savePost(null, { ...valid, categoryId: "c1" }, author);

      expect(categories.categoryExists).toHaveBeenCalledWith("c1");
      expect(repo.createAdminPost).toHaveBeenCalledWith(expect.objectContaining({ categoryId: "c1" }), "u1");
    });

    it("também grava ao editar", async () => {
      await savePost("p1", { ...valid, categoryId: "c1" }, author);

      expect(repo.updateAdminPost).toHaveBeenCalledWith("p1", expect.objectContaining({ categoryId: "c1" }));
    });

    it("recusa categoria que não existe, sem gravar", async () => {
      categories.categoryExists.mockResolvedValue(false);

      const result = await savePost(null, { ...valid, categoryId: "fantasma" }, author);

      expect(result).toMatchObject({ ok: false, fieldErrors: { categoryId: "Categoria não encontrada" } });
      expect(repo.createAdminPost).not.toHaveBeenCalled();
    });
  });
});
