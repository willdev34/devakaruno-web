/**
 * Caminho: src/lib/admin-access.ts
 * Arquivo: admin-access.ts
 * Descrição: Regra de acesso por rota usada pelo proxy: quem pode ver o painel e para onde quem já está logado é enviado.
 */
import { ADMIN_HOME, SIGNIN_PATH, isAdminEmail } from "@/lib/auth";

const AUTH_PATHS = [SIGNIN_PATH, "/signup", "/forgot-password"];

const isUnder = (pathname: string, prefix: string) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

export type AccessDecision =
  | { action: "allow" }
  | { action: "redirect"; to: string }
  | { action: "unauthorized" };

// Decide o que fazer com a requisição a partir da rota e do e-mail do token (se houver)
export function decideAccess(pathname: string, email?: string | null): AccessDecision {
  const isAdmin = isAdminEmail(email);

  if (isUnder(pathname, "/api/admin")) {
    return isAdmin ? { action: "allow" } : { action: "unauthorized" };
  }
  if (isUnder(pathname, ADMIN_HOME)) {
    return isAdmin ? { action: "allow" } : { action: "redirect", to: SIGNIN_PATH };
  }
  if (AUTH_PATHS.some((path) => isUnder(pathname, path)) && isAdmin) {
    return { action: "redirect", to: ADMIN_HOME };
  }
  return { action: "allow" };
}
