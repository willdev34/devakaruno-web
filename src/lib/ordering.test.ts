/**
 * Caminho: src/lib/ordering.test.ts
 * Arquivo: ordering.test.ts
 * Descrição: Testes da regra de subir e descer itens numa fila.
 */
import { describe, expect, it } from "vitest";
import { moveInList } from "./ordering";

const ids = ["a", "b", "c"];

describe("moveInList", () => {
  it("sobe trocando com o vizinho de cima", () => {
    expect(moveInList(ids, "b", "up")).toEqual(["b", "a", "c"]);
  });

  it("desce trocando com o vizinho de baixo", () => {
    expect(moveInList(ids, "b", "down")).toEqual(["a", "c", "b"]);
  });

  it("não mexe na lista original", () => {
    moveInList(ids, "b", "up");

    expect(ids).toEqual(["a", "b", "c"]);
  });

  it("devolve null nas pontas e para id desconhecido", () => {
    expect(moveInList(ids, "a", "up")).toBeNull();
    expect(moveInList(ids, "c", "down")).toBeNull();
    expect(moveInList(ids, "x", "up")).toBeNull();
    expect(moveInList([], "a", "down")).toBeNull();
  });
});
