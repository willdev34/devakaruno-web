/**
 * Caminho: src/components/Blog/BlogList/index.test.tsx
 * Arquivo: index.test.tsx
 * Descrição: Testes da listagem do blog: artigos do banco entregues aos filtros e mensagem quando ainda não há artigos.
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BlogList from "./index";

const { getPublishedPosts } = vi.hoisted(() => ({ getPublishedPosts: vi.fn() }));

vi.mock("@/lib/repositories/posts", () => ({ getPublishedPosts }));
vi.mock("@/components/Ads/AdSlot", () => ({ default: () => <div>ad</div> }));

describe("BlogList", () => {
  it("renderiza um card por artigo com link para o post", async () => {
    getPublishedPosts.mockResolvedValue([
      { slug: "a", title: "Artigo A", excerpt: "r", coverImage: "/c.jpg", date: "2026-06-10T12:00:00.000Z" },
    ]);

    render(await BlogList());

    expect(screen.getByRole("link", { name: /Artigo A/ })).toHaveAttribute("href", "/blog/a");
    expect(screen.getByText("10 de junho, 2026")).toBeInTheDocument();
  });

  it("avisa quando não há artigos", async () => {
    getPublishedPosts.mockResolvedValue([]);

    render(await BlogList());

    expect(screen.getByText(/estarão disponíveis em breve/)).toBeInTheDocument();
  });
});
