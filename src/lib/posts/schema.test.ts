/**
 * Caminho: src/lib/posts/schema.test.ts
 * Arquivo: schema.test.ts
 * Descrição: Testes da validação do formulário de artigo.
 */
import { describe, expect, it } from "vitest";
import { postInputSchema } from "./schema";

const valid = {
  title: "Meu artigo",
  slug: "meu-artigo",
  excerpt: "Um resumo com tamanho suficiente.",
  content: "Conteúdo do artigo com texto suficiente.",
  coverImage: "https://res.cloudinary.com/x/capa.jpg",
  tags: [],
  featured: false,
  mode: "now" as const,
};

const errorsOf = (input: unknown) => {
  const result = postInputSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((issue) => issue.path.join("."));
};

describe("postInputSchema", () => {
  it("aceita um artigo válido", () => {
    expect(postInputSchema.safeParse(valid).success).toBe(true);
  });

  it("aceita capa como caminho do site", () => {
    expect(postInputSchema.safeParse({ ...valid, coverImage: "/images/blog/capa.svg" }).success).toBe(true);
  });

  it("recusa slug com maiúsculas, espaços ou acentos", () => {
    expect(errorsOf({ ...valid, slug: "Meu Artigo" })).toContain("slug");
    expect(errorsOf({ ...valid, slug: "açaí" })).toContain("slug");
  });

  it("recusa capa inválida, título curto e resumo curto", () => {
    expect(errorsOf({ ...valid, coverImage: "capa.jpg" })).toContain("coverImage");
    expect(errorsOf({ ...valid, title: "ab" })).toContain("title");
    expect(errorsOf({ ...valid, excerpt: "curto" })).toContain("excerpt");
  });

  it("rascunho aceita resumo, conteúdo e capa vazios, mas exige título e slug", () => {
    const draft = { ...valid, mode: "draft" as const, excerpt: "", content: "", coverImage: "" };
    expect(postInputSchema.safeParse(draft).success).toBe(true);
    expect(errorsOf({ ...draft, title: "" })).toContain("title");
  });

  it("publicar exige conteúdo e agendar também", () => {
    expect(errorsOf({ ...valid, content: "" })).toContain("content");
    expect(errorsOf({ ...valid, mode: "schedule", content: "", scheduledAt: new Date(Date.now() + 1e8).toISOString() })).toContain("content");
  });

  it("remove tags repetidas e limita a 10", () => {
    const parsed = postInputSchema.parse({ ...valid, tags: ["a", "a", "b"] });
    expect(parsed.tags).toEqual(["a", "b"]);
    expect(errorsOf({ ...valid, tags: Array.from({ length: 11 }, (_, i) => `t${i}`) })).toContain("tags");
  });

  it("agendamento exige data futura", () => {
    expect(errorsOf({ ...valid, mode: "schedule" })).toContain("scheduledAt");
    expect(errorsOf({ ...valid, mode: "schedule", scheduledAt: "2020-01-01T10:00:00.000Z" })).toContain("scheduledAt");
    expect(errorsOf({ ...valid, mode: "schedule", scheduledAt: "lixo" })).toContain("scheduledAt");
    const future = new Date(Date.now() + 86_400_000).toISOString();
    expect(postInputSchema.safeParse({ ...valid, mode: "schedule", scheduledAt: future }).success).toBe(true);
  });
});
