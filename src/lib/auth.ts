/**
 * Caminho: src/lib/auth.ts
 * Arquivo: auth.ts
 * Descrição: Configuração do NextAuth (login Google restrito ao e-mail do dono) e regras de acesso ao painel admin.
 */
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const ADMIN_HOME = "/admin";
export const SIGNIN_PATH = "/signin";

// Só o e-mail definido em ADMIN_EMAIL é admin
export function isAdminEmail(email?: string | null, adminEmail = process.env.ADMIN_EMAIL): boolean {
  if (!email || !adminEmail) return false;
  return email.trim().toLowerCase() === adminEmail.trim().toLowerCase();
}

// Depois do login, quem vem da tela de entrada (ou da raiz) cai no painel
export function resolveRedirect(url: string, baseUrl: string): string {
  const target = url.startsWith("/") ? `${baseUrl}${url}` : url;
  if (!target.startsWith(baseUrl)) return `${baseUrl}${ADMIN_HOME}`;

  const path = target.slice(baseUrl.length).split("?")[0];
  const isEntryPoint = path === "" || path === "/" || path.startsWith(SIGNIN_PATH);
  return isEntryPoint ? `${baseUrl}${ADMIN_HOME}` : target;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  pages: { signIn: SIGNIN_PATH },
  callbacks: {
    signIn: async ({ user }) => isAdminEmail(user.email),
    redirect: async ({ url, baseUrl }) => resolveRedirect(url, baseUrl),
  },
};
