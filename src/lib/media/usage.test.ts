/**
 * Caminho: src/lib/media/usage.test.ts
 * Arquivo: usage.test.ts
 * Descrição: Testes de onde uma imagem está em uso: o public_id precisa aparecer inteiro no texto.
 */
import { describe, expect, it } from "vitest";
import { findUsages, mentions, type ImageSource } from "./usage";

const source = (over: Partial<ImageSource> = {}): ImageSource => ({
  kind: "Artigo",
  id: "1",
  title: "Meu artigo",
  href: "/admin/artigos/1",
  texts: [],
  ...over,
});

describe("mentions", () => {
  it("acha o public_id dentro de uma URL, com ou sem transformação", () => {
    expect(mentions("https://res.cloudinary.com/x/image/upload/v1/devakaruno-web/blog/capa_ab12.jpg", "devakaruno-web/blog/capa_ab12")).toBe(true);
    expect(mentions("https://res.cloudinary.com/x/image/upload/f_auto,w_640/v1/capa_ab12.webp", "capa_ab12")).toBe(true);
  });

  it("acha no meio de um texto em markdown", () => {
    expect(mentions("Texto ![foto](https://x/upload/v1/foto_zz.png) fim", "foto_zz")).toBe(true);
  });

  it("não confunde com ids parecidos", () => {
    expect(mentions("https://x/upload/v1/xlogo_abc.png", "logo_ab")).toBe(false);
    expect(mentions("https://x/upload/v1/logo_abc.png", "logo_ab")).toBe(false);
  });

  it("segue procurando depois de um falso positivo", () => {
    expect(mentions("logo_abc e depois /logo_ab.png", "logo_ab")).toBe(true);
  });

  it("id vazio nunca conta; texto sem o id também não", () => {
    expect(mentions("qualquer", "")).toBe(false);
    expect(mentions("nada aqui", "foto")).toBe(false);
  });

  it("acha no começo e no fim do texto", () => {
    expect(mentions("foto", "foto")).toBe(true);
  });
});

describe("findUsages", () => {
  it("devolve só os itens que usam a imagem, sem os textos", () => {
    const usages = findUsages("capa_ab12", [
      source({ id: "1", texts: ["https://x/upload/v1/capa_ab12.jpg", "conteúdo"] }),
      source({ id: "2", kind: "Banner", title: "B", href: "/admin/banners/2", texts: ["https://x/upload/v1/outra.jpg"] }),
      source({ id: "3", kind: "Curso", title: "C", href: "/admin/cursos/3", texts: ["a", "https://x/capa_ab12.png"] }),
    ]);

    expect(usages).toEqual([
      { kind: "Artigo", id: "1", title: "Meu artigo", href: "/admin/artigos/1" },
      { kind: "Curso", id: "3", title: "C", href: "/admin/cursos/3" },
    ]);
  });

  it("sem uso devolve lista vazia", () => {
    expect(findUsages("x_1", [source({ texts: ["nada"] })])).toEqual([]);
  });
});
