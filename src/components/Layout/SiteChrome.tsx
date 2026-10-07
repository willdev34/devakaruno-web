/**
 * Caminho: src/components/Layout/SiteChrome.tsx
 * Arquivo: SiteChrome.tsx
 * Descrição: Esconde Header e Footer do site nas rotas que têm layout próprio (painel admin).
 */
"use client";
import { usePathname } from "next/navigation";

const HIDDEN_PREFIXES = ["/admin"];

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Rotas sem o cabeçalho e rodapé do site
  const hidden = HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname?.startsWith(`${prefix}/`)
  );

  return hidden ? null : <>{children}</>;
}
