/**
 * Caminho: src/lib/build/vercel-build.test.ts
 * Arquivo: vercel-build.test.ts
 * Descrição: Testes do script de build da Vercel (modo --dry-run): migrações no Preview da develop e na produção (main), com as travas de segurança das URLs do banco.
 */
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const DIRECT = "postgresql://u:p@ep-abc.sa-east-1.aws.neon.tech/neondb";
const POOLED = "postgresql://u:p@ep-abc-pooler.sa-east-1.aws.neon.tech/neondb";
const OTHER = "postgresql://u:p@ep-xyz-pooler.sa-east-1.aws.neon.tech/neondb";

// Roda o script só para ver a decisão, com um ambiente controlado (sem herdar o do computador)
function run(env: Record<string, string>) {
  const r = spawnSync("node", ["scripts/vercel-build.mjs", "--dry-run"], {
    env: { NODE_ENV: "test", PATH: process.env.PATH ?? "", ...env },
    encoding: "utf8",
  });
  return { out: r.stdout, code: r.status };
}

const prod = { VERCEL_ENV: "production", VERCEL_GIT_COMMIT_REF: "main", DATABASE_URL: POOLED, DIRECT_URL: DIRECT };
const preview = { VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: "develop", DATABASE_URL: POOLED, DIRECT_URL: DIRECT };

describe("scripts/vercel-build", () => {
  it("aplica migrações no Preview da develop", () => {
    const { out, code } = run(preview);
    expect(out).toContain("Preview da develop");
    expect(out).toContain("aplicando migrações");
    expect(code).toBe(0);
  });

  it("aplica migrações na produção (main) e mostra só host e banco", () => {
    const { out, code } = run(prod);
    expect(out).toContain("Produção (main)");
    expect(out).toContain("ep-abc.sa-east-1.aws.neon.tech/neondb");
    expect(out).not.toContain("u:p");
    expect(code).toBe(0);
  });

  it("não migra fora da Vercel (computador ou CI)", () => {
    const { out, code } = run({ DIRECT_URL: DIRECT });
    expect(out).toContain("VERCEL_ENV=(vazio)");
    expect(code).toBe(0);
  });

  it("não migra em outras branches", () => {
    expect(run({ ...preview, VERCEL_GIT_COMMIT_REF: "feature/x" }).out).toContain("só a develop migra o banco");
    expect(run({ ...prod, VERCEL_GIT_COMMIT_REF: "develop" }).out).toContain("só a main migra o banco");
  });

  it("Preview sem DIRECT_URL pula as migrações sem falhar", () => {
    const { out, code } = run({ VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: "develop" });
    expect(out).toContain("DIRECT_URL não definida no Preview");
    expect(code).toBe(0);
  });

  it("produção sem DIRECT_URL derruba o build", () => {
    const { out, code } = run({ VERCEL_ENV: "production", VERCEL_GIT_COMMIT_REF: "main", DATABASE_URL: POOLED });
    expect(out).toContain("DIRECT_URL não definida na produção");
    expect(code).toBe(1);
  });

  it("sem informar a branch, o ambiente decide sozinho", () => {
    expect(run({ ...prod, VERCEL_GIT_COMMIT_REF: "" }).out).toContain("aplicando migrações");
  });

  it("DIRECT_URL com pooler derruba o build", () => {
    const { out, code } = run({ ...prod, DIRECT_URL: POOLED });
    expect(out).toContain("aponta para o pooler");
    expect(code).toBe(1);
  });

  it("DIRECT_URL inválida derruba o build", () => {
    const { out, code } = run({ ...prod, DIRECT_URL: "isto nao e url" });
    expect(out).toContain("DIRECT_URL inválida");
    expect(code).toBe(1);
  });

  it("sem DATABASE_URL derruba o build", () => {
    const { out, code } = run({ ...prod, DATABASE_URL: "" });
    expect(out).toContain("DATABASE_URL não definida");
    expect(code).toBe(1);
  });

  it("DATABASE_URL inválida derruba o build", () => {
    const { out, code } = run({ ...prod, DATABASE_URL: "lixo" });
    expect(out).toContain("DATABASE_URL inválida");
    expect(code).toBe(1);
  });

  it("bancos diferentes entre DIRECT_URL e DATABASE_URL derrubam o build", () => {
    const { out, code } = run({ ...prod, DATABASE_URL: OTHER });
    expect(out).toContain("apontam para bancos diferentes");
    expect(code).toBe(1);
  });
});
