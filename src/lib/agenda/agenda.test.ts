/**
 * Caminho: src/lib/agenda/agenda.test.ts
 * Arquivo: agenda.test.ts
 * Descrição: Testes das regras da agenda: período, status, hoje no Brasil, mapa, WhatsApp, validação e o caso de uso de salvar.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  agendaWhatsappLink,
  cityRequestLink,
  cityLabel,
  formatDateRange,
  getAgendaStatus,
  mapsLink,
  todayInBrazil,
  type AgendaLike,
} from "./utils";
import { agendaInputSchema } from "./schema";
import { saveAgenda } from "./save-agenda";

const repo = vi.hoisted(() => ({ createAgendaEvent: vi.fn(), updateAgendaEvent: vi.fn() }));
vi.mock("@/lib/repositories/admin-agenda", () => repo);

const d = (day: string) => new Date(`${day}T00:00:00.000Z`);

describe("formatDateRange", () => {
  it("um dia, mesmo mês e meses diferentes", () => {
    expect(formatDateRange(d("2026-11-12"), d("2026-11-12"), 2026)).toBe("12 de novembro");
    expect(formatDateRange(d("2026-11-12"), d("2026-11-15"), 2026)).toBe("12 a 15 de novembro");
    expect(formatDateRange(d("2026-11-28"), d("2026-12-02"), 2026)).toBe("28 de novembro a 2 de dezembro");
  });

  it("mostra o ano quando não é o atual", () => {
    expect(formatDateRange(d("2027-01-05"), d("2027-01-07"), 2026)).toBe("5 a 7 de janeiro de 2027");
  });

  it("usa o ano atual por padrão", () => {
    expect(formatDateRange(d("2000-01-05"), d("2000-01-05"))).toContain("de 2000");
  });
});

describe("todayInBrazil e status", () => {
  it("usa o dia de São Paulo, mesmo com UTC já no dia seguinte", () => {
    expect(todayInBrazil(new Date("2026-10-10T01:30:00Z")).toISOString()).toBe("2026-10-09T00:00:00.000Z");
  });

  it("usa a data atual por padrão", () => {
    expect(todayInBrazil().getUTCHours()).toBe(0);
  });

  it("classifica próxima, acontecendo e encerrada", () => {
    const event = { startDate: d("2026-11-10"), endDate: d("2026-11-12") };
    expect(getAgendaStatus(event, d("2026-11-09"))).toBe("upcoming");
    expect(getAgendaStatus(event, d("2026-11-10"))).toBe("ongoing");
    expect(getAgendaStatus(event, d("2026-11-12"))).toBe("ongoing");
    expect(getAgendaStatus(event, d("2026-11-13"))).toBe("past");
  });

  it("calcula o status com hoje por padrão", () => {
    expect(getAgendaStatus({ startDate: d("2000-01-01"), endDate: d("2000-01-02") })).toBe("past");
  });
});

describe("links e rótulos", () => {
  const event: AgendaLike = {
    city: "São Paulo",
    state: "SP",
    venue: "Espaço Lótus",
    address: "Rua A, 10",
    startDate: d("2026-11-12"),
    endDate: d("2026-11-15"),
  };

  it("monta cidade/UF e o link do mapa", () => {
    expect(cityLabel(event)).toBe("São Paulo/SP");
    expect(cityLabel({ city: "Niterói", state: null })).toBe("Niterói");
    expect(mapsLink(event)).toContain("query=Espa%C3%A7o%20L%C3%B3tus%2C%20Rua%20A%2C%2010%2C%20S%C3%A3o%20Paulo%2C%20SP");
    expect(mapsLink({ ...event, address: null, state: null })).not.toContain("null");
  });

  it("monta a mensagem de WhatsApp com cidade e período", () => {
    const link = agendaWhatsappLink(event, 2026);

    expect(link).toContain("https://wa.me/5521984121612?text=");
    expect(decodeURIComponent(link)).toContain("São Paulo/SP (12 a 15 de novembro)");
  });

  it("usa o número informado (configurações do site) e cai no padrão sem ele", () => {
    expect(agendaWhatsappLink(event, 2026, "5511999999999")).toContain("https://wa.me/5511999999999?text=");
    expect(cityRequestLink("5511999999999")).toContain("https://wa.me/5511999999999?text=");
    expect(cityRequestLink()).toContain("https://wa.me/5521984121612?text=");
    expect(decodeURIComponent(cityRequestLink())).toContain("Minha cidade é: ");
  });
});

describe("agendaInputSchema", () => {
  const valid = {
    city: "São Paulo",
    state: "sp",
    venue: "Espaço Lótus",
    address: "",
    startDate: "2026-11-12",
    endDate: "2026-11-15",
    description: "",
    published: true,
  };

  it("aceita e normaliza a UF", () => {
    expect(agendaInputSchema.parse(valid).state).toBe("SP");
    expect(agendaInputSchema.safeParse({ ...valid, state: "" }).success).toBe(true);
  });

  it("recusa UF inválida, datas vazias e fim antes do início", () => {
    expect(agendaInputSchema.safeParse({ ...valid, state: "São" }).success).toBe(false);
    expect(agendaInputSchema.safeParse({ ...valid, startDate: "" }).success).toBe(false);
    const result = agendaInputSchema.safeParse({ ...valid, endDate: "2026-11-01" });
    expect(result.success).toBe(false);
    expect(!result.success && result.error.issues[0].path).toEqual(["endDate"]);
  });
});

describe("saveAgenda", () => {
  beforeEach(() => {
    Object.values(repo).forEach((fn) => fn.mockReset());
    repo.createAgendaEvent.mockResolvedValue({ id: "n1" });
    repo.updateAgendaEvent.mockResolvedValue({ id: "e1" });
  });

  const raw = {
    city: "Niterói",
    state: "",
    venue: "Casa Verde",
    address: "",
    startDate: "2026-12-01",
    endDate: "2026-12-03",
    description: "",
    published: true,
  };

  it("devolve erros por campo", async () => {
    const result = await saveAgenda(null, { ...raw, city: "" });

    expect(result).toMatchObject({ ok: false, fieldErrors: { city: expect.any(String) } });
    expect(repo.createAgendaEvent).not.toHaveBeenCalled();
  });

  it("cria com datas em UTC e campos vazios como nulos", async () => {
    expect(await saveAgenda(null, raw)).toEqual({ ok: true, id: "n1" });

    expect(repo.createAgendaEvent.mock.calls[0][0]).toMatchObject({
      state: null,
      address: null,
      description: null,
      startDate: d("2026-12-01"),
      endDate: d("2026-12-03"),
    });
  });

  it("atualiza quando recebe o id", async () => {
    expect(await saveAgenda("e1", raw)).toEqual({ ok: true, id: "e1" });
    expect(repo.updateAgendaEvent).toHaveBeenCalledWith("e1", expect.objectContaining({ city: "Niterói" }));
  });
});
