/**
 * Caminho: src/lib/prisma.ts
 * Arquivo: prisma.ts
 * Descrição: Client único do Prisma (adapter pg), reaproveitado entre hot reloads no dev para não abrir múltiplas conexões.
 */
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

// Guarda a instância no globalThis para sobreviver ao hot reload do Next em dev
const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof createPrismaClient>;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
