/**
 * Caminho: src/components/Blog/LatestBlog/index.test.tsx
 * Arquivo: index.test.tsx
 * Descrição: Testes do bloco de últimos artigos: lista geral, exclusão do post atual e seção oculta quando não há posts.
 */
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LatestBlog from "./index";

const { getPublishedPosts, getRelatedPosts } = vi.hoisted(() => ({
  getPublishedPosts: vi.fn(),
  getRelatedPosts: vi.fn(),
}));

vi.mock("@/lib/repositories/posts", () => ({ getPublishedPosts, getRelatedPosts }));
vi.mock("@iconify/react/dist/iconify.js", () => ({ Icon: () => null }));

const post = {
  slug: "a",
  title: "Artigo A",
  excerpt: "Resumo",
  coverImage: "/capa.jpg",
  date: "2026-06-10T12:00:00.000Z",
  author: "Deva Karuno",
};

describe("LatestBlog", () => {
  beforeEach(() => {
    getPublishedPosts.mockReset();
    getRelatedPosts.mockReset();
  });

  it("mostra os últimos artigos", async () => {
    getPublishedPosts.mockResolvedValue([post]);

    render(await LatestBlog({}));

    expect(getPublishedPosts).toHaveBeenCalledWith(2);
    expect(screen.getByText("Últimos artigos")).toBeInTheDocument();
    expect(screen.getByText("Artigo A")).toBeInTheDocument();
  });

  it("usa os relacionados quando recebe o slug atual", async () => {
    getRelatedPosts.mockResolvedValue([post]);

    render(await LatestBlog({ excludeSlug: "b" }));

    expect(getRelatedPosts).toHaveBeenCalledWith("b", 2);
    expect(getPublishedPosts).not.toHaveBeenCalled();
  });

  it("não renderiza nada quando não há posts", async () => {
    getPublishedPosts.mockResolvedValue([]);

    expect(await LatestBlog({})).toBeNull();
  });
});
