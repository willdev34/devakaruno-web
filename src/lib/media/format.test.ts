/**
 * Caminho: src/lib/media/format.test.ts
 * Arquivo: format.test.ts
 * Descrição: Testes da formatação de tamanho e data da biblioteca de imagens.
 */
import { describe, expect, it } from "vitest";
import { formatBytes, formatDate } from "./format";

describe("formatBytes", () => {
  it.each([
    [500, "500 B"],
    [1536, "1,5 KB"],
    [2621440, "2,5 MB"],
  ])("%i vira %s", (bytes, text) => {
    expect(formatBytes(bytes)).toBe(text);
  });
});

describe("formatDate", () => {
  it("usa o formato brasileiro", () => {
    expect(formatDate("2026-10-10T15:00:00Z")).toBe("10/10/2026");
  });

  it("devolve vazio para data inválida", () => {
    expect(formatDate("")).toBe("");
  });
});
