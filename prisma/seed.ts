/**
 * Caminho: prisma/seed.ts
 * Arquivo: seed.ts
 * Descrição: Popula o banco com o registro de admin (Will), usando upsert para ser seguro rodar múltiplas vezes.
 */
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "karunodeva@gmail.com" },
    update: {},
    create: {
      name: "Will",
      email: "karunodeva@gmail.com",
      role: "ADMIN",
    },
  });

  console.log("Usuário admin garantido:", admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });