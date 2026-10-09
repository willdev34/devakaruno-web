/**
 * Caminho: src/lib/auth.test.ts
 * Arquivo: auth.test.ts
 * Descrição: Testes das regras de acesso do admin: e-mail permitido, redirecionamento pós-login e callbacks do NextAuth.
 */
import { describe, expect, it } from "vitest";
import { authOptions, isAdminEmail, resolveRedirect } from "./auth";

const BASE = "https://www.exemplo.com.br";

describe("isAdminEmail", () => {
  it("aceita só o e-mail configurado, sem diferenciar maiúsculas", () => {
    expect(isAdminEmail("Dono@Site.com", "dono@site.com")).toBe(true);
    expect(isAdminEmail("outro@site.com", "dono@site.com")).toBe(false);
  });

  it("recusa quando falta e-mail ou configuração", () => {
    expect(isAdminEmail(null, "dono@site.com")).toBe(false);
    expect(isAdminEmail("dono@site.com", "")).toBe(false);
    expect(isAdminEmail(undefined, undefined)).toBe(false);
  });
});

describe("resolveRedirect", () => {
  it.each(["/signin", "/", `${BASE}/signin`, `${BASE}/`, `${BASE}`])("envia %s para o painel", (url) => {
    expect(resolveRedirect(url, BASE)).toBe(`${BASE}/admin`);
  });

  it("mantém destinos internos específicos", () => {
    expect(resolveRedirect("/admin/artigos", BASE)).toBe(`${BASE}/admin/artigos`);
  });

  it("não segue para outro domínio", () => {
    expect(resolveRedirect("https://malicioso.com/x", BASE)).toBe(`${BASE}/admin`);
  });
});

describe("authOptions", () => {
  it("usa /signin como página de entrada", () => {
    expect(authOptions.pages?.signIn).toBe("/signin");
  });

  it("só permite o login do admin", async () => {
    process.env.ADMIN_EMAIL = "dono@site.com";
    const signIn = authOptions.callbacks!.signIn!;

    expect(await signIn({ user: { email: "dono@site.com" } } as never)).toBe(true);
    expect(await signIn({ user: { email: "outro@site.com" } } as never)).toBe(false);
  });

  it("redireciona pelo resolveRedirect", async () => {
    const redirect = authOptions.callbacks!.redirect!;

    expect(await redirect({ url: "/signin", baseUrl: BASE })).toBe(`${BASE}/admin`);
  });
});
