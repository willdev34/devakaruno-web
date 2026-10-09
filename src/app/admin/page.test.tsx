/**
 * Caminho: src/app/admin/page.test.tsx
 * Arquivo: page.test.tsx
 * Descrição: Testes do dashboard do admin: números, artigos recentes com status e estado vazio.
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AdminDashboardPage from "./page";

const { getDashboardStats } = vi.hoisted(() => ({ getDashboardStats: vi.fn() }));

vi.mock("@/lib/repositories/admin-stats", () => ({ getDashboardStats }));

const base = { posts: { published: 3, scheduled: 1, drafts: 2 }, testimonials: 13, courses: 3 };

describe("AdminDashboardPage", () => {
  it("mostra os números e os artigos recentes com status", async () => {
    getDashboardStats.mockResolvedValue({
      ...base,
      recent: [
        { id: "1", title: "Artigo A", status: "draft", updatedAt: new Date("2026-10-08T12:00:00Z") },
        { id: "2", title: "Artigo B", status: "scheduled", updatedAt: new Date("2026-10-07T12:00:00Z") },
      ],
    });

    render(await AdminDashboardPage());

    expect(screen.getByText("Artigos no ar").nextSibling).toHaveTextContent("3");
    expect(screen.getByText("Depoimentos").nextSibling).toHaveTextContent("13");
    expect(screen.getByText("Artigo A")).toBeInTheDocument();
    expect(screen.getByText("Rascunho")).toBeInTheDocument();
    expect(screen.getByText("Agendado", { selector: "span" })).toBeInTheDocument();
  });

  it("avisa quando não há artigos", async () => {
    getDashboardStats.mockResolvedValue({ ...base, recent: [] });

    render(await AdminDashboardPage());

    expect(screen.getByText("Nenhum artigo ainda.")).toBeInTheDocument();
  });
});
