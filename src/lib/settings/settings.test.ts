/**
 * Caminho: src/lib/settings/settings.test.ts
 * Arquivo: settings.test.ts
 * Descrição: Testes das configurações do site: validação (formatos de código e links), padrões, junção com o banco e caso de uso de salvar.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { siteSettingsSchema } from "./schema";
import { DEFAULT_SETTINGS, mergeSettings } from "./defaults";
import { saveSettings } from "./save-settings";

const repo = vi.hoisted(() => ({ saveSiteSettings: vi.fn() }));
vi.mock("@/lib/repositories/site-settings", () => repo);

describe("siteSettingsSchema", () => {
  it("os padrões do site são válidos", () => {
    expect(siteSettingsSchema.safeParse(DEFAULT_SETTINGS).success).toBe(true);
  });

  it("aceita número com símbolos e recusa número curto ou com letras demais", () => {
    expect(siteSettingsSchema.safeParse({ ...DEFAULT_SETTINGS, whatsappNumber: "+55 (21) 98412-1612" }).success).toBe(true);
    expect(siteSettingsSchema.safeParse({ ...DEFAULT_SETTINGS, whatsappNumber: "12345" }).success).toBe(false);
    expect(siteSettingsSchema.safeParse({ ...DEFAULT_SETTINGS, whatsappNumber: "abc" }).success).toBe(false);
  });

  it("valida e-mail, mensagem e endereço", () => {
    expect(siteSettingsSchema.safeParse({ ...DEFAULT_SETTINGS, email: "sem-arroba" }).success).toBe(false);
    expect(siteSettingsSchema.safeParse({ ...DEFAULT_SETTINGS, whatsappMessage: "Oi" }).success).toBe(false);
    expect(siteSettingsSchema.safeParse({ ...DEFAULT_SETTINGS, address: "" }).success).toBe(false);
  });

  it("redes sociais podem ficar vazias, mas precisam ser http ou https", () => {
    expect(siteSettingsSchema.safeParse({ ...DEFAULT_SETTINGS, instagramUrl: "" }).success).toBe(true);
    expect(siteSettingsSchema.safeParse({ ...DEFAULT_SETTINGS, instagramUrl: "instagram.com/x" }).success).toBe(false);
    expect(siteSettingsSchema.safeParse({ ...DEFAULT_SETTINGS, facebookUrl: "javascript:alert(1)" }).success).toBe(false);
  });

  it("códigos de rastreamento só aceitam o formato exato (entram em scripts)", () => {
    const ok = { ...DEFAULT_SETTINGS, gtmId: "GTM-ABC1234", gaId: "G-ABCDEF1234", metaPixelId: "123456789012345", searchConsoleCode: "abcDEF123_-abcDEF123_-xyz" };
    expect(siteSettingsSchema.safeParse(ok).success).toBe(true);
    expect(siteSettingsSchema.safeParse({ ...ok, gtmId: "GTM-X'];alert(1)//" }).success).toBe(false);
    expect(siteSettingsSchema.safeParse({ ...ok, gaId: "UA-123" }).success).toBe(false);
    expect(siteSettingsSchema.safeParse({ ...ok, metaPixelId: "12ab" }).success).toBe(false);
    expect(siteSettingsSchema.safeParse({ ...ok, searchConsoleCode: "curto" }).success).toBe(false);
    expect(siteSettingsSchema.safeParse({ ...ok, searchConsoleCode: '"><script>' }).success).toBe(false);
  });
});

describe("mergeSettings", () => {
  it("sem linha no banco, vale o padrão", () => {
    expect(mergeSettings(null)).toBe(DEFAULT_SETTINGS);
  });

  it("a linha do banco vence o padrão, inclusive redes vazias (ícone escondido)", () => {
    const merged = mergeSettings({ ...DEFAULT_SETTINGS, whatsappNumber: "5511999999999", tiktokUrl: "", gtmId: "GTM-ABC1234" });
    expect(merged.whatsappNumber).toBe("5511999999999");
    expect(merged.tiktokUrl).toBe("");
    expect(merged.gtmId).toBe("GTM-ABC1234");
  });

  it("campos essenciais vazios voltam ao padrão", () => {
    const merged = mergeSettings({ ...DEFAULT_SETTINGS, whatsappNumber: "", email: "" });
    expect(merged.whatsappNumber).toBe(DEFAULT_SETTINGS.whatsappNumber);
    expect(merged.email).toBe(DEFAULT_SETTINGS.email);
  });
});

describe("saveSettings", () => {
  beforeEach(() => repo.saveSiteSettings.mockReset());

  it("grava com o número só com dígitos", async () => {
    expect(await saveSettings({ ...DEFAULT_SETTINGS, whatsappNumber: "+55 (21) 98412-1612" })).toEqual({ ok: true });
    expect(repo.saveSiteSettings).toHaveBeenCalledWith(expect.objectContaining({ whatsappNumber: "5521984121612" }));
  });

  it("devolve o erro de cada campo sem gravar", async () => {
    const result = await saveSettings({ ...DEFAULT_SETTINGS, email: "x", gtmId: "ruim" });

    expect(result).toMatchObject({ ok: false, error: "Revise os campos destacados." });
    expect(result.ok ? {} : result.fieldErrors).toMatchObject({ email: "E-mail inválido", gtmId: "Use o formato GTM-XXXXXXX" });
    expect(repo.saveSiteSettings).not.toHaveBeenCalled();
  });
});
