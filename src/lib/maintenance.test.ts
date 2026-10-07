/**
 * Caminho: src/lib/maintenance.test.ts
 * Arquivo: maintenance.test.ts
 * Descrição: Testes das regras do modo "Em construção".
 */
import { describe, expect, it } from "vitest";
import {
  isMaintenanceEnabled,
  isPathAllowedInMaintenance,
  shouldShowMaintenance,
} from "./maintenance";

describe("isMaintenanceEnabled", () => {
  it("liga somente com o valor exato 'true'", () => {
    expect(isMaintenanceEnabled("true")).toBe(true);
  });

  it.each([undefined, "", "false", "TRUE", "1"])("fica desligado com %s", (value) => {
    expect(isMaintenanceEnabled(value)).toBe(false);
  });
});

describe("isPathAllowedInMaintenance", () => {
  it.each(["/em-construcao", "/admin", "/admin/posts", "/api/auth/signin", "/signin"])(
    "libera %s",
    (path) => {
      expect(isPathAllowedInMaintenance(path)).toBe(true);
    }
  );

  it.each(["/", "/blog", "/terapia-tantrica", "/administrador", "/api/newsletter"])(
    "bloqueia %s",
    (path) => {
      expect(isPathAllowedInMaintenance(path)).toBe(false);
    }
  );
});

describe("shouldShowMaintenance", () => {
  it("desvia rotas públicas quando o modo está ligado", () => {
    expect(shouldShowMaintenance("/blog", true)).toBe(true);
  });

  it("não desvia rotas liberadas quando o modo está ligado", () => {
    expect(shouldShowMaintenance("/admin", true)).toBe(false);
  });

  it("não desvia nada quando o modo está desligado", () => {
    expect(shouldShowMaintenance("/blog", false)).toBe(false);
  });
});
