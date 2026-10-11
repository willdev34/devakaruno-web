/**
 * Caminho: src/components/Seo/JsonLd.test.tsx
 * Arquivo: JsonLd.test.tsx
 * Descrição: Teste do componente de dados estruturados: um script por bloco, com JSON válido.
 */
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import JsonLd from "./JsonLd";

describe("JsonLd", () => {
  it("renderiza um bloco como script application/ld+json", () => {
    const { container } = render(<JsonLd data={{ "@type": "WebSite", name: "X" }} />);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');

    expect(scripts).toHaveLength(1);
    expect(JSON.parse(scripts[0].textContent ?? "")).toEqual({ "@type": "WebSite", name: "X" });
  });

  it("vários blocos viram vários scripts", () => {
    const { container } = render(<JsonLd data={[{ a: 1 }, { b: 2 }]} />);

    expect(container.querySelectorAll("script")).toHaveLength(2);
  });
});
