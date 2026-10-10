/**
 * Caminho: src/components/Ads/AdSlot.test.tsx
 * Arquivo: AdSlot.test.tsx
 * Descrição: Testes do espaço de banner: mostra o banner com aviso de publicidade, some quando não há e não derruba a página se a busca falhar.
 */
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdSlot from "./AdSlot";

const { getActiveAd } = vi.hoisted(() => ({ getActiveAd: vi.fn() }));
vi.mock("@/lib/repositories/ads", () => ({ getActiveAd }));

describe("AdSlot", () => {
  // Chaves de propósito: o retorno do mockReset (uma função) seria chamado como limpeza pelo Vitest
  beforeEach(() => {
    getActiveAd.mockReset();
  });

  it("mostra o banner com link patrocinado e aviso de publicidade", async () => {
    getActiveAd.mockResolvedValue({ name: "X", imageUrl: "/b.jpg", linkUrl: "https://parceiro.com", altText: "Anúncio do parceiro" });

    render(await AdSlot({ position: "BLOG_LIST" }));

    expect(getActiveAd).toHaveBeenCalledWith("BLOG_LIST");
    expect(screen.getByText("Publicidade")).toBeInTheDocument();
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://parceiro.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "sponsored noopener noreferrer");
    expect(screen.getByAltText("Anúncio do parceiro")).toHaveAttribute("src", "/b.jpg");
  });

  it("não renderiza nada quando não há banner no ar", async () => {
    getActiveAd.mockResolvedValue(null);

    expect(await AdSlot({ position: "POST_END" })).toBeNull();
  });

  it("não derruba a página quando a busca falha", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    getActiveAd.mockRejectedValue(new Error("tabela inexistente"));

    expect(await AdSlot({ position: "POST_END" })).toBeNull();
    expect(error).toHaveBeenCalled();
  });
});
