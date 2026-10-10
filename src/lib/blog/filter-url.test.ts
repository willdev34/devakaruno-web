/**
 * Caminho: src/lib/blog/filter-url.test.ts
 * Arquivo: filter-url.test.ts
 * Descrição: Testes da conversão dos filtros do blog de e para a query string.
 */
import { describe, expect, it } from "vitest";
import { filterToSearch, parseFilter } from "./filter-url";

describe("filter-url", () => {
  it("lê busca, categoria e tag da query string", () => {
    expect(parseFilter("?q=paz+interior&categoria=autoconhecimento&tag=Respira%C3%A7%C3%A3o")).toEqual({
      query: "paz interior",
      category: "autoconhecimento",
      tag: "Respiração",
    });
  });

  it("query string vazia gera filtro vazio", () => {
    expect(parseFilter("")).toEqual({ query: "", category: "", tag: "" });
  });

  it("gera a query string só com o que está preenchido", () => {
    expect(filterToSearch({ query: " paz ", category: "", tag: "Respiração" })).toBe("q=paz&tag=Respira%C3%A7%C3%A3o");
    expect(filterToSearch({ query: "  ", category: "", tag: "" })).toBe("");
  });

  it("ida e volta mantém o filtro", () => {
    const filter = { query: "paz", category: "relacionamentos", tag: "Paz" };
    expect(parseFilter(filterToSearch(filter))).toEqual(filter);
  });
});
