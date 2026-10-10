/**
 * Caminho: scripts/vercel-build.mjs
 * Arquivo: vercel-build.mjs
 * Descrição: Build da Vercel. No Preview da branch develop aplica as migrações na Neon develop antes de buildar, para o site nunca subir com o banco desatualizado. Na produção não mexe no banco: lá a migração continua manual. A Vercel usa este script no lugar de "build" por ele se chamar "vercel-build".
 *
 * Uso local para só ver a decisão sem rodar nada: node scripts/vercel-build.mjs --dry-run
 */
import { spawnSync } from "node:child_process";

// Só a branch develop migra o banco do Preview; outras branches de teste não mexem nele
const MIGRATION_BRANCH = "develop";

// Decide se as migrações rodam, com o motivo (função pura, fácil de testar)
export function decide(env) {
  if (env.VERCEL_ENV !== "preview") {
    return { migrate: false, reason: `VERCEL_ENV=${env.VERCEL_ENV || "(vazio)"}: migrações só rodam no Preview` };
  }
  if (env.VERCEL_GIT_COMMIT_REF && env.VERCEL_GIT_COMMIT_REF !== MIGRATION_BRANCH) {
    return { migrate: false, reason: `branch ${env.VERCEL_GIT_COMMIT_REF}: só a ${MIGRATION_BRANCH} migra o banco` };
  }
  if (!env.DIRECT_URL) {
    return { migrate: false, reason: "DIRECT_URL não definida no Preview: migrações puladas (cadastre a conexão direta da Neon develop)" };
  }
  return { migrate: true, reason: "Preview da develop com DIRECT_URL: aplicando migrações" };
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit", env: process.env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const decision = decide(process.env);
console.log(`[vercel-build] ${decision.reason}`);

if (process.argv.includes("--dry-run")) process.exit(0);

if (decision.migrate) run("npx", ["prisma", "migrate", "deploy"]);
run("npx", ["next", "build"]);
