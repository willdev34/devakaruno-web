/**
 * Caminho: src/lib/maintenance.ts
 * Arquivo: maintenance.ts
 * Descrição: Regras do modo "Em construção" (MAINTENANCE_MODE), usadas pelo proxy.
 */
export const MAINTENANCE_PATH = "/em-construcao";

// Rotas que continuam acessíveis com o site fechado (login e painel)
const ALLOWED_PREFIXES = [MAINTENANCE_PATH, "/admin", "/api/auth", "/signin"];

// Só o valor exato "true" liga o modo; qualquer outro valor mantém o site aberto
export function isMaintenanceEnabled(
  value: string | undefined = process.env.MAINTENANCE_MODE
): boolean {
  return value === "true";
}

export function isPathAllowedInMaintenance(pathname: string): boolean {
  return ALLOWED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

// Decide se a requisição deve ser desviada para a página de construção
export function shouldShowMaintenance(
  pathname: string,
  enabled: boolean = isMaintenanceEnabled()
): boolean {
  return enabled && !isPathAllowedInMaintenance(pathname);
}
