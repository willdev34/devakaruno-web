/**
 * Caminho: src/components/Admin/nav.test.ts
 * Arquivo: nav.test.ts
 * Descrição: Testes do item ativo do menu do admin.
 */
import { describe, expect, it } from "vitest";
import { isNavActive } from "./nav";

describe("isNavActive", () => {
  it("Dashboard só fica ativo na raiz", () => {
    expect(isNavActive("/admin", "/admin")).toBe(true);
    expect(isNavActive("/admin", "/admin/artigos")).toBe(false);
  });

  it("demais itens ficam ativos também nas subrotas", () => {
    expect(isNavActive("/admin/artigos", "/admin/artigos")).toBe(true);
    expect(isNavActive("/admin/artigos", "/admin/artigos/novo")).toBe(true);
    expect(isNavActive("/admin/artigos", "/admin/agenda")).toBe(false);
  });
});
