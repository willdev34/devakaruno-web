// Fuso fixo para os testes de data darem o mesmo resultado na máquina e no CI
process.env.TZ = "America/Sao_Paulo";

/**
 * Caminho: vitest.setup.ts
 * Arquivo: vitest.setup.ts
 * Descrição: Setup global dos testes: matchers do jest-dom e variáveis de ambiente falsas, para nenhum teste depender de banco real.
 */
import "@testing-library/jest-dom/vitest";

// URL fictícia: o Prisma é sempre mockado nos testes
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";

// jsdom não implementa o <dialog> modal: simula showModal e close
if (typeof HTMLDialogElement !== "undefined" && !HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
}
