/**
 * Caminho: src/components/Admin/Editor/RichEditor.test.tsx
 * Arquivo: RichEditor.test.tsx
 * Descrição: Testes do editor com o Tiptap simulado: barra de formatação, troca de modo, foto no texto e erro de envio.
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RichEditor from "./RichEditor";

const h = vi.hoisted(() => {
  const calls: string[] = [];
  const chain: Record<string, unknown> = {};
  const proxy: unknown = new Proxy(chain, {
    get: (_t, prop: string) => (prop === "run" ? () => calls.push("run") : (...args: unknown[]) => { calls.push(`${prop}:${JSON.stringify(args)}`); return proxy; }),
  });
  const editor = {
    chain: () => proxy,
    isActive: (name: string) => name === "bold",
    getAttributes: () => ({ href: "https://antigo.com" }),
    commands: { setContent: vi.fn() },
    storage: { markdown: { getMarkdown: () => "# md" } },
  };
  let onUpdate: ((arg: { editor: typeof editor }) => void) | undefined;
  return { calls, editor, setUpdate: (fn: typeof onUpdate) => (onUpdate = fn), getUpdate: () => onUpdate };
});

vi.mock("@tiptap/react", () => ({
  useEditor: (options: { onUpdate: (arg: { editor: typeof h.editor }) => void }) => {
    h.setUpdate(options.onUpdate);
    return h.editor;
  },
  EditorContent: () => <div data-testid="editor-content" />,
}));
vi.mock("@tiptap/starter-kit", () => ({ default: { configure: () => ({}) } }));
vi.mock("@tiptap/extension-image", () => ({ default: {} }));
vi.mock("@tiptap/extension-link", () => ({ default: { configure: () => ({}) } }));
vi.mock("@tiptap/extension-placeholder", () => ({ default: { configure: () => ({}) } }));
vi.mock("tiptap-markdown", () => ({ Markdown: { configure: () => ({}) } }));

const setup = (upload = vi.fn().mockResolvedValue("https://img/x.jpg")) => {
  const onChange = vi.fn();
  render(<RichEditor value="texto" onChange={onChange} onUploadImage={upload} />);
  return { onChange, upload };
};

describe("RichEditor", () => {
  beforeEach(() => {
    h.calls.length = 0;
    h.editor.commands.setContent.mockClear();
  });

  it("executa os comandos da barra e marca o ativo", () => {
    setup();

    fireEvent.click(screen.getByRole("button", { name: "Título" }));
    fireEvent.click(screen.getByRole("button", { name: "Subtítulo" }));
    fireEvent.click(screen.getByRole("button", { name: "Negrito" }));
    fireEvent.click(screen.getByRole("button", { name: "Itálico" }));
    fireEvent.click(screen.getByRole("button", { name: "Citação" }));
    fireEvent.click(screen.getByRole("button", { name: "Lista" }));
    fireEvent.click(screen.getByRole("button", { name: "Lista numerada" }));
    fireEvent.click(screen.getByRole("button", { name: "Divisória" }));
    fireEvent.click(screen.getByRole("button", { name: "Desfazer" }));
    fireEvent.click(screen.getByRole("button", { name: "Refazer" }));

    expect(h.calls).toContain('toggleHeading:[{"level":2}]');
    expect(h.calls).toContain("toggleBold:[]");
    expect(h.calls).toContain("setHorizontalRule:[]");
    expect(screen.getByRole("button", { name: "Negrito" })).toHaveAttribute("aria-pressed", "true");
  });

  it("avisa a mudança de conteúdo em markdown", () => {
    const { onChange } = setup();

    h.getUpdate()!({ editor: h.editor });

    expect(onChange).toHaveBeenCalledWith("# md");
  });

  it("insere e remove link", () => {
    setup();
    const prompt = vi.spyOn(window, "prompt");

    prompt.mockReturnValueOnce("https://novo.com");
    fireEvent.click(screen.getByRole("button", { name: "Link" }));
    prompt.mockReturnValueOnce("");
    fireEvent.click(screen.getByRole("button", { name: "Link" }));
    prompt.mockReturnValueOnce(null);
    fireEvent.click(screen.getByRole("button", { name: "Link" }));

    expect(h.calls).toContain('setLink:[{"href":"https://novo.com"}]');
    expect(h.calls).toContain("unsetLink:[]");
  });

  it("alterna para markdown, edita e volta ao visual", () => {
    const { onChange } = setup();

    fireEvent.click(screen.getByRole("button", { name: "markdown" }));
    fireEvent.change(screen.getByLabelText("Conteúdo em markdown"), { target: { value: "## novo" } });
    expect(onChange).toHaveBeenCalledWith("## novo");
    expect(screen.queryByRole("button", { name: "Negrito" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "visual" }));
    expect(h.editor.commands.setContent).toHaveBeenCalledWith("texto");
    expect(screen.getByTestId("editor-content")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "visual" }));
    expect(h.editor.commands.setContent).toHaveBeenCalledTimes(1);
  });

  it("envia a foto e a insere no texto", async () => {
    const { upload } = setup();
    const file = new File(["a"], "capa-linda.png", { type: "image/png" });

    fireEvent.change(screen.getByLabelText("Escolher foto para o texto"), { target: { files: [file] } });

    await waitFor(() => expect(h.calls).toContain('setImage:[{"src":"https://img/x.jpg","alt":"capa-linda"}]'));
    expect(upload).toHaveBeenCalledWith(file);
  });

  it("mostra o erro quando o envio falha e ignora seleção vazia", async () => {
    const { upload } = setup(vi.fn().mockRejectedValue(new Error("Upload não configurado")));

    fireEvent.change(screen.getByLabelText("Escolher foto para o texto"), { target: { files: [] } });
    expect(upload).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("Escolher foto para o texto"), {
      target: { files: [new File(["a"], "a.png", { type: "image/png" })] },
    });

    expect(await screen.findByRole("alert")).toHaveTextContent("Upload não configurado");
  });

  it("clicar em Foto abre o seletor de arquivo", () => {
    setup();
    const click = vi.spyOn(HTMLInputElement.prototype, "click").mockImplementation(() => {});

    fireEvent.click(screen.getByRole("button", { name: "Foto" }));

    expect(click).toHaveBeenCalled();
  });
});
