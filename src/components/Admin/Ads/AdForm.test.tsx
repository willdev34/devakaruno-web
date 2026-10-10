/**
 * Caminho: src/components/Admin/Ads/AdForm.test.tsx
 * Arquivo: AdForm.test.tsx
 * Descrição: Testes do formulário de banner: validação, dica da posição, período, salvar e erros do servidor.
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdForm from "./AdForm";

const m = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn(), saveAdAction: vi.fn() }));

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: m.push, refresh: m.refresh }) }));
vi.mock("@/app/admin/banners/actions", () => ({ saveAdAction: m.saveAdAction }));

const empty = { name: "", position: "BLOG_LIST" as const, imageUrl: "", linkUrl: "", altText: "", active: true, startsAt: "", endsAt: "" };

function fill() {
  fireEvent.change(screen.getByLabelText("Nome interno *"), { target: { value: "Parceiro X" } });
  fireEvent.change(screen.getByLabelText("URL do banner"), { target: { value: "https://res.cloudinary.com/x/b.jpg" } });
  fireEvent.change(screen.getByLabelText("Texto alternativo *"), { target: { value: "Anúncio do parceiro" } });
  fireEvent.change(screen.getByLabelText("Link do anunciante *"), { target: { value: "https://parceiro.com" } });
}

describe("AdForm", () => {
  beforeEach(() => {
    Object.values(m).forEach((fn) => fn.mockReset());
    m.saveAdAction.mockResolvedValue({ ok: true, id: "1" });
  });

  it("mostra erros quando faltam campos", async () => {
    render(<AdForm adId={null} initial={empty} />);

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByText("Informe o nome do banner")).toBeInTheDocument();
    expect(screen.getByText("Envie a imagem do banner")).toBeInTheDocument();
    expect(screen.getByText("Informe o link do anunciante")).toBeInTheDocument();
    expect(m.saveAdAction).not.toHaveBeenCalled();
  });

  it("mostra a dica da posição escolhida", () => {
    render(<AdForm adId={null} initial={empty} />);

    expect(screen.getByText(/acima da busca e dos artigos/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Onde aparece *"), { target: { value: "POST_END" } });
    expect(screen.getByText(/depois do texto/)).toBeInTheDocument();
  });

  it("recusa fim antes do início", async () => {
    render(<AdForm adId={null} initial={empty} />);
    fill();

    fireEvent.change(screen.getByLabelText("Começa em"), { target: { value: "2026-10-10" } });
    fireEvent.change(screen.getByLabelText("Termina em"), { target: { value: "2026-10-01" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByText("O fim precisa ser depois do início")).toBeInTheDocument();
    expect(m.saveAdAction).not.toHaveBeenCalled();
  });

  it("salva e volta para a listagem", async () => {
    render(<AdForm adId={null} initial={empty} />);
    fill();

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() => expect(m.push).toHaveBeenCalledWith("/admin/banners"));
    expect(m.saveAdAction).toHaveBeenCalledWith(null, expect.objectContaining({ name: "Parceiro X", position: "BLOG_LIST", active: true }));
    expect(m.refresh).toHaveBeenCalled();
  });

  it("na edição envia o id do banner", async () => {
    render(<AdForm adId="7" initial={{ ...empty, name: "A", imageUrl: "/i.jpg", linkUrl: "https://x.com", altText: "alt" }} />);

    fireEvent.change(screen.getByLabelText("Nome interno *"), { target: { value: "Novo nome" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() => expect(m.saveAdAction).toHaveBeenCalledWith("7", expect.objectContaining({ name: "Novo nome" })));
  });

  it("mostra os erros devolvidos pelo servidor", async () => {
    m.saveAdAction.mockResolvedValue({ ok: false, error: "Revise os campos destacados.", fieldErrors: { linkUrl: "Link inválido no servidor" } });
    render(<AdForm adId={null} initial={empty} />);
    fill();

    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByText("Revise os campos destacados.")).toBeInTheDocument();
    expect(screen.getByText("Link inválido no servidor")).toBeInTheDocument();
    expect(m.push).not.toHaveBeenCalled();
  });
});
