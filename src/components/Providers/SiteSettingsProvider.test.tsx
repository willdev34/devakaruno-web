/**
 * Caminho: src/components/Providers/SiteSettingsProvider.test.tsx
 * Arquivo: SiteSettingsProvider.test.tsx
 * Descrição: Testes do provider de configurações: entrega o valor aos filhos e usa o padrão quando não há provider.
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS } from "@/lib/settings/defaults";
import { SiteSettingsProvider, useSiteSettings } from "./SiteSettingsProvider";

function Probe() {
  return <span data-testid="n">{useSiteSettings().whatsappNumber}</span>;
}

describe("SiteSettingsProvider", () => {
  it("entrega as configurações aos componentes de cliente", () => {
    render(
      <SiteSettingsProvider value={{ ...DEFAULT_SETTINGS, whatsappNumber: "5511999999999" }}>
        <Probe />
      </SiteSettingsProvider>,
    );

    expect(screen.getByTestId("n")).toHaveTextContent("5511999999999");
  });

  it("sem provider, vale o padrão", () => {
    render(<Probe />);

    expect(screen.getByTestId("n")).toHaveTextContent(DEFAULT_SETTINGS.whatsappNumber);
  });
});
