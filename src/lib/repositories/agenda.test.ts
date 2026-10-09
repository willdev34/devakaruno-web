/**
 * Caminho: src/lib/repositories/agenda.test.ts
 * Arquivo: agenda.test.ts
 * Descrição: Testes dos repositórios da agenda (público e admin), com o Prisma mockado.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getUpcomingAgenda } from "./agenda";
import {
  createAgendaEvent,
  deleteAgendaEvent,
  getAgendaEvent,
  listAdminAgenda,
  updateAgendaEvent,
  type AgendaWriteData,
} from "./admin-agenda";

const db = vi.hoisted(() => ({
  findMany: vi.fn(),
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({ prisma: { agendaEvent: db } }));

describe("repositories/agenda", () => {
  beforeEach(() => Object.values(db).forEach((fn) => fn.mockReset()));

  it("público: só publicados que não terminaram, do mais próximo ao mais distante", async () => {
    await getUpcomingAgenda(new Date("2026-10-10T01:00:00Z"));

    expect(db.findMany).toHaveBeenCalledWith({
      where: { published: true, endDate: { gte: new Date("2026-10-09T00:00:00.000Z") } },
      orderBy: { startDate: "asc" },
    });
  });

  it("público: usa a data atual por padrão", async () => {
    await getUpcomingAgenda();

    expect(db.findMany).toHaveBeenCalled();
  });

  it("admin: lista, lê, cria, atualiza e exclui", async () => {
    const data = { city: "X" } as AgendaWriteData;

    await listAdminAgenda();
    await getAgendaEvent("1");
    await createAgendaEvent(data);
    await updateAgendaEvent("1", data);
    await deleteAgendaEvent("1");

    expect(db.findMany).toHaveBeenCalledWith({ orderBy: { startDate: "desc" } });
    expect(db.findUnique).toHaveBeenCalledWith({ where: { id: "1" } });
    expect(db.create).toHaveBeenCalledWith({ data });
    expect(db.update).toHaveBeenCalledWith({ where: { id: "1" }, data });
    expect(db.delete).toHaveBeenCalledWith({ where: { id: "1" } });
  });
});
