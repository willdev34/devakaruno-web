/**
 * Caminho: src/components/Admin/AdminSidebar.tsx
 * Arquivo: AdminSidebar.tsx
 * Descrição: Menu lateral do painel admin (barra superior com botão no celular), com item ativo, "Ver site" e "Sair".
 */
"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Icon } from "@iconify/react";
import Logo from "@/components/Layout/Header/Logo";
import { ADMIN_NAV, isNavActive } from "./nav";

const linkBase = "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors";

export default function AdminSidebar() {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Barra superior (celular) */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-[#0f1c27] px-4 py-3 lg:hidden">
        <span className="text-sm font-medium text-white">Meu painel administrativo</span>
        <button type="button" aria-label="Abrir menu" onClick={() => setOpen((v) => !v)} className="text-white">
          <Icon icon={open ? "solar:close-circle-linear" : "solar:hamburger-menu-linear"} width={28} />
        </button>
      </div>

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-60 flex-col bg-[#0f1c27] pt-14 transition-transform lg:translate-x-0 lg:pt-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="hidden border-b border-white/10 px-6 py-6 lg:block">
          <Logo forceWhite height={52} />
          <p className="mt-2 text-xs font-medium text-white/50">Meu painel administrativo</p>
        </div>

        <nav aria-label="Menu do admin" className="flex-1 space-y-1 px-3 py-5">
          {ADMIN_NAV.map((item) =>
            item.ready ? (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isNavActive(item.href, pathname) ? "page" : undefined}
                className={`${linkBase} ${
                  isNavActive(item.href, pathname)
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon icon={item.icon} width={20} />
                {item.label}
              </Link>
            ) : (
              <span key={item.href} className={`${linkBase} cursor-not-allowed text-white/30`}>
                <Icon icon={item.icon} width={20} />
                {item.label}
                <span className="ml-auto rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase">em breve</span>
              </span>
            ),
          )}
        </nav>

        <div className="space-y-1 border-t border-white/10 px-3 py-4">
          <Link href="/" target="_blank" className={`${linkBase} text-white/60 hover:bg-white/5 hover:text-white`}>
            <Icon icon="solar:arrow-right-up-linear" width={20} />
            Ver site
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className={`${linkBase} w-full text-error hover:bg-white/5`}
          >
            <Icon icon="solar:power-linear" width={20} />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
