/**
 * Caminho: src/app/(site)/cursos-e-vivencias/[slug]/page.test.tsx
 * Arquivo: page.test.tsx
 * Descrição: Testes da página de detalhe do curso: metadados, renderização e 404 quando o slug não existe.
 */
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Page, { generateMetadata } from "./page";

const { getCourseBySlug, notFound } = vi.hoisted(() => ({
  getCourseBySlug: vi.fn(),
  // notFound do Next interrompe a execução lançando um erro
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/lib/repositories/courses", () => ({ getCourseBySlug }));
vi.mock("@/lib/repositories/site-settings", () => ({ getSiteSettings: async () => ({ whatsappNumber: "5511999999999" }) }));
vi.mock("next/navigation", () => ({ notFound }));
vi.mock("@/components/SharedComponent/HeroSub", () => ({
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

const curso = {
  id: "1",
  slug: "curso-a",
  icon: "/a.svg",
  bgImage: "/bg.jpg",
  title: "Curso A",
  text: "Resumo do curso.",
  detail: "Detalhe do curso.",
  modalidade: "Individual",
  duracao: "4 horas",
  local: "Rio de Janeiro",
  price: "R$ 500",
  whatsappLink: "https://wa.me/5500000000001",
  faqs: [{ id: "f1", question: "Pergunta?", answer: "Resposta.", order: 0, courseId: "1" }],
};

const params = (slug: string) => Promise.resolve({ slug });

describe("cursos-e-vivencias/[slug]/page", () => {
  beforeEach(() => {
    getCourseBySlug.mockReset();
    notFound.mockClear();
  });

  it("usa o título do curso nos metadados", async () => {
    getCourseBySlug.mockResolvedValue(curso);

    const metadata = await generateMetadata({ params: params("curso-a") });

    expect(getCourseBySlug).toHaveBeenCalledWith("curso-a");
    expect(metadata.title).toBe("Curso A");
    expect(metadata.alternates?.canonical).toBe("/cursos-e-vivencias/curso-a");
    expect(metadata.description).toBe(curso.text);
  });

  it("usa um título padrão nos metadados quando o curso não existe", async () => {
    getCourseBySlug.mockResolvedValue(null);

    const metadata = await generateMetadata({ params: params("x") });

    expect(metadata.title).toBe("Curso não encontrado");
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("renderiza o curso encontrado", async () => {
    getCourseBySlug.mockResolvedValue(curso);

    render(await Page({ params: params("curso-a") }));

    expect(screen.getByRole("heading", { name: "Curso A" })).toBeInTheDocument();
    expect(screen.getByText("Detalhe do curso.")).toBeInTheDocument();
    expect(screen.getByText("Pergunta?")).toBeInTheDocument();
  });

  it("o botão de WhatsApp usa o número das configurações, mantendo a mensagem do curso", async () => {
    getCourseBySlug.mockResolvedValue({ ...curso, whatsappLink: "https://wa.me/5500000000001?text=Quero%20o%20curso" });

    render(await Page({ params: params("curso-a") }));

    expect(screen.getByRole("link", { name: /Agendar pelo WhatsApp/ })).toHaveAttribute("href", "https://wa.me/5511999999999?text=Quero%20o%20curso");
  });

  it("chama notFound quando o curso não existe", async () => {
    getCourseBySlug.mockResolvedValue(null);

    await expect(Page({ params: params("x") })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });
});
