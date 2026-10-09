/**
 * Caminho: src/components/Admin/Categories/CategoryForm.test.tsx
 * Arquivo: CategoryForm.test.tsx
 * Descrição: Testes do formulário de categoria: slug automático, slug travado na edição, validação, salvar e erros do servidor.
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CategoryForm from "./CategoryForm";

const m = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn(), saveCategoryAction: vi.fn() }));

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: m.push, refresh: m.refresh }) }));
vi.mock("@/app/admin/categorias/actions", () => ({ saveCategoryAction: m.saveCategoryAction }));

const empty = { name: "", slug: "", description: "" };
const filled = { name: "Autoconhecimento", slug: "autoconhecimento", description: "" };

describe("CategoryForm", () => {
  beforeEach(() => {
    Object.values(m).forEach((fn) => fn.mockReset());
    m.saveCategoryAction.mockResolvedValue({ ok: true, id: "1" });
  });

  it("gera o slug a partir do nome até a pessoa editar o slug", () => {
    render(<CategoryForm categoryId={null} initial={empty} />);

    fireEvent.change(screen.getByLabelText("Nome *"), { target: { value: "Relações Íntimas" } });
    expect(screen.getByLabelText("Slug *")).toHaveValue("relacoes-intimas");

    fireEvent.change(screen.getByLabelText("Slug *"), { target: { value: "meu-slug" } });
    fireEvent.change(screen.getByLabelText("Nome *"), { target: { value: "Outro nome" } });
    expect(screen.getByLabelText("Slug *")).toHaveValue("meu-slug");
  });

  it("na edição o slug fica travado e não acompanha o nome", () => {
    render(<CategoryForm categoryId="1" initial={filled} />);

    expect(screen.getByLabelText("Slug *")).toHaveAttribute("readonly");
    fireEvent.change(screen.getByLabelText("Nome *"), { target: { value: "Novo nome" } });
    expect(screen.getByLabelText("Slug *")).toHaveValue("autoconhecimento");
    expect(screen.getByText(/não muda depois de criada/)).toBeInTheDocument();
  });

  it("mostra erros quando faltam campos", async () => {
    render(<CategoryForm categoryId={null} initial={empty} />);

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByText("Informe o nome")).toBeInTheDocument();
    expect(screen.getByText("Informe o slug")).toBeInTheDocument();
    expect(m.saveCategoryAction).not.toHaveBeenCalled();
  });

  it("salva e volta para a listagem", async () => {
    render(<CategoryForm categoryId="9" initial={filled} />);

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() => expect(m.push).toHaveBeenCalledWith("/admin/categorias"));
    expect(m.saveCategoryAction).toHaveBeenCalledWith("9", { ...filled });
  });

  it("mostra os erros devolvidos pelo servidor", async () => {
    m.saveCategoryAction.mockResolvedValue({ ok: false, error: "Revise os campos.", fieldErrors: { slug: "Já existe uma categoria com esse slug" } });
    render(<CategoryForm categoryId={null} initial={filled} />);

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Revise os campos.");
    expect(screen.getByText("Já existe uma categoria com esse slug")).toBeInTheDocument();
    expect(m.push).not.toHaveBeenCalled();
  });
});
