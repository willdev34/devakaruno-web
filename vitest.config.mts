/**
 * Caminho: vitest.config.ts
 * Arquivo: vitest.config.ts
 * Descrição: Configuração do Vitest (jsdom, aliases do tsconfig) e da cobertura com limiar mínimo de 80% sobre o escopo testado.
 */
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "lcov"],
      // Escopo inicial da cobertura: cresce conforme novos arquivos ganham testes
      include: [
        "src/lib/**/*.ts",
        "src/components/Home/Hero/index.tsx",
        "src/components/Layout/Header/Logo/index.tsx",
        "src/components/Cursos/**/index.tsx",
        "src/components/Home/FutureEvents/index.tsx",
        "src/app/*/cursos-e-vivencias/*/page.tsx",
        "src/components/Home/Testimonial/*.tsx",
        "src/components/QuemEOKaruno/Depoimentos/index.tsx",
        "src/components/Layout/SiteChrome.tsx",
        "src/components/Layout/Footer/index.tsx",
        "src/components/TerapiaTantrica/AnamneseCTA/index.tsx",
        "src/components/TerapiaTantrica/AnamneseModal/index.tsx",
        "src/components/Home/Causes/index.tsx",
        "src/components/Home/WhatsAppCTA/index.tsx",
        "src/components/Home/NewsLetter/NewsletterForm.tsx",
        "src/components/Blog/BlogList/index.tsx",
        "src/components/Blog/BlogFilters/index.tsx",
        "src/components/Admin/**/*.{ts,tsx}",
        "src/components/Agenda/*.tsx",
        "src/app/*/agenda/page.tsx",
        "src/app/admin/**/*.{ts,tsx}",
        "src/app/api/admin/**/*.ts",
        "src/components/Blog/LatestBlog/index.tsx",
        "src/app/*/blog/*/page.tsx",
      ],
      exclude: ["src/generated/**", "**/*.test.*", "**/*.d.ts", "**/*.config.*"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
