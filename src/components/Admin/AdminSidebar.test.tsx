/**
 * Caminho: src/components/Admin/AdminSidebar.test.tsx
 * Arquivo: AdminSidebar.test.tsx
 * Descrição: Testes do menu lateral do admin: item ativo, itens "em breve", abrir no celular e sair.
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminSidebar from "./AdminSidebar";

const { usePathname, signOut } = vi.hoisted(() => ({ usePathname: vi.fn(), signOut: vi.fn() }));

vi.mock("next/navigation", () => ({ usePathname }));
vi.mock("next-auth/react", () => ({ signOut }));
vi.mock("@iconify/react", () => ({ Icon: () => null }));
vi.mock("@/components/Layout/Header/Logo", () => ({ default: () => <span>logo</span> }));

describe("AdminSidebar", () => {
  beforeEach(() => {
    usePathname.mockReturnValue("/admin");
    signOut.mockClear();
  });

  it("marca o Dashboard como página atual", () => {
    render(<AdminSidebar />);

    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute("aria-current", "page");
  });

  it("mostra itens sem tela como 'em breve', sem link", () => {
    render(<AdminSidebar />);

    expect(screen.queryByRole("link", { name: /Serviços/ })).not.toBeInTheDocument();
    expect(screen.getAllByText("em breve").length).toBeGreaterThan(0);
  });

  it("abre e fecha o menu no celular", () => {
    render(<AdminSidebar />);

    fireEvent.click(screen.getByRole("button", { name: "Abrir menu" }));
    fireEvent.click(screen.getByRole("link", { name: "Dashboard" }));

    expect(screen.getByRole("navigation", { name: "Menu do admin" })).toBeInTheDocument();
  });

  it("sai e volta para o site", () => {
    render(<AdminSidebar />);

    fireEvent.click(screen.getByRole("button", { name: "Sair" }));

    expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/" });
  });
});

describe("AdminSidebar (marca)", () => {
  it("mostra o logo e o título do painel", () => {
    usePathname.mockReturnValue("/admin");
    render(<AdminSidebar />);

    expect(screen.getByText("logo")).toBeInTheDocument();
    expect(screen.getAllByText("Meu painel administrativo").length).toBeGreaterThan(0);
  });
});
