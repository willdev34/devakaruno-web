/**
 * Caminho: vitest.setup.ts
 * Arquivo: vitest.setup.ts
 * Descrição: Setup global dos testes: matchers do jest-dom e variáveis de ambiente falsas, para nenhum teste depender de banco real.
 */
import "@testing-library/jest-dom/vitest";

// URL fictícia: o Prisma é sempre mockado nos testes
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
