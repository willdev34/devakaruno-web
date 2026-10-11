/**
 * Caminho: src/app/admin/configuracoes/page.tsx
 * Arquivo: page.tsx
 * Descrição: Tela de configurações gerais do site no admin: WhatsApp, contato, redes sociais e códigos de rastreamento.
 */
import SettingsForm from "@/components/Admin/Settings/SettingsForm";
import { getSiteSettings } from "@/lib/repositories/site-settings";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <h1 className="font-heading text-3xl font-bold">Configurações do site</h1>
      <p className="mb-6 mt-1 text-sm text-muted">Dados de contato, redes sociais e códigos de rastreamento usados no site inteiro.</p>
      <SettingsForm initial={settings} />
    </>
  );
}
