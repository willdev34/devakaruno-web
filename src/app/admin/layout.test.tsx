/**
 * Caminho: src/app/admin/layout.test.tsx
 * Arquivo: layout.test.tsx
 * Descrição: Testes do layout do admin: exige o acesso antes de renderizar e não deixa a área indexar.
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AdminLayout, { metadata } from "./layout";

const { requireAdmin } = vi.hoisted(() => ({ requireAdmin: vi.fn() }));

vi.mock("@/lib/admin-session", () => ({ requireAdmin }));
vi.mock("@/components/Admin/AdminSidebar", () => ({ default: () => <nav>menu</nav> }));

describe("AdminLayout", () => {
  it("confere o acesso e renderiza menu e conteúdo", async () => {
    requireAdmin.mockResolvedValue({});

    render(await AdminLayout({ children: <p>conteudo</p> }));

    expect(requireAdmin).toHaveBeenCalled();
    expect(screen.getByText("menu")).toBeInTheDocument();
    expect(screen.getByText("conteudo")).toBeInTheDocument();
  });

  it("não renderiza quando o acesso é negado", async () => {
    requireAdmin.mockRejectedValue(new Error("NEXT_REDIRECT"));

    await expect(AdminLayout({ children: <p>x</p> })).rejects.toThrow("NEXT_REDIRECT");
  });

  it("marca a área como noindex", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
