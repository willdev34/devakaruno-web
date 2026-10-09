/**
 * Caminho: src/components/Cursos/Cursos.test.tsx
 * Arquivo: Cursos.test.tsx
 * Descrição: Testes da listagem de cursos e da página de detalhe (CursosDetail), com o repositório mockado.
 */
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CursosList from "./CursosList";
import CursosDetail from "./CursosDetail";

const { getCourses } = vi.hoisted(() => ({ getCourses: vi.fn() }));

vi.mock("@/lib/repositories/courses", () => ({ getCourses }));

const cursos = [
  { id: "1", slug: "curso-a", title: "Curso A", text: "Resumo A", icon: "/a.svg" },
  { id: "2", slug: "curso-b", title: "Curso B", text: "Resumo B", icon: "/b.svg" },
];

describe("Cursos/CursosList", () => {
  beforeEach(() => {
    getCourses.mockReset();
  });

  it("mostra um card por curso, linkando para a página de detalhe", async () => {
    getCourses.mockResolvedValue(cursos);

    render(await CursosList());

    expect(screen.getByRole("heading", { name: "Curso A" })).toBeInTheDocument();
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/cursos-e-vivencias/curso-a");
    expect(links[1]).toHaveAttribute("href", "/cursos-e-vivencias/curso-b");
  });

  it("não mostra cards quando não há cursos", async () => {
    getCourses.mockResolvedValue([]);

    render(await CursosList());

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});

describe("Cursos/CursosDetail", () => {
  const curso = {
    icon: "/a.svg",
    title: "Curso A",
    detail: "Descrição completa do curso.",
    modalidade: "Individual",
    duracao: "4 horas",
    local: "Rio de Janeiro",
    price: "R$ 500",
    whatsappLink: "https://wa.me/5500000000001",
    faqs: [
      { question: "Pergunta 1?", answer: "Resposta 1." },
      { question: "Pergunta 2?", answer: "Resposta 2." },
    ],
  };

  it("mostra as informações do curso", () => {
    render(<CursosDetail curso={curso} />);

    expect(screen.getByText("Individual")).toBeInTheDocument();
    expect(screen.getByText("4 horas")).toBeInTheDocument();
    expect(screen.getByText("R$ 500")).toBeInTheDocument();
    expect(screen.getByText("Descrição completa do curso.")).toBeInTheDocument();
    expect(screen.getByText("Local: Rio de Janeiro")).toBeInTheDocument();
  });

  it("aponta o botão para o WhatsApp em nova aba", () => {
    render(<CursosDetail curso={curso} />);

    const button = screen.getByRole("link", { name: "Agendar pelo WhatsApp" });
    expect(button).toHaveAttribute("href", "https://wa.me/5500000000001");
    expect(button).toHaveAttribute("target", "_blank");
    expect(button).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("lista as perguntas frequentes", () => {
    render(<CursosDetail curso={curso} />);

    expect(screen.getByRole("heading", { name: "Perguntas frequentes" })).toBeInTheDocument();
    expect(screen.getByText("Pergunta 2?")).toBeInTheDocument();
    expect(screen.getByText("Resposta 1.")).toBeInTheDocument();
  });
});
