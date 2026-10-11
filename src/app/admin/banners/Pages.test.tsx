/**
 * Caminho: src/app/admin/banners/Pages.test.tsx
 * Arquivo: Pages.test.tsx
 * Descrição: Testes das páginas de banners do admin: listagem por posição com situação e período, nova e edição (incluindo 404).
 */
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminAdsPage from "./page";
import NewAdPage from "./novo/page";
import EditAdPage from "./[id]/page";

const m = vi.hoisted(() => ({
  listAdminAds: vi.fn(),
  getAd: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/lib/repositories/admin-ads", () => ({ listAdminAds: m.listAdminAds, getAd: m.getAd }));
vi.mock("next/navigation", () => ({ notFound: m.notFound }));
vi.mock("./actions", () => ({ deleteAdAction: vi.fn(), moveAdAction: vi.fn() }));
vi.mock("@/components/Admin/MoveButtons", () => ({ default: ({ name, isFirst, isLast }: { name: string; isFirst: boolean; isLast: boolean }) => <span data-testid="move">{`${name}:${isFirst}:${isLast}`}</span> }));
vi.mock("@/components/Admin/Posts/DeleteButton", () => ({ default: ({ name }: { name: string }) => <button>{`Excluir ${name}`}</button> }));
vi.mock("@/components/Admin/Ads/AdForm", () => ({
  default: ({ adId, initial }: { adId: string | null; initial: Record<string, unknown> }) => (
    <div data-testid="form">{`${adId}|${initial.name}|${initial.position}|${initial.startsAt}|${initial.endsAt}`}</div>
  ),
}));

const ad = (over = {}) => ({
  id: "1",
  name: "Parceiro X",
  position: "BLOG_LIST",
  imageUrl: "/b.jpg",
  linkUrl: "https://x.com",
  altText: "alt",
  active: true,
  startsAt: null,
  endsAt: null,
  ...over,
});

describe("admin/banners", () => {
  beforeEach(() => Object.values(m).forEach((fn) => fn.mockReset()));

  it("lista agrupado por posição, com situação e período", async () => {
    m.listAdminAds.mockResolvedValue([
      ad(),
      ad({ id: "2", name: "Segundo", active: false }),
      ad({ id: "3", name: "Do fim", position: "POST_END", startsAt: new Date("2020-01-02T12:00:00.000Z"), endsAt: new Date("2099-12-31T12:00:00.000Z") }),
      ad({ id: "4", name: "Velho", position: "POST_END", endsAt: new Date("2020-01-02T12:00:00.000Z") }),
      ad({ id: "5", name: "Futuro", position: "POST_END", startsAt: new Date("2099-01-02T12:00:00.000Z") }),
    ]);

    render(await AdminAdsPage());

    expect(screen.getByText("Topo da listagem do blog")).toBeInTheDocument();
    expect(screen.getByText("Fim do artigo")).toBeInTheDocument();
    expect(screen.getAllByText("No ar")).toHaveLength(2);
    expect(screen.getByText("Desativado")).toBeInTheDocument();
    expect(screen.getByText("Encerrado")).toBeInTheDocument();
    expect(screen.getByText("Agendado")).toBeInTheDocument();
    expect(screen.getAllByText("Sem prazo")).toHaveLength(2);
    expect(screen.getByText("02/01/2020 a 31/12/2099")).toBeInTheDocument();
    expect(screen.getByText("início a 02/01/2020")).toBeInTheDocument();
    expect(screen.getByText("02/01/2099 a sem fim")).toBeInTheDocument();
    // Pontas calculadas dentro de cada posição
    expect(screen.getByText("Parceiro X:true:false")).toBeInTheDocument();
    expect(screen.getByText("Segundo:false:true")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Editar" })[0]).toHaveAttribute("href", "/admin/banners/1");
    expect(screen.getByRole("link", { name: "+ Novo banner" })).toHaveAttribute("href", "/admin/banners/novo");
  });

  it("não mostra posição sem banners", async () => {
    m.listAdminAds.mockResolvedValue([ad()]);

    render(await AdminAdsPage());

    expect(screen.queryByText("Fim do artigo")).not.toBeInTheDocument();
  });

  it("lista vazia avisa", async () => {
    m.listAdminAds.mockResolvedValue([]);

    render(await AdminAdsPage());

    expect(screen.getByText("Nenhum banner cadastrado ainda.")).toBeInTheDocument();
  });

  it("novo abre o formulário vazio", () => {
    render(<NewAdPage />);

    expect(screen.getByTestId("form")).toHaveTextContent("null||BLOG_LIST||");
  });

  it("edição carrega os dados e converte as datas", async () => {
    m.getAd.mockResolvedValue(ad({ position: "POST_END", startsAt: new Date("2020-10-10T12:00:00.000Z") }));

    render(await EditAdPage({ params: Promise.resolve({ id: "1" }) }));

    expect(screen.getByTestId("form")).toHaveTextContent("1|Parceiro X|POST_END|2020-10-10|");
    expect(screen.getByRole("button", { name: "Excluir Parceiro X" })).toBeInTheDocument();
  });

  it("edição de banner inexistente dá 404", async () => {
    m.getAd.mockResolvedValue(null);

    await expect(EditAdPage({ params: Promise.resolve({ id: "x" }) })).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
