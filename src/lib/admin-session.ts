/**
 * Caminho: src/lib/admin-session.ts
 * Arquivo: admin-session.ts
 * Descrição: Proteção no servidor das páginas e rotas do admin (segunda camada, além do proxy).
 */
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SIGNIN_PATH, authOptions, isAdminEmail } from "@/lib/auth";

// Para páginas e layouts: manda para o login se não for o admin
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) redirect(SIGNIN_PATH);
  return session!;
}

// Para Route Handlers: true se a requisição é do admin (o handler responde 401 se não)
export async function isAdminRequest(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return isAdminEmail(session?.user?.email);
}
