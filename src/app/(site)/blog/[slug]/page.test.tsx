/**
 * Caminho: src/app/(site)/blog/[slug]/page.test.tsx
 * Arquivo: page.test.tsx
 * Descrição: Testes da página de artigo: renderização do conteúdo, 404 para slug inexistente e metadados.
 */
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Post, { generateMetadata } from "./page";

const { getPostBySlug, notFound } = vi.hoisted(() => ({
  getPostBySlug: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/lib/repositories/posts", () => ({ getPostBySlug }));
vi.mock("next/navigation", () => ({ notFound }));
vi.mock("@/components/Ads/AdSlot", () => ({ default: () => <div>ad</div> }));
vi.mock("@/components/Blog/LatestBlog", () => ({ default: () => <div>latest</div> }));
vi.mock("@/components/Home/WhatsAppCTA", () => ({ default: () => <div>cta</div> }));

const post = {
  slug: "a",
  title: "Artigo A",
  excerpt: "Resumo A",
  coverImage: "/capa.jpg",
  date: "2026-06-10T12:00:00.000Z",
  author: "Deva Karuno",
  content: "Olá **mundo**",
  subtitle: "Um subtítulo",
  tags: ["autoconhecimento"],
};
const params = (slug: string) => Promise.resolve({ slug });

describe("blog/[slug]/page", () => {
  beforeEach(() => {
    getPostBySlug.mockReset();
    notFound.mockClear();
  });

  it("renderiza título, autor, data e conteúdo em HTML", async () => {
    getPostBySlug.mockResolvedValue(post);

    render(await Post({ params: params("a") }));

    expect(screen.getByRole("heading", { level: 1, name: "Artigo A" })).toBeInTheDocument();
    expect(screen.getByText("Deva Karuno")).toBeInTheDocument();
    expect(screen.getByText("10 de junho, 2026")).toBeInTheDocument();
    expect(screen.getByText("mundo").tagName).toBe("STRONG");
  });

  it("mostra subtítulo, tags e tempo de leitura", async () => {
    getPostBySlug.mockResolvedValue(post);

    render(await Post({ params: params("a") }));

    expect(screen.getByText("Um subtítulo")).toBeInTheDocument();
    expect(screen.getByText("autoconhecimento")).toBeInTheDocument();
    expect(screen.getByText("1 min de leitura")).toBeInTheDocument();
  });

  it("não mostra subtítulo nem tags quando não existem", async () => {
    getPostBySlug.mockResolvedValue({ ...post, subtitle: null, tags: [] });

    render(await Post({ params: params("a") }));

    expect(screen.queryByText("Um subtítulo")).not.toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("chama notFound quando o artigo não existe", async () => {
    getPostBySlug.mockResolvedValue(null);

    await expect(Post({ params: params("x") })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });

  it("gera metadados com descrição e Open Graph", async () => {
    getPostBySlug.mockResolvedValue(post);

    const meta = await generateMetadata({ params: params("a") });

    expect(meta.title).toBe("Artigo A | Deva Karuno Terapias");
    expect(meta.description).toBe("Resumo A");
    expect(meta.openGraph?.images).toEqual(["/capa.jpg"]);
  });

  it("marca como noindex quando o artigo não existe", async () => {
    getPostBySlug.mockResolvedValue(null);

    const meta = await generateMetadata({ params: params("x") });

    expect(meta.robots).toEqual({ index: false, follow: false });
  });
});
