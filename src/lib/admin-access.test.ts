/**
 * Caminho: src/lib/admin-access.test.ts
 * Arquivo: admin-access.test.ts
 * Descrição: Testes da decisão de acesso do proxy para o painel, a API do admin e as telas de login.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { decideAccess } from "./admin-access";

const ADMIN = "dono@site.com";

describe("decideAccess", () => {
  beforeEach(() => {
    process.env.ADMIN_EMAIL = ADMIN;
  });

  it.each(["/admin", "/admin/artigos", "/admin/artigos/novo"])("%s sem login vai para /signin", (path) => {
    expect(decideAccess(path)).toEqual({ action: "redirect", to: "/signin" });
    expect(decideAccess(path, "outro@site.com")).toEqual({ action: "redirect", to: "/signin" });
  });

  it("libera o painel para o admin", () => {
    expect(decideAccess("/admin/artigos", ADMIN)).toEqual({ action: "allow" });
  });

  it("API do admin responde não autorizado sem admin", () => {
    expect(decideAccess("/api/admin/upload")).toEqual({ action: "unauthorized" });
    expect(decideAccess("/api/admin/upload", ADMIN)).toEqual({ action: "allow" });
  });

  it("admin logado em /signin vai para o painel; visitante vê o login", () => {
    expect(decideAccess("/signin", ADMIN)).toEqual({ action: "redirect", to: "/admin" });
    expect(decideAccess("/signin")).toEqual({ action: "allow" });
  });

  it("não confunde rotas parecidas com /admin", () => {
    expect(decideAccess("/administrador")).toEqual({ action: "allow" });
  });

  it("páginas públicas ficam livres", () => {
    expect(decideAccess("/blog")).toEqual({ action: "allow" });
  });
});
