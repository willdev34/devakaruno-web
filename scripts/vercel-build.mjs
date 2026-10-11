/**
 * Caminho: scripts/vercel-build.mjs
 * Arquivo: vercel-build.mjs
 * Descrição: Build da Vercel. Aplica as migrações do Prisma antes de buildar, para o site nunca subir com o banco desatualizado: no Preview da branch develop (Neon develop) e na produção, branch main (Neon production). Se a migração falhar, o build falha e a versão anterior continua no ar. A Vercel usa este script no lugar de "build" por ele se chamar "vercel-build".
 *
 * Travas de segurança: DIRECT_URL precisa existir na produção, não pode ser a conexão com pooler e precisa apontar para o mesmo banco de DATABASE_URL.
 *
 * Uso local para só ver a decisão sem rodar nada: node scripts/vercel-build.mjs --dry-run
 */
import { spawnSync } from "node:child_process";

// Branch que migra em cada ambiente da Vercel
const MIGRATION_BRANCH = { preview: "develop", production: "main" };

// Lê host e nome do banco de uma URL, sem o "-pooler" do host (nunca devolve usuário nem senha)
function parseDb(url) {
  try {
    const u = new URL(url);
    return { host: u.hostname, pooler: u.hostname.includes("-pooler"), base: u.hostname.replace("-pooler", ""), db: u.pathname.replace(/^\//, "") };
  } catch {
    return null;
  }
}

// Confere as URLs antes de mexer no banco; devolve a mensagem do problema ou null
function checkUrls(env) {
  const direct = parseDb(env.DIRECT_URL);
  if (!direct) return "DIRECT_URL inválida: confira a conexão direta copiada da Neon";
  if (direct.pooler) return `DIRECT_URL aponta para o pooler (${direct.host}): use a conexão direta, sem -pooler`;
  if (!env.DATABASE_URL) return "DATABASE_URL não definida neste ambiente";
  const app = parseDb(env.DATABASE_URL);
  if (!app) return "DATABASE_URL inválida: confira a conexão copiada da Neon";
  if (app.base !== direct.base || app.db !== direct.db) {
    return `DIRECT_URL (${direct.base}/${direct.db}) e DATABASE_URL (${app.base}/${app.db}) apontam para bancos diferentes`;
  }
  return null;
}

// Decide se as migrações rodam, com o motivo (função pura, fácil de testar).
// fatal = true derruba o build em vez de seguir sem migrar.
export function decide(env) {
  const target = env.VERCEL_ENV;
  const branch = MIGRATION_BRANCH[target];
  if (!branch) {
    return { migrate: false, fatal: false, reason: `VERCEL_ENV=${target || "(vazio)"}: migrações só rodam no Preview e na produção` };
  }
  if (env.VERCEL_GIT_COMMIT_REF && env.VERCEL_GIT_COMMIT_REF !== branch) {
    return { migrate: false, fatal: false, reason: `branch ${env.VERCEL_GIT_COMMIT_REF}: só a ${branch} migra o banco` };
  }
  if (!env.DIRECT_URL) {
    // Produção sem DIRECT_URL subiria código novo em banco antigo, então para o build
    if (target === "production") {
      return { migrate: false, fatal: true, reason: "DIRECT_URL não definida na produção: cadastre a conexão direta da Neon production (escopo Production)" };
    }
    return { migrate: false, fatal: false, reason: "DIRECT_URL não definida no Preview: migrações puladas (cadastre a conexão direta da Neon develop)" };
  }
  const problem = checkUrls(env);
  if (problem) return { migrate: false, fatal: true, reason: problem };
  const where = target === "production" ? "Produção (main)" : "Preview da develop";
  return { migrate: true, fatal: false, reason: `${where} com DIRECT_URL: aplicando migrações em ${parseDb(env.DIRECT_URL).base}/${parseDb(env.DIRECT_URL).db}` };
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit", env: process.env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const decision = decide(process.env);
console.log(`[vercel-build] ${decision.reason}`);

if (decision.fatal) process.exit(1);
if (process.argv.includes("--dry-run")) process.exit(0);

if (decision.migrate) run("npx", ["prisma", "migrate", "deploy"]);
run("npx", ["next", "build"]);
