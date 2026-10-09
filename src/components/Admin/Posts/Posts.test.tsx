/**
 * Caminho: src/components/Admin/Posts/Posts.test.tsx
 * Arquivo: Posts.test.tsx
 * Descrição: Testes dos componentes de artigos do admin: tags, capa, selo de status e botão de excluir.
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TagsInput from "./TagsInput";
import CoverUpload from "./CoverUpload";
import StatusBadge from "./StatusBadge";
import DeleteButton from "./DeleteButton";

const { push, refresh } = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push, refresh }) }));

describe("TagsInput", () => {
  it("adiciona com Enter e por vírgula, sem repetir", () => {
    const onChange = vi.fn();
    render(<TagsInput value={["a"]} onChange={onChange} />);

    fireEvent.change(screen.getByLabelText("Nova tag"), { target: { value: "b, a, c" } });
    fireEvent.keyDown(screen.getByLabelText("Nova tag"), { key: "Enter" });

    expect(onChange).toHaveBeenCalledWith(["a", "b", "c"]);
  });

  it("botão + adiciona e vazio não faz nada", () => {
    const onChange = vi.fn();
    render(<TagsInput value={[]} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Adicionar tag" }));
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("Nova tag"), { target: { value: "x" } });
    fireEvent.click(screen.getByRole("button", { name: "Adicionar tag" }));
    expect(onChange).toHaveBeenCalledWith(["x"]);
  });

  it("outras teclas não adicionam e remover tira a tag", () => {
    const onChange = vi.fn();
    render(<TagsInput value={["a", "b"]} onChange={onChange} />);

    fireEvent.keyDown(screen.getByLabelText("Nova tag"), { key: "a" });
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Remover a" }));
    expect(onChange).toHaveBeenCalledWith(["b"]);
  });
});

describe("CoverUpload", () => {
  const file = new File(["a"], "capa.png", { type: "image/png" });

  it("envia o arquivo escolhido e devolve a URL", async () => {
    const onChange = vi.fn();
    const onUpload = vi.fn().mockResolvedValue("https://x/capa.png");
    render(<CoverUpload value="" onChange={onChange} onUpload={onUpload} />);

    fireEvent.change(screen.getByLabelText("Arquivo da capa"), { target: { files: [file] } });

    await waitFor(() => expect(onChange).toHaveBeenCalledWith("https://x/capa.png"));
  });

  it("aceita arrastar e soltar", async () => {
    const onChange = vi.fn();
    render(<CoverUpload value="" onChange={onChange} onUpload={vi.fn().mockResolvedValue("https://x/d.png")} />);
    const zone = screen.getByRole("button", { name: "Enviar imagem de capa" });

    fireEvent.dragOver(zone);
    fireEvent.drop(zone, { dataTransfer: { files: [file] } });

    await waitFor(() => expect(onChange).toHaveBeenCalledWith("https://x/d.png"));
  });

  it("mostra erro de envio, prévia e permite colar URL", async () => {
    const onChange = vi.fn();
    render(<CoverUpload value="https://x/p.png" onChange={onChange} onUpload={vi.fn().mockRejectedValue(new Error("falhou"))} />);

    expect(screen.getByAltText("Prévia da capa")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Arquivo da capa"), { target: { files: [file] } });
    expect(await screen.findByRole("alert")).toHaveTextContent("falhou");

    fireEvent.change(screen.getByLabelText("URL da capa"), { target: { value: "https://novo" } });
    expect(onChange).toHaveBeenCalledWith("https://novo");
  });

  it("ignora seleção vazia e abre o seletor com Enter", () => {
    const onUpload = vi.fn();
    const click = vi.spyOn(HTMLInputElement.prototype, "click").mockImplementation(() => {});
    render(<CoverUpload value="" onChange={vi.fn()} onUpload={onUpload} />);

    fireEvent.change(screen.getByLabelText("Arquivo da capa"), { target: { files: [] } });
    fireEvent.keyDown(screen.getByRole("button", { name: "Enviar imagem de capa" }), { key: "Enter" });
    fireEvent.keyDown(screen.getByRole("button", { name: "Enviar imagem de capa" }), { key: "a" });

    expect(onUpload).not.toHaveBeenCalled();
    expect(click).toHaveBeenCalledTimes(1);
  });

  it("usa mensagem padrão para erro sem texto", async () => {
    render(<CoverUpload value="" onChange={vi.fn()} onUpload={vi.fn().mockRejectedValue("x")} />);

    fireEvent.change(screen.getByLabelText("Arquivo da capa"), { target: { files: [file] } });

    expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível enviar a imagem.");
  });
});

describe("StatusBadge", () => {
  it.each([["published", "Publicado"], ["scheduled", "Agendado"], ["draft", "Rascunho"]] as const)("%s", (status, text) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(text)).toBeInTheDocument();
  });
});

describe("DeleteButton", () => {
  beforeEach(() => {
    push.mockClear();
    refresh.mockClear();
  });

  it("não exclui se a pessoa cancelar", () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const action = vi.fn();
    render(<DeleteButton id="1" name="Artigo" action={action} />);

    fireEvent.click(screen.getByRole("button", { name: "Excluir" }));

    expect(action).not.toHaveBeenCalled();
  });

  it("exclui e atualiza a página", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const action = vi.fn().mockResolvedValue({ ok: true });
    render(<DeleteButton id="1" name="Artigo" action={action} />);

    fireEvent.click(screen.getByRole("button", { name: "Excluir" }));

    await waitFor(() => expect(refresh).toHaveBeenCalled());
    expect(action).toHaveBeenCalledWith("1");
  });

  it("exclui e vai para outra página quando redirectTo existe", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<DeleteButton id="1" name="Artigo" action={vi.fn().mockResolvedValue({})} redirectTo="/admin/artigos" />);

    fireEvent.click(screen.getByRole("button", { name: "Excluir" }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/admin/artigos"));
  });
});
