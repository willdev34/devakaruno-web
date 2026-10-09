/**
 * Caminho: src/components/Home/FutureEvents/index.test.tsx
 * Arquivo: index.test.tsx
 * Descrição: Testes do bloco de Cursos e Vivências da Home, com o repositório mockado.
 */
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FutureEvents from "./index";

const { getCourses } = vi.hoisted(() => ({ getCourses: vi.fn() }));

vi.mock("@/lib/repositories/courses", () => ({ getCourses }));

const cursos = [
  { id: "1", slug: "curso-a", title: "Curso A", text: "Resumo A", icon: "/a.svg" },
  { id: "2", slug: "curso-b", title: "Curso B", text: "Resumo B", icon: "/b.svg" },
];

describe("Home/FutureEvents", () => {
  beforeEach(() => {
    getCourses.mockReset();
  });

  it("mostra o título da seção e um card por curso com link para o detalhe", async () => {
    getCourses.mockResolvedValue(cursos);

    render(await FutureEvents());

    expect(screen.getByRole("heading", { name: "Cursos e Vivências" })).toBeInTheDocument();
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[1]).toHaveAttribute("href", "/cursos-e-vivencias/curso-b");
    expect(screen.getByText("Resumo A")).toBeInTheDocument();
  });

  it("não mostra cards quando não há cursos", async () => {
    getCourses.mockResolvedValue([]);

    render(await FutureEvents());

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
