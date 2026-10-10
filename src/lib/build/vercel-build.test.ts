/**
 * Caminho: src/lib/build/vercel-build.test.ts
 * Arquivo: vercel-build.test.ts
 * Descrição: Testes do script de build da Vercel (modo --dry-run): migrações só no Preview da develop e com DIRECT_URL; nunca na produção.
 */
import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

// Roda o script só para ver a decisão, com um ambiente controlado (sem herdar o do computador)
function decision(env: Record<string, string>): string {
  return execFileSync("node", ["scripts/vercel-build.mjs", "--dry-run"], {
    env: { NODE_ENV: "test", PATH: process.env.PATH ?? "", ...env },
    encoding: "utf8",
  });
}

describe("scripts/vercel-build", () => {
  it("aplica migrações no Preview da develop com DIRECT_URL", () => {
    const out = decision({ VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: "develop", DIRECT_URL: "postgresql://x" });
    expect(out).toContain("aplicando migrações");
  });

  it("nunca migra na produção, mesmo com DIRECT_URL", () => {
    const out = decision({ VERCEL_ENV: "production", VERCEL_GIT_COMMIT_REF: "main", DIRECT_URL: "postgresql://x" });
    expect(out).toContain("só rodam no Preview");
    expect(out).not.toContain("aplicando");
  });

  it("não migra fora da Vercel (computador ou CI)", () => {
    expect(decision({ DIRECT_URL: "postgresql://x" })).toContain("VERCEL_ENV=(vazio)");
  });

  it("não migra em outras branches", () => {
    const out = decision({ VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: "feature/teste", DIRECT_URL: "postgresql://x" });
    expect(out).toContain("só a develop migra o banco");
  });

  it("sem DIRECT_URL pula as migrações e avisa", () => {
    const out = decision({ VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: "develop" });
    expect(out).toContain("DIRECT_URL não definida");
  });

  it("sem informar a branch, o Preview com DIRECT_URL migra", () => {
    expect(decision({ VERCEL_ENV: "preview", DIRECT_URL: "postgresql://x" })).toContain("aplicando migrações");
  });
});
