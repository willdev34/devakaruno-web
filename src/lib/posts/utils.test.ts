/**
 * Caminho: src/lib/posts/utils.test.ts
 * Arquivo: utils.test.ts
 * Descrição: Testes de slugify, tempo de leitura e regras de publicação.
 */
import { describe, expect, it } from "vitest";
import { modeFromPost, readingMinutes, resolvePublication, slugify } from "./utils";

const now = new Date("2026-10-09T12:00:00Z");

describe("slugify", () => {
  it("remove acentos, pontuação e espaços extras", () => {
    expect(slugify("  Terapia Tântrica: mitos e verdades! ")).toBe("terapia-tantrica-mitos-e-verdades");
  });

  it("devolve vazio quando não sobra nada", () => {
    expect(slugify("???")).toBe("");
  });
});

describe("readingMinutes", () => {
  it("arredonda para cima e tem mínimo de 1", () => {
    expect(readingMinutes("")).toBe(1);
    expect(readingMinutes("palavra ".repeat(201))).toBe(2);
  });
});

describe("resolvePublication", () => {
  it("rascunho não publica", () => {
    expect(resolvePublication("draft", undefined, now)).toEqual({ published: false, publishedAt: now });
  });

  it("agora publica com a data atual", () => {
    expect(resolvePublication("now", undefined, now)).toEqual({ published: true, publishedAt: now });
  });

  it("agendado publica na data escolhida", () => {
    const later = new Date("2026-11-01T10:00:00Z");
    expect(resolvePublication("schedule", later, now)).toEqual({ published: true, publishedAt: later });
  });

  it("agendado sem data cai em agora", () => {
    expect(resolvePublication("schedule", undefined, now).publishedAt).toEqual(now);
  });
});

describe("modeFromPost", () => {
  it("deduz o modo do post salvo", () => {
    expect(modeFromPost({ published: false, publishedAt: now }, now)).toBe("draft");
    expect(modeFromPost({ published: true, publishedAt: new Date("2026-12-01") }, now)).toBe("schedule");
    expect(modeFromPost({ published: true, publishedAt: new Date("2026-01-01") }, now)).toBe("now");
  });
});
