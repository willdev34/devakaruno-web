/**
 * Caminho: src/lib/repositories/site-settings.test.ts
 * Arquivo: site-settings.test.ts
 * Descrição: Testes do repositório de configurações: leitura com padrão, queda segura do banco e gravação única (upsert).
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_SETTINGS } from "@/lib/settings/defaults";
import { getSiteSettings, saveSiteSettings } from "./site-settings";

const db = vi.hoisted(() => ({ findUnique: vi.fn(), upsert: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: { siteSettings: { findUnique: db.findUnique, upsert: db.upsert } } }));

describe("repositories/site-settings", () => {
  beforeEach(() => Object.values(db).forEach((fn) => fn.mockReset()));

  it("devolve os padrões quando ainda não há linha", async () => {
    db.findUnique.mockResolvedValue(null);

    expect(await getSiteSettings()).toEqual(DEFAULT_SETTINGS);
    expect(db.findUnique).toHaveBeenCalledWith({ where: { id: "main" } });
  });

  it("devolve a linha do banco", async () => {
    db.findUnique.mockResolvedValue({ ...DEFAULT_SETTINGS, id: "main", whatsappNumber: "5511999999999" });

    expect((await getSiteSettings()).whatsappNumber).toBe("5511999999999");
  });

  it("não derruba o site se o banco falhar: usa os padrões e registra o erro", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    db.findUnique.mockRejectedValue(new Error("tabela inexistente"));

    expect(await getSiteSettings()).toEqual(DEFAULT_SETTINGS);
    expect(error).toHaveBeenCalled();
  });

  it("grava na linha única, criando se não existir", async () => {
    await saveSiteSettings(DEFAULT_SETTINGS);

    expect(db.upsert).toHaveBeenCalledWith({
      where: { id: "main" },
      create: { id: "main", ...DEFAULT_SETTINGS },
      update: DEFAULT_SETTINGS,
    });
  });
});
