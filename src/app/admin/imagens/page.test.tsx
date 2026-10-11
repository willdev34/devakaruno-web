/**
 * Caminho: src/app/admin/imagens/page.test.tsx
 * Arquivo: page.test.tsx
 * Descrição: Testes da página da biblioteca de imagens: grade com uso, vazio, paginação e mensagens de erro.
 */
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminMediaPage from "./page";
import { UploadError } from "@/lib/cloudinary-upload";

const m = vi.hoisted(() => ({ listMedia: vi.fn(), listImageSources: vi.fn() }));

vi.mock("@/lib/media/cloudinary-admin", () => ({ listMedia: m.listMedia }));
vi.mock("@/lib/repositories/admin-media", () => ({ listImageSources: m.listImageSources }));
vi.mock("@/components/Admin/Media/MediaUploader", () => ({ default: () => <div data-testid="uploader" /> }));
vi.mock("@/components/Admin/Media/MediaCard", () => ({
  default: ({ item }: { item: { publicId: string; usages: unknown[] } }) => <li data-testid="card">{`${item.publicId}:${item.usages.length}`}</li>,
}));

const media = (publicId: string) => ({ publicId, url: "u", folder: "", width: 1, height: 1, bytes: 1, format: "jpg", createdAt: "", managed: true });
const params = (cursor?: string) => Promise.resolve({ cursor });

describe("admin/imagens", () => {
  beforeEach(() => {
    Object.values(m).forEach((fn) => fn.mockReset());
    m.listImageSources.mockResolvedValue([{ kind: "Artigo", id: "1", title: "T", href: "/a", texts: ["https://x/upload/v1/foto_a.jpg"] }]);
  });

  it("mostra a grade com a quantidade de usos de cada imagem e o envio", async () => {
    m.listMedia.mockResolvedValue({ items: [media("foto_a"), media("foto_b")], nextCursor: "prox" });

    render(await AdminMediaPage({ searchParams: params() }));

    expect(screen.getByTestId("uploader")).toBeInTheDocument();
    expect(screen.getAllByTestId("card").map((c) => c.textContent)).toEqual(["foto_a:1", "foto_b:0"]);
    expect(screen.getByRole("link", { name: "Próximas imagens" })).toHaveAttribute("href", "/admin/imagens?cursor=prox");
    expect(screen.queryByRole("link", { name: "Voltar ao início" })).not.toBeInTheDocument();
    expect(m.listMedia).toHaveBeenCalledWith(undefined);
  });

  it("em uma página seguinte oferece voltar ao início", async () => {
    m.listMedia.mockResolvedValue({ items: [media("foto_c")], nextCursor: null });

    render(await AdminMediaPage({ searchParams: params("prox") }));

    expect(m.listMedia).toHaveBeenCalledWith("prox");
    expect(screen.getByRole("link", { name: "Voltar ao início" })).toHaveAttribute("href", "/admin/imagens");
    expect(screen.queryByRole("link", { name: "Próximas imagens" })).not.toBeInTheDocument();
  });

  it("biblioteca vazia", async () => {
    m.listMedia.mockResolvedValue({ items: [], nextCursor: null });

    render(await AdminMediaPage({ searchParams: params() }));
    expect(screen.getByText("Nenhuma imagem enviada ainda.")).toBeInTheDocument();
  });

  it("página seguinte sem imagens", async () => {
    m.listMedia.mockResolvedValue({ items: [], nextCursor: null });

    render(await AdminMediaPage({ searchParams: params("x") }));
    expect(screen.getByText("Não há mais imagens.")).toBeInTheDocument();
  });

  it("avisa quando o Cloudinary não está configurado", async () => {
    m.listMedia.mockRejectedValue(new UploadError("x", 503));

    render(await AdminMediaPage({ searchParams: params() }));

    expect(screen.getByRole("alert")).toHaveTextContent("ainda não está configurado");
    expect(screen.getByTestId("uploader")).toBeInTheDocument();
    expect(m.listImageSources).not.toHaveBeenCalled();
  });

  it("mensagem genérica para outras falhas", async () => {
    m.listMedia.mockRejectedValue(new Error("boom"));

    render(await AdminMediaPage({ searchParams: params() }));

    expect(screen.getByRole("alert")).toHaveTextContent("Não foi possível carregar as imagens");
  });
});
