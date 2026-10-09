/**
 * Caminho: src/app/admin/layout.tsx
 * Arquivo: layout.tsx
 * Descrição: Layout do painel admin: confere o acesso no servidor e monta menu lateral e área de conteúdo. Fora do índice dos buscadores.
 */
import type { Metadata } from "next";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import { requireAdmin } from "@/lib/admin-session";

export const metadata: Metadata = {
  title: "Admin | Deva Karuno",
  robots: { index: false, follow: false },
};

// Sempre dinâmico: depende da sessão
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-midnight_text">
      <AdminSidebar />
      <main className="px-4 pb-16 pt-20 lg:ml-60 lg:px-10 lg:pt-10">{children}</main>
    </div>
  );
}
