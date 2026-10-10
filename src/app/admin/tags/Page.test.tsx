/**
 * Caminho: src/app/admin/tags/Page.test.tsx
 * Arquivo: Page.test.tsx
 * Descrição: Testes da página de tags do admin: listagem com contagem e lista vazia.
 */
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminTagsPage from "./page";

const m = vi.hoisted(() => ({ listAllPostTags: vi.fn() }));

vi.mock("@/lib/repositories/admin-tags", () => ({ listAllPostTags: m.listAllPostTags }));
vi.mock("@/components/Admin/Tags/TagActions", () => ({
  default: ({ name, otherNames }: { name: string; otherNames: string[] }) => <span data-testid="actions">{`${name}|${otherNames.join(",")}`}</span>,
}));

describe("admin/tags", () => {
  beforeEach(() => m.listAllPostTags.mockReset());

  it("lista as tags com o total de artigos e as outras tags para mesclar", async () => {
    m.listAllPostTags.mockResolvedValue([{ id: "1", tags: ["Paz", "Escuta"] }, { id: "2", tags: ["Paz"] }]);

    render(await AdminTagsPage());

    expect(screen.getByText("#Paz")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getAllByTestId("actions")[0]).toHaveTextContent("Paz|Escuta");
    expect(screen.getByText(/2 tag\(s\) em uso/)).toBeInTheDocument();
  });

  it("avisa quando nenhum artigo usa tags", async () => {
    m.listAllPostTags.mockResolvedValue([{ id: "1", tags: [] }]);

    render(await AdminTagsPage());

    expect(screen.getByText("Nenhum artigo usa tags ainda.")).toBeInTheDocument();
  });
});
