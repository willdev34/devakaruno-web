/**
 * Caminho: src/lib/prisma.test.ts
 * Arquivo: prisma.test.ts
 * Descrição: Testes do client único do Prisma: criação com o adapter pg e reaproveitamento da instância (singleton), sem conectar em banco.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { PrismaPgMock, PrismaClientMock } = vi.hoisted(() => ({
  PrismaPgMock: vi.fn(function (this: { options: unknown }, options: unknown) {
    this.options = options;
  }),
  PrismaClientMock: vi.fn(function (this: { options: unknown }, options: unknown) {
    this.options = options;
  }),
}));

vi.mock("@prisma/adapter-pg", () => ({ PrismaPg: PrismaPgMock }));
vi.mock("@/generated/prisma/client", () => ({ PrismaClient: PrismaClientMock }));

const globalForPrisma = globalThis as unknown as { prisma?: unknown };

// Reimporta o módulo do zero, simulando um novo carregamento (ex.: hot reload)
async function loadPrisma() {
  vi.resetModules();
  return (await import("./prisma")).prisma;
}

describe("src/lib/prisma", () => {
  beforeEach(() => {
    delete globalForPrisma.prisma;
    PrismaPgMock.mockClear();
    PrismaClientMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    delete globalForPrisma.prisma;
  });

  it("cria o client com o adapter pg usando a DATABASE_URL", async () => {
    const prisma = await loadPrisma();

    expect(PrismaPgMock).toHaveBeenCalledWith({
      connectionString: "postgresql://test:test@localhost:5432/test",
    });
    const adapter = PrismaPgMock.mock.instances[0];
    expect(PrismaClientMock).toHaveBeenCalledWith({ adapter });
    expect(prisma).toBe(PrismaClientMock.mock.instances[0]);
  });

  it("reaproveita a mesma instância entre carregamentos fora de produção", async () => {
    const first = await loadPrisma();
    const second = await loadPrisma();

    expect(second).toBe(first);
    expect(PrismaClientMock).toHaveBeenCalledTimes(1);
    expect(globalForPrisma.prisma).toBe(first);
  });

  it("não guarda a instância no globalThis em produção", async () => {
    vi.stubEnv("NODE_ENV", "production");

    await loadPrisma();

    expect(PrismaClientMock).toHaveBeenCalledTimes(1);
    expect(globalForPrisma.prisma).toBeUndefined();
  });
});
