/**
 * Caminho: src/lib/settings/tracking.test.ts
 * Arquivo: tracking.test.ts
 * Descrição: Testes de hasTracking: só conta códigos válidos.
 */
import { describe, expect, it } from "vitest";
import { hasTracking } from "./tracking";

const none = { gtmId: "", gaId: "", metaPixelId: "" };

describe("hasTracking", () => {
  it("é falso sem códigos", () => {
    expect(hasTracking(none)).toBe(false);
  });

  it.each([
    { gtmId: "GTM-ABC1234" },
    { gaId: "G-ABCDEF1234" },
    { metaPixelId: "123456789012345" },
  ])("é verdadeiro com %o", (patch) => {
    expect(hasTracking({ ...none, ...patch })).toBe(true);
  });

  it("ignora códigos fora do formato", () => {
    expect(hasTracking({ gtmId: "x", gaId: "UA-1", metaPixelId: "12ab" })).toBe(false);
  });
});
