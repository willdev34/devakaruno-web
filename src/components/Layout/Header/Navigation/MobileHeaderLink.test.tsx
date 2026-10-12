/**
 * Caminho: src/components/Layout/Header/Navigation/MobileHeaderLink.test.tsx
 * Arquivo: MobileHeaderLink.test.tsx
 * Descrição: Testes do link do menu mobile: avisa o Header ao navegar (para recolher o menu) e não recolhe ao abrir um submenu.
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MobileHeaderLink from "./MobileHeaderLink";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

describe("MobileHeaderLink", () => {
  it("chama onNavigate ao clicar num link simples", () => {
    const onNavigate = vi.fn();
    render(<MobileHeaderLink item={{ label: "Blog", href: "/blog" }} onNavigate={onNavigate} />);
    fireEvent.click(screen.getByText("Blog"));
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it("abre o submenu sem recolher o menu e recolhe ao escolher um subitem", () => {
    const onNavigate = vi.fn();
    render(
      <MobileHeaderLink
        item={{ label: "Mais", href: "#", submenu: [{ label: "Agenda", href: "/agenda" }] }}
        onNavigate={onNavigate}
      />,
    );
    fireEvent.click(screen.getByText("Mais"));
    expect(onNavigate).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Agenda"));
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });
});
