/**
 * Caminho: src/lib/tags/tag-ops.test.ts
 * Arquivo: tag-ops.test.ts
 * Descrição: Testes das regras puras de tags: resumo com contagem, agrupamento por acento e maiúscula, renomear, mesclar e remover.
 */
import { describe, expect, it } from "vitest";
import { removeTag, replaceTag, summarizeTags, tagKey } from "./tag-ops";
import { tagNameSchema } from "./schema";

describe("summarizeTags", () => {
  it("conta artigos por tag, da mais usada para a menos usada", () => {
    const result = summarizeTags([{ tags: ["Paz", "Escuta"] }, { tags: ["Paz"] }, { tags: [] }]);
    expect(result).toEqual([
      { key: "paz", name: "Paz", count: 2 },
      { key: "escuta", name: "Escuta", count: 1 },
    ]);
  });

  it("agrupa variações de acento e maiúscula e mostra a grafia mais usada", () => {
    const result = summarizeTags([{ tags: ["respiracao"] }, { tags: ["Respiração"] }, { tags: ["Respiração"] }]);
    expect(result).toEqual([{ key: "respiracao", name: "Respiração", count: 3 }]);
  });

  it("não conta duas vezes o mesmo artigo com variações da mesma tag", () => {
    expect(summarizeTags([{ tags: ["Paz", "paz"] }])[0].count).toBe(1);
  });

  it("empate de uso segue a ordem alfabética", () => {
    expect(summarizeTags([{ tags: ["b", "a"] }]).map((t) => t.name)).toEqual(["a", "b"]);
  });

  it("sem tags devolve lista vazia", () => {
    expect(summarizeTags([])).toEqual([]);
  });
});

describe("replaceTag", () => {
  it("renomeia mantendo a posição", () => {
    expect(replaceTag(["a", "paz", "b"], tagKey("paz"), "Serenidade")).toEqual(["a", "Serenidade", "b"]);
  });

  it("mescla quando o novo nome já existe no artigo, sem repetir", () => {
    expect(replaceTag(["paz", "calma"], "paz", "Calma")).toEqual(["Calma"]);
  });

  it("unifica a grafia das variações do novo nome", () => {
    expect(replaceTag(["respiracao", "paz"], "paz", "Respiração")).toEqual(["Respiração"]);
  });

  it("aceita mudar só a maiúscula", () => {
    expect(replaceTag(["paz"], "paz", "Paz")).toEqual(["Paz"]);
  });
});

describe("removeTag", () => {
  it("tira a tag e suas variações", () => {
    expect(removeTag(["Paz", "paz", "Escuta"], "paz")).toEqual(["Escuta"]);
  });
});

describe("tagNameSchema", () => {
  it("limpa espaços e exige de 1 a 30 caracteres", () => {
    expect(tagNameSchema.parse("  Paz  ")).toBe("Paz");
    expect(tagNameSchema.safeParse("   ").success).toBe(false);
    expect(tagNameSchema.safeParse("x".repeat(31)).success).toBe(false);
  });
});
