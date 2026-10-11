/**
 * Caminho: src/app/api/auth/[...nextauth]/route.ts
 * Arquivo: route.ts
 * Descrição: Rota do NextAuth. A configuração fica em src/lib/auth.ts.
 */
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
