/**
 * Caminho: src/components/Admin/nav.ts
 * Arquivo: nav.ts
 * Descrição: Itens do menu do painel admin. Itens com ready=false aparecem como "em breve" até a tela existir.
 */
export type AdminNavItem = { label: string; href: string; icon: string; ready: boolean };

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "solar:widget-2-linear", ready: true },
  { label: "Artigos", href: "/admin/artigos", icon: "solar:document-text-linear", ready: true },
  { label: "Agenda", href: "/admin/agenda", icon: "solar:calendar-linear", ready: false },
  { label: "Depoimentos", href: "/admin/depoimentos", icon: "solar:chat-round-like-linear", ready: false },
  { label: "Cursos", href: "/admin/cursos", icon: "solar:book-2-linear", ready: false },
];

// Marca o item ativo: o Dashboard só na raiz, os demais também nas subrotas
export function isNavActive(href: string, pathname: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}
