/**
 * Caminho: src/components/Blog/BlogFilters/index.test.tsx
 * Arquivo: index.test.tsx
 * Descrição: Testes dos filtros do blog: busca, chips de categoria e tag, limpar filtros, URL e limite de tags.
 */
import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { Blog } from "@/types/blog";
import BlogFilters from "./index";

const post = (over: Partial<Blog>): Blog => ({
  coverImage: "/c.jpg",
  date: "2026-06-10T12:00:00.000Z",
  excerpt: "r",
  ...over,
});

const posts: Blog[] = [
  post({ slug: "a", title: "Meditação para iniciantes", category: "Autoconhecimento", categorySlug: "autoconhecimento", tags: ["Paz"] }),
  post({ slug: "b", title: "Comunicação no casal", category: "Relacionamentos", categorySlug: "relacionamentos", tags: ["Paz", "Escuta"] }),
];

describe("BlogFilters", () => {
  beforeEach(() => window.history.replaceState(null, "", "/blog"));
  afterEach(() => window.history.replaceState(null, "", "/"));

  it("mostra todos os artigos, a contagem e os chips em uso", () => {
    render(<BlogFilters posts={posts} />);

    expect(screen.getByRole("link", { name: /Meditação/ })).toHaveAttribute("href", "/blog/a");
    expect(screen.getByRole("link", { name: /Comunicação/ })).toBeInTheDocument();
    expect(screen.getByText("2 artigos")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Autoconhecimento" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "#Escuta" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Limpar filtros" })).not.toBeInTheDocument();
  });

  it("busca por texto sem diferenciar acento e grava na URL", () => {
    render(<BlogFilters posts={posts} />);

    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar artigos" }), { target: { value: "comunicacao" } });

    expect(screen.queryByRole("link", { name: /Meditação/ })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Comunicação/ })).toBeInTheDocument();
    expect(screen.getByText("1 artigo")).toBeInTheDocument();
    expect(window.location.search).toBe("?q=comunicacao");
  });

  it("filtra por categoria e volta para Todas", () => {
    render(<BlogFilters posts={posts} />);

    fireEvent.click(screen.getByRole("button", { name: "Relacionamentos" }));
    expect(screen.queryByRole("link", { name: /Meditação/ })).not.toBeInTheDocument();
    expect(window.location.search).toBe("?categoria=relacionamentos");

    fireEvent.click(screen.getByRole("button", { name: "Todas" }));
    expect(screen.getByRole("link", { name: /Meditação/ })).toBeInTheDocument();
    expect(window.location.search).toBe("");
  });

  it("filtra por tag e desmarca ao clicar de novo", () => {
    render(<BlogFilters posts={posts} />);

    fireEvent.click(screen.getByRole("button", { name: "#Escuta" }));
    expect(screen.queryByRole("link", { name: /Meditação/ })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "#Escuta" })).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: "#Escuta" }));
    expect(screen.getByRole("link", { name: /Meditação/ })).toBeInTheDocument();
  });

  it("avisa quando nada é encontrado e limpa os filtros", () => {
    render(<BlogFilters posts={posts} />);

    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar artigos" }), { target: { value: "zzz" } });
    expect(screen.getByText(/Nenhum artigo encontrado/)).toBeInTheDocument();
    expect(screen.getByText("0 artigos")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Limpar filtros" }));
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(window.location.search).toBe("");
  });

  it("aplica o filtro que veio no link", () => {
    window.history.replaceState(null, "", "/blog?categoria=autoconhecimento&tag=Paz&q=medita");
    render(<BlogFilters posts={posts} />);

    expect(screen.getByRole("link", { name: /Meditação/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Comunicação/ })).not.toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Buscar artigos" })).toHaveValue("medita");
  });

  it("não mostra grupos de chips quando não há categorias nem tags", () => {
    render(<BlogFilters posts={[post({ slug: "x", title: "Solto" })]} />);

    expect(screen.queryByRole("group", { name: "Categorias" })).not.toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Tags" })).not.toBeInTheDocument();
  });

  it("limita as tags e permite ver todas, mantendo a escolhida visível", () => {
    // 12 tags com o mesmo uso: a ordem alfabética deixa "tag11" fora das 10 primeiras
    const manyTags = Array.from({ length: 12 }, (_, i) => post({ slug: `q${i}`, title: `Q ${i}`, tags: [`tag${String(i).padStart(2, "0")}`] }));
    render(<BlogFilters posts={manyTags} />);

    expect(screen.queryByRole("button", { name: "#tag11" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Ver todas as tags" }));
    expect(screen.getByRole("button", { name: "#tag11" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "#tag11" }));
    fireEvent.click(screen.getByRole("button", { name: "Ver menos tags" }));

    // A tag escolhida continua visível mesmo fora das mais usadas
    expect(screen.getByRole("button", { name: "#tag11" })).toHaveAttribute("aria-pressed", "true");
  });

  it("o HTML do servidor já traz todos os artigos (bom para SEO)", () => {
    const html = renderToString(<BlogFilters posts={posts} />);

    expect(html).toContain("Meditação para iniciantes");
    expect(html).toContain("Comunicação no casal");
  });

  it("acompanha o botão voltar do navegador", () => {
    render(<BlogFilters posts={posts} />);

    act(() => {
      window.history.replaceState(null, "", "/blog?categoria=relacionamentos");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(screen.queryByRole("link", { name: /Meditação/ })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Comunicação/ })).toBeInTheDocument();
  });
});
