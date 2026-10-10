/**
 * Caminho: src/components/Providers/SiteSettingsProvider.tsx
 * Arquivo: SiteSettingsProvider.tsx
 * Descrição: Entrega as configurações do site (lidas no servidor, no layout) aos componentes de cliente, como o topo e o hero. Sem provider, vale o padrão.
 */
"use client";
import { createContext, useContext } from "react";
import { DEFAULT_SETTINGS } from "@/lib/settings/defaults";
import type { SiteSettingsData } from "@/lib/settings/schema";

const SiteSettingsContext = createContext<SiteSettingsData>(DEFAULT_SETTINGS);

export function SiteSettingsProvider({ value, children }: { value: SiteSettingsData; children: React.ReactNode }) {
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export const useSiteSettings = () => useContext(SiteSettingsContext);
