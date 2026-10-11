/**
 * Caminho: src/lib/services/services.test.ts
 * Arquivo: services.test.ts
 * Descrição: Testes da validação de serviço e do caso de uso de salvar (link do WhatsApp, criar, editar e erros por campo).
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { serviceInputSchema } from "./schema";
import { saveService } from "./save-service";

const repo = vi.hoisted(() => ({ createService: vi.fn(), updateService: vi.fn() }));
vi.mock("@/lib/repositories/admin-services", () => repo);

const valid = {
  title: "  Sessão individual  ",
  text: "  Atendimento individual e acolhedor.  ",
  icon: "/images/services/icon-individual.svg",
  whatsappMessage: "Olá! Quero saber mais.",
};

describe("serviceInputSchema", () => {
  it("aceita e limpa os espaços", () => {
    const parsed = serviceInputSchema.parse(valid);

    expect(parsed.title).toBe("Sessão individual");
    expect(parsed.text).toBe("Atendimento individual e acolhedor.");
  });

  it("recusa campos curtos ou longos demais", () => {
    expect(serviceInputSchema.safeParse({ ...valid, title: "ab" }).success).toBe(false);
    expect(serviceInputSchema.safeParse({ ...valid, title: "x".repeat(81) }).success).toBe(false);
    expect(serviceInputSchema.safeParse({ ...valid, text: "curto" }).success).toBe(false);
    expect(serviceInputSchema.safeParse({ ...valid, icon: "" }).success).toBe(false);
    expect(serviceInputSchema.safeParse({ ...valid, whatsappMessage: "oi" }).success).toBe(false);
  });
});

describe("saveService", () => {
  beforeEach(() => {
    Object.values(repo).forEach((fn) => fn.mockReset());
    repo.createService.mockResolvedValue({ id: "novo" });
    repo.updateService.mockResolvedValue({ id: "1" });
  });

  it("cria com o link do WhatsApp montado a partir da mensagem", async () => {
    expect(await saveService(null, valid)).toEqual({ ok: true, id: "novo" });

    const data = repo.createService.mock.calls[0][0];
    expect(data).toMatchObject({ title: "Sessão individual", icon: valid.icon });
    expect(data).not.toHaveProperty("whatsappMessage");
    expect(data.whatsappLink).toBe(`https://wa.me/5521984121612?text=${encodeURIComponent("Olá! Quero saber mais.")}`);
  });

  it("atualiza quando há id", async () => {
    expect(await saveService("1", valid)).toEqual({ ok: true, id: "1" });
    expect(repo.updateService).toHaveBeenCalledWith("1", expect.objectContaining({ title: "Sessão individual" }));
    expect(repo.createService).not.toHaveBeenCalled();
  });

  it("devolve o erro de cada campo sem gravar", async () => {
    const result = await saveService(null, { title: "", text: "", icon: "", whatsappMessage: "" });

    expect(result).toMatchObject({ ok: false, error: "Revise os campos destacados." });
    if (!result.ok) {
      expect(Object.keys(result.fieldErrors).sort()).toEqual(["icon", "text", "title", "whatsappMessage"]);
    }
    expect(repo.createService).not.toHaveBeenCalled();
  });
});
