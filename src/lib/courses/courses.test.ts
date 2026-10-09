/**
 * Caminho: src/lib/courses/courses.test.ts
 * Arquivo: courses.test.ts
 * Descrição: Testes da validação de curso e do caso de uso de salvar: slug, FAQs, link do WhatsApp, slug repetido e edição sem trocar o slug.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { courseInputSchema } from "./schema";
import { saveCourse } from "./save-course";
import { ICON_OPTIONS } from "./icons";

const repo = vi.hoisted(() => ({ createCourse: vi.fn(), updateCourse: vi.fn(), isCourseSlugTaken: vi.fn() }));
vi.mock("@/lib/repositories/admin-courses", () => repo);

const valid = {
  title: "  Curso Individual  ",
  slug: "curso-individual",
  text: "Texto curto do card do curso",
  detail: "Descrição completa do curso, com bastante detalhe.",
  modalidade: "Individual",
  duracao: "Até 4 horas",
  local: "Rio de Janeiro",
  price: "R$ 1.100",
  icon: "/images/services/icon-individual.svg",
  bgImage: "/images/background/hero-curso-individual.jpg",
  whatsappMessage: "Olá! Quero saber mais sobre o curso.",
  faqs: [{ question: "Tem certificado?", answer: "Sim, de participação." }],
};

describe("courseInputSchema", () => {
  it("aceita e limpa os espaços", () => {
    expect(courseInputSchema.parse(valid).title).toBe("Curso Individual");
  });

  it.each(["Curso Individual", "curso_individual", "-curso", "curso--x", "CURSO"])("recusa o slug %s", (slug) => {
    expect(courseInputSchema.safeParse({ ...valid, slug }).success).toBe(false);
  });

  it("recusa faq incompleta e mais de 20 perguntas", () => {
    expect(courseInputSchema.safeParse({ ...valid, faqs: [{ question: "", answer: "" }] }).success).toBe(false);
    const many = Array.from({ length: 21 }, () => ({ question: "Pergunta?", answer: "Resposta ok" }));
    expect(courseInputSchema.safeParse({ ...valid, faqs: many }).success).toBe(false);
  });

  it("aceita curso sem FAQs", () => {
    expect(courseInputSchema.safeParse({ ...valid, faqs: [] }).success).toBe(true);
  });
});

describe("ICON_OPTIONS", () => {
  it("lista os ícones que já existem no site", () => {
    expect(ICON_OPTIONS.map((option) => option.value)).toEqual([
      "/images/services/icon-individual.svg",
      "/images/services/icon-casais.svg",
      "/images/services/icon-cursos.svg",
    ]);
  });
});

describe("saveCourse", () => {
  beforeEach(() => {
    Object.values(repo).forEach((fn) => fn.mockReset());
    repo.isCourseSlugTaken.mockResolvedValue(false);
    repo.createCourse.mockResolvedValue({ id: "novo" });
    repo.updateCourse.mockResolvedValue({ id: "1" });
  });

  it("cria com o link do WhatsApp montado e as FAQs separadas", async () => {
    expect(await saveCourse(null, valid)).toEqual({ ok: true, id: "novo" });

    const [data, faqs] = repo.createCourse.mock.calls[0];
    expect(data.slug).toBe("curso-individual");
    expect(data.whatsappLink).toBe("https://wa.me/5521984121612?text=Ol%C3%A1!%20Quero%20saber%20mais%20sobre%20o%20curso.");
    expect(data).not.toHaveProperty("whatsappMessage");
    expect(data).not.toHaveProperty("faqs");
    expect(faqs).toEqual(valid.faqs);
  });

  it("recusa slug repetido ao criar sem gravar", async () => {
    repo.isCourseSlugTaken.mockResolvedValue(true);

    const result = await saveCourse(null, valid);

    expect(result).toMatchObject({ ok: false, fieldErrors: { slug: "Já existe um curso com esse slug" } });
    expect(repo.createCourse).not.toHaveBeenCalled();
  });

  it("na edição não grava nem confere o slug", async () => {
    expect(await saveCourse("1", { ...valid, slug: "outro-slug" })).toEqual({ ok: true, id: "1" });

    const [id, data] = repo.updateCourse.mock.calls[0];
    expect(id).toBe("1");
    expect(data).not.toHaveProperty("slug");
    expect(repo.isCourseSlugTaken).not.toHaveBeenCalled();
  });

  it("devolve o erro de cada campo sem gravar", async () => {
    const result = await saveCourse(null, { ...valid, title: "", faqs: [{ question: "", answer: "" }] });

    expect(result).toMatchObject({ ok: false, error: "Revise os campos destacados." });
    if (!result.ok) {
      expect(result.fieldErrors.title).toBe("Informe o título");
      expect(result.fieldErrors["faqs.0.question"]).toBe("Escreva a pergunta");
    }
    expect(repo.createCourse).not.toHaveBeenCalled();
    expect(repo.updateCourse).not.toHaveBeenCalled();
  });
});
