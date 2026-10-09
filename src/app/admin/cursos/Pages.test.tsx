/**
 * Caminho: src/app/admin/cursos/Pages.test.tsx
 * Arquivo: Pages.test.tsx
 * Descrição: Testes das páginas de cursos do admin: listagem, novo (valores iniciais) e edição (dados, FAQs, mensagem do WhatsApp e 404).
 */
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminCoursesPage from "./page";
import NewCoursePage from "./novo/page";
import EditCoursePage from "./[id]/page";

const m = vi.hoisted(() => ({
  listAdminCourses: vi.fn(),
  getAdminCourse: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/lib/repositories/admin-courses", () => ({ listAdminCourses: m.listAdminCourses, getAdminCourse: m.getAdminCourse }));
vi.mock("next/navigation", () => ({ notFound: m.notFound }));
vi.mock("./actions", () => ({ deleteCourseAction: vi.fn() }));
vi.mock("@/components/Admin/Courses/CourseForm", () => ({
  default: ({ courseId, initial }: { courseId: string | null; initial: Record<string, unknown> }) => (
    <div data-testid="form">{`${courseId}|${initial.slug}|${initial.icon}|${initial.whatsappMessage}|${(initial.faqs as unknown[]).length}`}</div>
  ),
}));
vi.mock("@/components/Admin/Posts/DeleteButton", () => ({ default: ({ name }: { name: string }) => <button>{`Excluir ${name}`}</button> }));

const course = (over = {}) => ({
  id: "1",
  slug: "curso-individual",
  title: "Curso Individual",
  modalidade: "Individual",
  price: "R$ 1.100",
  text: "t",
  detail: "d",
  duracao: "4h",
  local: "RJ",
  icon: "/images/services/icon-individual.svg",
  bgImage: "/bg.jpg",
  whatsappLink: "https://wa.me/5521984121612?text=Ol%C3%A1%21%20Quero",
  _count: { faqs: 4 },
  faqs: [{ question: "P1?", answer: "R1" }, { question: "P2?", answer: "R2" }],
  ...over,
});

describe("admin/cursos", () => {
  beforeEach(() => Object.values(m).forEach((fn) => fn.mockReset()));

  it("lista os cursos com FAQs, link do site e ações", async () => {
    m.listAdminCourses.mockResolvedValue([course(), course({ id: "2", slug: "casais", title: "Curso Casais", _count: { faqs: 0 } })]);

    render(await AdminCoursesPage());

    expect(screen.getByText("Curso Individual")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Ver no site" })[0]).toHaveAttribute("href", "/cursos-e-vivencias/curso-individual");
    expect(screen.getAllByRole("link", { name: "Editar" })[1]).toHaveAttribute("href", "/admin/cursos/2");
    expect(screen.getByRole("link", { name: "+ Novo curso" })).toHaveAttribute("href", "/admin/cursos/novo");
  });

  it("lista vazia avisa", async () => {
    m.listAdminCourses.mockResolvedValue([]);

    render(await AdminCoursesPage());

    expect(screen.getByText("Nenhum curso cadastrado ainda.")).toBeInTheDocument();
  });

  it("novo abre com o primeiro ícone, mensagem inicial e sem FAQs", () => {
    render(<NewCoursePage />);

    expect(screen.getByTestId("form")).toHaveTextContent(
      "null||/images/services/icon-individual.svg|Olá! Vi o site da Deva Karuno Terapias e gostaria de saber mais sobre o curso |0",
    );
  });

  it("edição carrega slug, FAQs e a mensagem tirada do link", async () => {
    m.getAdminCourse.mockResolvedValue(course());

    render(await EditCoursePage({ params: Promise.resolve({ id: "1" }) }));

    expect(screen.getByTestId("form")).toHaveTextContent("1|curso-individual|/images/services/icon-individual.svg|Olá! Quero|2");
    expect(screen.getByRole("button", { name: "Excluir Curso Individual" })).toBeInTheDocument();
  });

  it("edição de curso inexistente dá 404", async () => {
    m.getAdminCourse.mockResolvedValue(null);

    await expect(EditCoursePage({ params: Promise.resolve({ id: "x" }) })).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
