/**
 * Caminho: src/components/Admin/Testimonials/Testimonials.test.tsx
 * Arquivo: Testimonials.test.tsx
 * Descrição: Testes do formulário de depoimento: validação, salvar, destaque e erros do servidor.
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TestimonialForm from "./TestimonialForm";

const m = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn(), saveTestimonialAction: vi.fn() }));

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: m.push, refresh: m.refresh }) }));
vi.mock("@/app/admin/depoimentos/actions", () => ({ saveTestimonialAction: m.saveTestimonialAction }));

const empty = { clientName: "", review: "", featured: false };
const filled = { clientName: "Ana", review: "Atendimento muito acolhedor.", featured: true };

describe("TestimonialForm", () => {
  beforeEach(() => {
    Object.values(m).forEach((fn) => fn.mockReset());
    m.saveTestimonialAction.mockResolvedValue({ ok: true, id: "1" });
  });

  it("mostra erros quando faltam campos", async () => {
    render(<TestimonialForm testimonialId={null} initial={empty} />);

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByText("Informe o nome")).toBeInTheDocument();
    expect(screen.getByText(/mínimo de 10 caracteres/)).toBeInTheDocument();
    expect(m.saveTestimonialAction).not.toHaveBeenCalled();
  });

  it("salva e volta para a listagem", async () => {
    render(<TestimonialForm testimonialId="9" initial={filled} />);

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() => expect(m.push).toHaveBeenCalledWith("/admin/depoimentos"));
    expect(m.saveTestimonialAction).toHaveBeenCalledWith("9", { ...filled });
  });

  it("envia o destaque marcado pelo checkbox", async () => {
    render(<TestimonialForm testimonialId={null} initial={{ ...filled, featured: false }} />);

    fireEvent.click(screen.getByLabelText("Destaque no carrossel da Home"));
    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() => expect(m.saveTestimonialAction).toHaveBeenCalledWith(null, expect.objectContaining({ featured: true })));
  });

  it("mostra os erros devolvidos pelo servidor", async () => {
    m.saveTestimonialAction.mockResolvedValue({ ok: false, error: "Revise os campos.", fieldErrors: { clientName: "Nome inválido" } });
    render(<TestimonialForm testimonialId={null} initial={filled} />);

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Revise os campos.");
    expect(screen.getByText("Nome inválido")).toBeInTheDocument();
    expect(m.push).not.toHaveBeenCalled();
  });
});
