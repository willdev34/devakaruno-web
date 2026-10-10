/**
 * Caminho: src/lib/ads/ads.test.ts
 * Arquivo: ads.test.ts
 * Descrição: Testes das regras de banners: validação, datas no horário de Brasília, situação do banner, posições e caso de uso de salvar.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { adInputSchema } from "./schema";
import { endOfDay, startOfDay, toDateInput } from "./dates";
import { adStatus } from "./status";
import { adPositionLabel } from "./positions";
import { saveAd } from "./save-ad";

const repo = vi.hoisted(() => ({ createAd: vi.fn(), updateAd: vi.fn() }));
vi.mock("@/lib/repositories/admin-ads", () => repo);

const valid = {
  name: "  Parceiro X  ",
  position: "BLOG_LIST",
  imageUrl: "https://res.cloudinary.com/x/banner.jpg",
  linkUrl: "https://parceiro.com.br",
  altText: "Anúncio do parceiro",
  active: true,
  startsAt: "",
  endsAt: "",
};

describe("adInputSchema", () => {
  it("aceita e limpa os espaços", () => {
    expect(adInputSchema.parse(valid).name).toBe("Parceiro X");
  });

  it("aceita imagem local e recusa imagem inválida", () => {
    expect(adInputSchema.safeParse({ ...valid, imageUrl: "/images/b.jpg" }).success).toBe(true);
    expect(adInputSchema.safeParse({ ...valid, imageUrl: "javascript:alert(1)" }).success).toBe(false);
    expect(adInputSchema.safeParse({ ...valid, imageUrl: "" }).success).toBe(false);
  });

  it("o link precisa ser http ou https", () => {
    expect(adInputSchema.safeParse({ ...valid, linkUrl: "parceiro.com.br" }).success).toBe(false);
    expect(adInputSchema.safeParse({ ...valid, linkUrl: "javascript:alert(1)" }).success).toBe(false);
    expect(adInputSchema.safeParse({ ...valid, linkUrl: "" }).success).toBe(false);
  });

  it("recusa posição desconhecida, nome curto e texto alternativo vazio", () => {
    expect(adInputSchema.safeParse({ ...valid, position: "HOME" }).success).toBe(false);
    expect(adInputSchema.safeParse({ ...valid, name: "A" }).success).toBe(false);
    expect(adInputSchema.safeParse({ ...valid, altText: "" }).success).toBe(false);
  });

  it("valida o período: formato da data e fim depois do início", () => {
    expect(adInputSchema.safeParse({ ...valid, startsAt: "10/10/2026" }).success).toBe(false);
    expect(adInputSchema.safeParse({ ...valid, startsAt: "2026-10-10", endsAt: "2026-10-10" }).success).toBe(true);
    const result = adInputSchema.safeParse({ ...valid, startsAt: "2026-10-10", endsAt: "2026-10-09" });
    expect(result.success).toBe(false);
    expect(result.success ? "" : result.error.issues[0].path.join(".")).toBe("endsAt");
  });
});

describe("dates", () => {
  it("início e fim valem o dia inteiro no horário de Brasília", () => {
    expect(startOfDay("2026-10-10").toISOString()).toBe("2026-10-10T03:00:00.000Z");
    expect(endOfDay("2026-10-10").toISOString()).toBe("2026-10-11T02:59:59.999Z");
  });

  it("volta para o valor do campo de data", () => {
    expect(toDateInput(startOfDay("2026-10-10"))).toBe("2026-10-10");
    expect(toDateInput(endOfDay("2026-10-10"))).toBe("2026-10-10");
    expect(toDateInput(null)).toBe("");
    expect(toDateInput(undefined)).toBe("");
  });
});

describe("adStatus", () => {
  const now = new Date("2026-10-10T12:00:00.000Z");
  const base = { active: true, startsAt: null, endsAt: null };

  it("classifica o banner", () => {
    expect(adStatus({ ...base, active: false }, now)).toBe("inactive");
    expect(adStatus({ ...base, startsAt: new Date("2026-10-11T00:00:00.000Z") }, now)).toBe("scheduled");
    expect(adStatus({ ...base, endsAt: new Date("2026-10-09T00:00:00.000Z") }, now)).toBe("expired");
    expect(adStatus(base, now)).toBe("live");
    expect(adStatus({ active: true, startsAt: new Date("2026-10-01T00:00:00.000Z"), endsAt: new Date("2026-10-20T00:00:00.000Z") }, now)).toBe("live");
  });
});

describe("adPositionLabel", () => {
  it("traduz a posição e mantém o valor se desconhecida", () => {
    expect(adPositionLabel("POST_END")).toBe("Fim do artigo");
    expect(adPositionLabel("OUTRA")).toBe("OUTRA");
  });
});

describe("saveAd", () => {
  beforeEach(() => {
    Object.values(repo).forEach((fn) => fn.mockReset());
    repo.createAd.mockResolvedValue({ id: "novo" });
    repo.updateAd.mockResolvedValue({ id: "1" });
  });

  it("cria convertendo as datas e sem período quando vazio", async () => {
    expect(await saveAd(null, valid)).toEqual({ ok: true, id: "novo" });
    expect(repo.createAd).toHaveBeenCalledWith(expect.objectContaining({ name: "Parceiro X", startsAt: null, endsAt: null }));

    await saveAd(null, { ...valid, startsAt: "2026-10-10", endsAt: "2026-10-12" });
    const data = repo.createAd.mock.calls[1][0];
    expect(data.startsAt.toISOString()).toBe("2026-10-10T03:00:00.000Z");
    expect(data.endsAt.toISOString()).toBe("2026-10-13T02:59:59.999Z");
  });

  it("atualiza quando há id", async () => {
    expect(await saveAd("1", valid)).toEqual({ ok: true, id: "1" });
    expect(repo.updateAd).toHaveBeenCalledWith("1", expect.any(Object));
    expect(repo.createAd).not.toHaveBeenCalled();
  });

  it("devolve o primeiro erro de cada campo sem gravar", async () => {
    const result = await saveAd(null, { ...valid, name: "", linkUrl: "x" });

    expect(result).toMatchObject({ ok: false, error: "Revise os campos destacados." });
    expect(result.ok ? {} : result.fieldErrors).toMatchObject({ name: "Informe o nome do banner", linkUrl: "O link precisa começar com http:// ou https://" });
    expect(repo.createAd).not.toHaveBeenCalled();
  });
});
