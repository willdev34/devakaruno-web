/**
 * Caminho: src/components/Layout/SiteChrome.test.tsx
 * Arquivo: SiteChrome.test.tsx
 * Descrição: Testes da visibilidade de Header e Footer por rota.
 */
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SiteChrome from "./SiteChrome";

const usePathname = vi.fn();
vi.mock("next/navigation", () => ({ usePathname: () => usePathname() }));

describe("SiteChrome", () => {
  beforeEach(() => usePathname.mockReset());

  it("mostra o conteúdo nas páginas do site", () => {
    usePathname.mockReturnValue("/blog");
    render(<SiteChrome><p>cabecalho</p></SiteChrome>);
    expect(screen.getByText("cabecalho")).toBeInTheDocument();
  });

  it.each(["/em-construcao", "/admin", "/admin/posts"])("esconde em %s", (path) => {
    usePathname.mockReturnValue(path);
    render(<SiteChrome><p>cabecalho</p></SiteChrome>);
    expect(screen.queryByText("cabecalho")).not.toBeInTheDocument();
  });

  it("não esconde rotas com prefixo parecido", () => {
    usePathname.mockReturnValue("/administrador");
    render(<SiteChrome><p>cabecalho</p></SiteChrome>);
    expect(screen.getByText("cabecalho")).toBeInTheDocument();
  });
});
