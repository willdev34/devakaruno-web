/**
 * Caminho: src/app/admin/configuracoes/Page.test.tsx
 * Arquivo: Page.test.tsx
 * Descrição: Teste da página de configurações do admin: carrega os valores atuais no formulário.
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DEFAULT_SETTINGS } from "@/lib/settings/defaults";
import AdminSettingsPage from "./page";

vi.mock("@/lib/repositories/site-settings", () => ({ getSiteSettings: vi.fn().mockResolvedValue({ ...DEFAULT_SETTINGS, email: "novo@exemplo.com" }) }));
vi.mock("@/components/Admin/Settings/SettingsForm", () => ({
  default: ({ initial }: { initial: { email: string } }) => <div data-testid="form">{initial.email}</div>,
}));

describe("admin/configuracoes", () => {
  it("passa as configurações atuais ao formulário", async () => {
    render(await AdminSettingsPage());

    expect(screen.getByRole("heading", { name: "Configurações do site" })).toBeInTheDocument();
    expect(screen.getByTestId("form")).toHaveTextContent("novo@exemplo.com");
  });
});
