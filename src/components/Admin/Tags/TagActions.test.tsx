/**
 * Caminho: src/components/Admin/Tags/TagActions.test.tsx
 * Arquivo: TagActions.test.tsx
 * Descrição: Testes das ações de tag: renomear, aviso de mesclagem, cancelar, remover com confirmação e erros do servidor.
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TagActions from "./TagActions";

const m = vi.hoisted(() => ({ refresh: vi.fn(), renameTagAction: vi.fn(), removeTagAction: vi.fn() }));

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: m.refresh }) }));
vi.mock("@/app/admin/tags/actions", () => ({ renameTagAction: m.renameTagAction, removeTagAction: m.removeTagAction }));

const props = { tagKey: "paz", name: "Paz", count: 2, otherNames: ["Escuta", "Respiração"] };

describe("TagActions", () => {
  beforeEach(() => {
    Object.values(m).forEach((fn) => fn.mockReset());
    m.renameTagAction.mockResolvedValue({ ok: true, affected: 2 });
    m.removeTagAction.mockResolvedValue({ ok: true, affected: 2 });
  });

  it("renomeia e atualiza a página", async () => {
    render(<TagActions {...props} />);

    fireEvent.click(screen.getByRole("button", { name: "Renomear ou mesclar" }));
    fireEvent.change(screen.getByLabelText("Novo nome da tag Paz"), { target: { value: "Serenidade" } });
    expect(screen.queryByText(/serão unidos/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() => expect(m.refresh).toHaveBeenCalled());
    expect(m.renameTagAction).toHaveBeenCalledWith("paz", "Serenidade");
    expect(screen.getByRole("button", { name: "Renomear ou mesclar" })).toBeInTheDocument();
  });

  it("avisa que vai mesclar quando o nome já existe, mesmo com outro acento", () => {
    render(<TagActions {...props} />);

    fireEvent.click(screen.getByRole("button", { name: "Renomear ou mesclar" }));
    fireEvent.change(screen.getByLabelText("Novo nome da tag Paz"), { target: { value: "respiracao" } });

    expect(screen.getByText(/serão unidos nela/)).toBeInTheDocument();
  });

  it("cancelar volta ao nome original sem chamar o servidor", () => {
    render(<TagActions {...props} />);

    fireEvent.click(screen.getByRole("button", { name: "Renomear ou mesclar" }));
    fireEvent.change(screen.getByLabelText("Novo nome da tag Paz"), { target: { value: "Outro" } });
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    fireEvent.click(screen.getByRole("button", { name: "Renomear ou mesclar" }));

    expect(screen.getByLabelText("Novo nome da tag Paz")).toHaveValue("Paz");
    expect(m.renameTagAction).not.toHaveBeenCalled();
  });

  it("mostra o erro do servidor e mantém a edição aberta", async () => {
    m.renameTagAction.mockResolvedValue({ ok: false, error: "Informe o nome da tag" });
    render(<TagActions {...props} />);

    fireEvent.click(screen.getByRole("button", { name: "Renomear ou mesclar" }));
    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByText("Informe o nome da tag")).toBeInTheDocument();
    expect(m.refresh).not.toHaveBeenCalled();
  });

  it("remove depois de confirmar", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<TagActions {...props} />);

    fireEvent.click(screen.getByRole("button", { name: "Remover" }));

    await waitFor(() => expect(m.removeTagAction).toHaveBeenCalledWith("paz"));
    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining("2 artigo(s)"));
    await waitFor(() => expect(m.refresh).toHaveBeenCalled());
  });

  it("não remove se a pessoa cancelar a confirmação", () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    render(<TagActions {...props} />);

    fireEvent.click(screen.getByRole("button", { name: "Remover" }));

    expect(m.removeTagAction).not.toHaveBeenCalled();
  });

  it("mostra erro quando a remoção falha sem mensagem", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    m.removeTagAction.mockResolvedValue({ ok: false });
    render(<TagActions {...props} />);

    fireEvent.click(screen.getByRole("button", { name: "Remover" }));

    expect(await screen.findByText("Não foi possível concluir.")).toBeInTheDocument();
  });
});
