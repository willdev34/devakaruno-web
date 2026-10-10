/**
 * Caminho: src/components/Admin/Media/Media.test.tsx
 * Arquivo: Media.test.tsx
 * Descrição: Testes do cartão de imagem (copiar URL, excluir, bloqueios) e do envio em lote da biblioteca.
 */
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MediaCard, { type MediaCardItem } from "./MediaCard";
import MediaUploader from "./MediaUploader";

const m = vi.hoisted(() => ({ refresh: vi.fn(), deleteMediaAction: vi.fn(), uploadImageClient: vi.fn() }));

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: m.refresh }) }));
vi.mock("@/app/admin/imagens/actions", () => ({ deleteMediaAction: m.deleteMediaAction }));
vi.mock("@/lib/admin-upload-client", () => ({ uploadImageClient: m.uploadImageClient }));

const item = (over: Partial<MediaCardItem> = {}): MediaCardItem => ({
  publicId: "devakaruno-web/biblioteca/foto_ab",
  url: "https://res.cloudinary.com/c/image/upload/v1/devakaruno-web/biblioteca/foto_ab.jpg",
  folder: "devakaruno-web/biblioteca",
  width: 800,
  height: 600,
  bytes: 2048,
  format: "jpg",
  createdAt: "2026-10-10T15:00:00Z",
  managed: true,
  usages: [],
  ...over,
});

const renderCard = (over?: Partial<MediaCardItem>) => render(<ul><MediaCard item={item(over)} /></ul>);

describe("MediaCard", () => {
  beforeEach(() => {
    Object.values(m).forEach((fn) => fn.mockReset());
    vi.restoreAllMocks();
  });

  it("mostra nome, medidas, pasta e que não há uso", () => {
    renderCard();

    expect(screen.getByText("foto_ab")).toBeInTheDocument();
    expect(screen.getByText(/800x600 · 2 KB · JPG · 10\/10\/2026/)).toBeInTheDocument();
    expect(screen.getByText("Pasta: devakaruno-web/biblioteca")).toBeInTheDocument();
    expect(screen.getByText("Sem uso nos artigos, cursos e banners.")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "foto_ab" })).toHaveAttribute("src", expect.stringContaining("f_auto,q_auto,w_480"));
  });

  it("imagem na raiz mostra 'Sem pasta' e não permite excluir", () => {
    renderCard({ folder: "", managed: false });

    expect(screen.getByText("Sem pasta")).toBeInTheDocument();
    expect(screen.getByText("Só pelo Cloudinary")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Excluir" })).not.toBeInTheDocument();
  });

  it("imagem em uso lista onde e bloqueia a exclusão", () => {
    renderCard({ usages: [{ kind: "Artigo", id: "1", title: "Paz", href: "/admin/artigos/1" }] });

    expect(screen.getByRole("link", { name: "Paz" })).toHaveAttribute("href", "/admin/artigos/1");
    expect(screen.getByText("Em uso")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Excluir" })).not.toBeInTheDocument();
  });

  it("copia a URL", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    renderCard();

    fireEvent.click(screen.getByRole("button", { name: "Copiar URL" }));

    await waitFor(() => expect(screen.getByRole("button", { name: "URL copiada" })).toBeInTheDocument());
    expect(writeText).toHaveBeenCalledWith(item().url);
  });

  it("avisa quando não consegue copiar", async () => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error("x")) } });
    renderCard();

    fireEvent.click(screen.getByRole("button", { name: "Copiar URL" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível copiar");
  });

  it("exclui depois de confirmar e atualiza a lista", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    m.deleteMediaAction.mockResolvedValue({ ok: true });
    renderCard();

    fireEvent.click(screen.getByRole("button", { name: "Excluir" }));

    await waitFor(() => expect(m.refresh).toHaveBeenCalled());
    expect(m.deleteMediaAction).toHaveBeenCalledWith("devakaruno-web/biblioteca/foto_ab");
  });

  it("não exclui se o usuário cancelar a confirmação", () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    renderCard();

    fireEvent.click(screen.getByRole("button", { name: "Excluir" }));

    expect(m.deleteMediaAction).not.toHaveBeenCalled();
  });

  it("mostra o motivo quando o servidor recusa", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    m.deleteMediaAction.mockResolvedValue({ ok: false, error: 'Imagem em uso em: Artigo "Paz".' });
    renderCard();

    fireEvent.click(screen.getByRole("button", { name: "Excluir" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Imagem em uso");
    expect(m.refresh).not.toHaveBeenCalled();
  });
});

describe("MediaUploader", () => {
  beforeEach(() => Object.values(m).forEach((fn) => fn.mockReset()));

  const file = (name: string) => new File(["a"], name, { type: "image/png" });

  it("envia os arquivos um a um para a pasta biblioteca e atualiza a lista", async () => {
    m.uploadImageClient.mockResolvedValue("https://x/a.png");
    render(<MediaUploader />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Arquivos de imagem"), { target: { files: [file("a.png"), file("b.png")] } });
    });

    expect(m.uploadImageClient).toHaveBeenCalledTimes(2);
    expect(m.uploadImageClient.mock.calls[0][1]).toBe("biblioteca");
    expect(await screen.findByRole("status")).toHaveTextContent("2 imagem(ns) enviada(s).");
    expect(m.refresh).toHaveBeenCalled();
  });

  it("lista os arquivos que falharam e conta só os que subiram", async () => {
    m.uploadImageClient.mockResolvedValueOnce("ok").mockRejectedValueOnce(new Error("A imagem passa de 10MB.")).mockRejectedValueOnce("x");
    render(<MediaUploader />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Arquivos de imagem"), { target: { files: [file("a.png"), file("grande.png"), file("c.png")] } });
    });

    expect(screen.getByRole("status")).toHaveTextContent("1 imagem(ns) enviada(s).");
    expect(screen.getByRole("alert")).toHaveTextContent("grande.png: A imagem passa de 10MB.");
    expect(screen.getByRole("alert")).toHaveTextContent("c.png: falhou");
  });

  it("quando todas falham não anuncia sucesso", async () => {
    m.uploadImageClient.mockRejectedValue(new Error("x"));
    render(<MediaUploader />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Arquivos de imagem"), { target: { files: [file("a.png")] } });
    });

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("não faz nada sem arquivos", async () => {
    render(<MediaUploader />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Arquivos de imagem"), { target: { files: [] } });
    });

    expect(m.uploadImageClient).not.toHaveBeenCalled();
  });

  it("aceita arrastar e soltar e abre o seletor pelo teclado", async () => {
    m.uploadImageClient.mockResolvedValue("ok");
    render(<MediaUploader />);
    const zone = screen.getByRole("button", { name: "Enviar imagens" });

    await act(async () => {
      fireEvent.drop(zone, { dataTransfer: { files: [file("a.png")] } });
    });
    expect(m.uploadImageClient).toHaveBeenCalledTimes(1);

    const click = vi.spyOn(screen.getByLabelText("Arquivos de imagem"), "click");
    fireEvent.keyDown(zone, { key: "Enter" });
    fireEvent.dragOver(zone);
    expect(click).toHaveBeenCalled();
  });
});

describe("MediaPicker", () => {
  const picker = async () => (await import("./MediaPicker")).default;
  const page = (names: string[], nextCursor: string | null = null) => ({
    ok: true,
    json: async () => ({ items: names.map((n) => ({ publicId: `pasta/${n}`, url: `https://res.cloudinary.com/c/image/upload/v1/pasta/${n}.jpg` })), nextCursor }),
  });

  beforeEach(() => vi.unstubAllGlobals());

  it("carrega a primeira página e devolve a URL da imagem escolhida", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(page(["foto_a", "foto_b"])));
    const MediaPicker = await picker();
    const onSelect = vi.fn();
    render(<MediaPicker onSelect={onSelect} onClose={vi.fn()} />);

    fireEvent.click(await screen.findByRole("button", { name: "Usar foto_b" }));

    expect(onSelect).toHaveBeenCalledWith("https://res.cloudinary.com/c/image/upload/v1/pasta/foto_b.jpg");
    expect(screen.queryByRole("button", { name: "Carregar mais" })).not.toBeInTheDocument();
  });

  it("carrega mais páginas, somando às anteriores", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(page(["foto_a"], "prox")).mockResolvedValueOnce(page(["foto_b"]));
    vi.stubGlobal("fetch", fetchMock);
    const MediaPicker = await picker();
    render(<MediaPicker onSelect={vi.fn()} onClose={vi.fn()} />);

    fireEvent.click(await screen.findByRole("button", { name: "Carregar mais" }));

    expect(await screen.findByRole("button", { name: "Usar foto_b" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Usar foto_a" })).toBeInTheDocument();
    expect(fetchMock.mock.calls[1][0]).toBe("/api/admin/media?cursor=prox");
  });

  it("biblioteca vazia", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(page([])));
    const MediaPicker = await picker();
    render(<MediaPicker onSelect={vi.fn()} onClose={vi.fn()} />);

    expect(await screen.findByText("Nenhuma imagem enviada ainda.")).toBeInTheDocument();
  });

  it("mostra a mensagem do servidor quando a listagem falha", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: "Cloudinary não configurado no servidor." }) }));
    const MediaPicker = await picker();
    render(<MediaPicker onSelect={vi.fn()} onClose={vi.fn()} />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Cloudinary não configurado");
  });

  it("mensagem genérica quando a resposta não tem corpo ou a rede cai", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce({ ok: false, json: async () => { throw new Error("x"); } }));
    const MediaPicker = await picker();
    const first = render(<MediaPicker onSelect={vi.fn()} onClose={vi.fn()} />);
    expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível carregar as imagens.");
    first.unmount();

    vi.stubGlobal("fetch", vi.fn().mockRejectedValue("queda"));
    render(<MediaPicker onSelect={vi.fn()} onClose={vi.fn()} />);
    expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível carregar as imagens.");
  });

  it("fecha pelo botão e pela tecla Esc", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(page([])));
    const MediaPicker = await picker();
    const onClose = vi.fn();
    render(<MediaPicker onSelect={vi.fn()} onClose={onClose} />);
    await screen.findByText("Nenhuma imagem enviada ainda.");

    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.keyDown(window, { key: "a" });

    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
