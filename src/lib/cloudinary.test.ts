/**
 * Caminho: src/lib/cloudinary.test.ts
 * Arquivo: cloudinary.test.ts
 * Descrição: Testes dos helpers de URL do Cloudinary.
 */
import { describe, expect, it } from "vitest";
import { cloudinarySrcSet, cloudinaryUrl } from "./cloudinary";

const URL = "https://res.cloudinary.com/demo/image/upload/v1/foto.jpg";

describe("cloudinaryUrl", () => {
  it("insere formato, qualidade e largura automáticos depois de /upload/", () => {
    expect(cloudinaryUrl(URL, 1280)).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_1280/v1/foto.jpg"
    );
  });

  it("mantém a URL original quando não é uma URL de upload do Cloudinary", () => {
    expect(cloudinaryUrl("/images/local.jpg", 800)).toBe("/images/local.jpg");
  });
});

describe("cloudinarySrcSet", () => {
  it("gera um item por largura, com o descritor w", () => {
    expect(cloudinarySrcSet(URL, [640, 1280])).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_640/v1/foto.jpg 640w, " +
        "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_1280/v1/foto.jpg 1280w"
    );
  });
});
