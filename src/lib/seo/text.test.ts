/**
 * Caminho: src/lib/seo/text.test.ts
 * Arquivo: text.test.ts
 * Descrição: Testes do corte de textos para resultados de busca.
 */
import { describe, expect, it } from "vitest";
import { toMetaDescription, truncateText } from "./text";

describe("truncateText", () => {
  it("textos curtos passam sem mudança, com espaços normalizados", () => {
    expect(truncateText("  Um   texto\ncurto ", 50)).toBe("Um texto curto");
  });

  it("corta no último espaço e fecha com reticências, sem passar do limite", () => {
    const result = truncateText("uma frase bem comprida que precisa ser cortada em algum ponto", 30);

    expect(result).toBe("uma frase bem comprida que…");
    expect(result.length).toBeLessThanOrEqual(30);
  });

  it("não deixa pontuação pendurada antes das reticências", () => {
    expect(truncateText("alô, mundo, esta frase continua por muito tempo ainda", 18)).toBe("alô, mundo, esta…");
  });

  it("palavra única gigante é cortada seca", () => {
    const result = truncateText("a".repeat(100), 20);

    expect(result).toBe(`${"a".repeat(19)}…`);
  });
});

describe("toMetaDescription", () => {
  it("limita a 160 caracteres", () => {
    expect(toMetaDescription("palavra ".repeat(50)).length).toBeLessThanOrEqual(160);
    expect(toMetaDescription("curto")).toBe("curto");
  });
});
