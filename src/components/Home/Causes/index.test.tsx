/**
 * Caminho: src/components/Home/Causes/index.test.tsx
 * Arquivo: index.test.tsx
 * Descrição: Testes do bloco de Serviços da Home, com o Prisma mockado: cards com título, texto e link do WhatsApp, e lista vazia.
 */
import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Service } from "@/generated/prisma/client";
import Causes from "./index";

const { findMany } = vi.hoisted(() => ({ findMany: vi.fn() }));

vi.mock("@/lib/prisma", () => ({ prisma: { service: { findMany } } }));

const services: Service[] = [
  { id: "1", icon: "/images/services/icon-individual.svg", title: "Individual", text: "Sessões 1:1.", whatsappLink: "https://wa.me/5500000000001", order: 1 },
  { id: "2", icon: "/images/services/icon-casais.svg", title: "Casais", text: "Trabalho relacional.", whatsappLink: "https://wa.me/5500000000002", order: 2 },
  { id: "3", icon: "/images/services/icon-cursos.svg", title: "Cursos", text: "Programas de imersão.", whatsappLink: "https://wa.me/5500000000003", order: 3 },
];

describe("Home/Causes", () => {
  beforeEach(() => {
    findMany.mockReset();
  });

  it("busca os serviços ordenados por order", async () => {
    findMany.mockResolvedValue(services);

    render(await Causes());

    expect(findMany).toHaveBeenCalledWith({ orderBy: { order: "asc" } });
  });

  it("renderiza um card por serviço com título, texto e link do WhatsApp", async () => {
    findMany.mockResolvedValue(services);

    render(await Causes());

    const cards = screen.getAllByRole("link");
    expect(cards).toHaveLength(services.length);

    services.forEach((service, index) => {
      const card = cards[index];
      expect(within(card).getByRole("heading", { name: service.title })).toBeInTheDocument();
      expect(within(card).getByText(service.text)).toBeInTheDocument();
      expect(card).toHaveAttribute("href", service.whatsappLink);
      expect(card).toHaveAttribute("target", "_blank");
      expect(card).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("mantém o cabeçalho da seção e não renderiza cards quando não há serviços", async () => {
    findMany.mockResolvedValue([]);

    render(await Causes());

    expect(screen.getByRole("heading", { name: "Como podemos trabalhar juntos" })).toBeInTheDocument();
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });
});
