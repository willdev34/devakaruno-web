/**
 * Caminho: src/components/Admin/Courses/CourseForm.test.tsx
 * Arquivo: CourseForm.test.tsx
 * Descrição: Testes do formulário de curso e das FAQs: validação, slug acompanhando o título, slug travado na edição, adicionar/remover/mover FAQ, ícone atual, salvar e erros do servidor.
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CourseForm from "./CourseForm";
import type { CourseInput } from "@/lib/courses/schema";

const m = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn(), saveCourseAction: vi.fn(), uploadImageClient: vi.fn() }));

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: m.push, refresh: m.refresh }) }));
vi.mock("@/app/admin/cursos/actions", () => ({ saveCourseAction: m.saveCourseAction }));
vi.mock("@/lib/admin-upload-client", () => ({ uploadImageClient: m.uploadImageClient }));

const empty: CourseInput = {
  title: "",
  slug: "",
  text: "",
  detail: "",
  modalidade: "",
  duracao: "",
  local: "",
  price: "",
  icon: "/images/services/icon-individual.svg",
  bgImage: "",
  whatsappMessage: "",
  faqs: [],
};

const filled: CourseInput = {
  title: "Curso de Casais",
  slug: "curso-de-casais",
  text: "Texto curto do card do curso",
  detail: "Descrição completa do curso, com bastante detalhe.",
  modalidade: "Casal",
  duracao: "Até 4 horas",
  local: "Rio de Janeiro",
  price: "R$ 1.600",
  icon: "/images/services/icon-casais.svg",
  bgImage: "/images/background/hero-curso-casais.jpg",
  whatsappMessage: "Olá! Quero saber mais.",
  faqs: [
    { question: "Primeira pergunta?", answer: "Primeira resposta" },
    { question: "Segunda pergunta?", answer: "Segunda resposta" },
  ],
};

describe("CourseForm", () => {
  beforeEach(() => {
    Object.values(m).forEach((fn) => fn.mockReset());
    m.saveCourseAction.mockResolvedValue({ ok: true, id: "1" });
  });

  it("mostra erros quando faltam campos", async () => {
    render(<CourseForm courseId={null} initial={empty} />);

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByText("Informe o título")).toBeInTheDocument();
    expect(screen.getByText("Envie ou informe a imagem de fundo")).toBeInTheDocument();
    expect(m.saveCourseAction).not.toHaveBeenCalled();
  });

  it("ao criar, o slug acompanha o título até ser editado", () => {
    render(<CourseForm courseId={null} initial={empty} />);

    fireEvent.change(screen.getByLabelText("Título *"), { target: { value: "Vivência em Grupo" } });
    expect(screen.getByLabelText("Slug *")).toHaveValue("vivencia-em-grupo");

    fireEvent.change(screen.getByLabelText("Slug *"), { target: { value: "meu-slug" } });
    fireEvent.change(screen.getByLabelText("Título *"), { target: { value: "Outro título" } });
    expect(screen.getByLabelText("Slug *")).toHaveValue("meu-slug");
  });

  it("ao editar, o slug fica travado e não acompanha o título", () => {
    render(<CourseForm courseId="1" initial={filled} />);

    expect(screen.getByLabelText("Slug *")).toHaveAttribute("readonly");
    fireEvent.change(screen.getByLabelText("Título *"), { target: { value: "Novo nome" } });
    expect(screen.getByLabelText("Slug *")).toHaveValue("curso-de-casais");
  });

  it("mantém o ícone atual na lista mesmo fora dos padrões", () => {
    render(<CourseForm courseId="1" initial={{ ...filled, icon: "/images/outro.svg" }} />);

    expect(screen.getByRole("option", { name: "Atual" })).toHaveValue("/images/outro.svg");
    expect(screen.getByLabelText("Ícone *")).toHaveValue("/images/outro.svg");
  });

  it("adiciona, valida e remove perguntas", async () => {
    render(<CourseForm courseId={null} initial={{ ...filled }} />);

    fireEvent.click(screen.getByRole("button", { name: "+ Adicionar pergunta" }));
    expect(screen.getByText("Pergunta 3")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));
    expect(await screen.findByText("Escreva a pergunta")).toBeInTheDocument();
    expect(screen.getByText("Escreva a resposta")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Remover pergunta 3" }));
    expect(screen.queryByText("Pergunta 3")).not.toBeInTheDocument();
  });

  it("muda a ordem das perguntas e desliga os botões nas pontas", async () => {
    render(<CourseForm courseId="1" initial={filled} />);

    expect(screen.getByRole("button", { name: "Subir pergunta 1" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Descer pergunta 2" })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Descer pergunta 1" }));
    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() => expect(m.saveCourseAction).toHaveBeenCalled());
    expect(m.saveCourseAction.mock.calls[0][1].faqs.map((faq: { question: string }) => faq.question)).toEqual([
      "Segunda pergunta?",
      "Primeira pergunta?",
    ]);
  });

  it("sem FAQs mostra o aviso", () => {
    render(<CourseForm courseId={null} initial={{ ...filled, faqs: [] }} />);

    expect(screen.getByText("Nenhuma pergunta ainda.")).toBeInTheDocument();
  });

  it("envia a imagem de fundo para a subpasta cursos", async () => {
    m.uploadImageClient.mockResolvedValue("https://res.cloudinary.com/x/fundo.png");
    render(<CourseForm courseId={null} initial={{ ...filled }} />);

    fireEvent.change(screen.getByLabelText("Arquivo da capa"), { target: { files: [new File(["a"], "a.png", { type: "image/png" })] } });

    await waitFor(() => expect(screen.getByLabelText("URL da capa")).toHaveValue("https://res.cloudinary.com/x/fundo.png"));
    expect(m.uploadImageClient).toHaveBeenCalledWith(expect.any(File), "cursos");
  });

  it("salva e volta para a listagem", async () => {
    render(<CourseForm courseId="9" initial={filled} />);

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() => expect(m.push).toHaveBeenCalledWith("/admin/cursos"));
    expect(m.saveCourseAction).toHaveBeenCalledWith("9", expect.objectContaining({ slug: "curso-de-casais", whatsappMessage: "Olá! Quero saber mais." }));
  });

  it("mostra os erros devolvidos pelo servidor", async () => {
    m.saveCourseAction.mockResolvedValue({ ok: false, error: "Revise os campos.", fieldErrors: { slug: "Já existe um curso com esse slug" } });
    render(<CourseForm courseId={null} initial={filled} />);

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Revise os campos.");
    expect(screen.getByText("Já existe um curso com esse slug")).toBeInTheDocument();
    expect(m.push).not.toHaveBeenCalled();
  });
});
