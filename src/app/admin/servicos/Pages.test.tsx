/**
 * Caminho: src/app/admin/servicos/Pages.test.tsx
 * Arquivo: Pages.test.tsx
 * Descrição: Testes das páginas de serviços do admin: listagem (ordem e trecho), novo e edição (incluindo 404 e a mensagem do WhatsApp).
 */
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminServicesPage from "./page";
import NewServicePage from "./novo/page";
import EditServicePage from "./[id]/page";

const m = vi.hoisted(() => ({
  listAdminServices: vi.fn(),
  getService: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/lib/repositories/admin-services", () => ({ listAdminServices: m.listAdminServices, getService: m.getService }));
vi.mock("next/navigation", () => ({ notFound: m.notFound }));
vi.mock("./actions", () => ({ deleteServiceAction: vi.fn(), moveServiceAction: vi.fn() }));
vi.mock("@/components/Admin/MoveButtons", () => ({
  default: ({ name, isFirst, isLast }: { name: string; isFirst: boolean; isLast: boolean }) => (
    <div data-testid="move">{`${name}|${isFirst}|${isLast}`}</div>
  ),
}));
vi.mock("@/components/Admin/Services/ServiceForm", () => ({
  default: ({ serviceId, initial }: { serviceId: string | null; initial: Record<string, unknown> }) => (
    <div data-testid="form">{`${serviceId}|${initial.title}|${initial.whatsappMessage}`}</div>
  ),
}));
vi.mock("@/components/Admin/Posts/DeleteButton", () => ({ default: ({ name }: { name: string }) => <button>{`Excluir ${name}`}</button> }));

const item = (over = {}) => ({
  id: "1",
  title: "Individual",
  text: "Atendimento individual e acolhedor.",
  icon: "/i.svg",
  whatsappLink: "https://wa.me/5521984121612?text=Ol%C3%A1%21%20Quero",
  order: 1,
  ...over,
});

describe("admin/servicos", () => {
  beforeEach(() => Object.values(m).forEach((fn) => fn.mockReset()));

  it("lista com a posição de cada serviço e o trecho do texto", async () => {
    m.listAdminServices.mockResolvedValue([item(), item({ id: "2", title: "Casais", text: "x".repeat(200) })]);

    render(await AdminServicesPage());

    expect(screen.getAllByTestId("move").map((el) => el.textContent)).toEqual(["Individual|true|false", "Casais|false|true"]);
    expect(screen.getByText(`${"x".repeat(90)}...`)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Editar" })[1]).toHaveAttribute("href", "/admin/servicos/2");
    expect(screen.getByRole("link", { name: "+ Novo serviço" })).toHaveAttribute("href", "/admin/servicos/novo");
  });

  it("lista vazia avisa", async () => {
    m.listAdminServices.mockResolvedValue([]);

    render(await AdminServicesPage());

    expect(screen.getByText("Nenhum serviço cadastrado ainda.")).toBeInTheDocument();
  });

  it("novo abre o formulário com a mensagem inicial", () => {
    render(<NewServicePage />);

    expect(screen.getByTestId("form")).toHaveTextContent("null||Olá! Vi o site da Deva Karuno Terapias");
  });

  it("edição carrega os dados e extrai a mensagem do link", async () => {
    m.getService.mockResolvedValue(item());

    render(await EditServicePage({ params: Promise.resolve({ id: "1" }) }));

    expect(screen.getByTestId("form")).toHaveTextContent("1|Individual|Olá! Quero");
    expect(screen.getByRole("button", { name: "Excluir Individual" })).toBeInTheDocument();
  });

  it("edição de serviço inexistente dá 404", async () => {
    m.getService.mockResolvedValue(null);

    await expect(EditServicePage({ params: Promise.resolve({ id: "x" }) })).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
