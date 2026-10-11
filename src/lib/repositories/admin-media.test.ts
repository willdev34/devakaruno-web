/**
 * Caminho: src/lib/repositories/admin-media.test.ts
 * Arquivo: admin-media.test.ts
 * Descrição: Teste do repositório de uso de imagens: monta as fontes (artigos, cursos, banners) com os textos onde a URL pode aparecer.
 */
import { describe, expect, it, vi } from "vitest";
import { listImageSources } from "./admin-media";

const db = vi.hoisted(() => ({ posts: vi.fn(), courses: vi.fn(), ads: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: { post: { findMany: db.posts }, course: { findMany: db.courses }, advertisement: { findMany: db.ads } },
}));

describe("listImageSources", () => {
  it("junta artigos, cursos e banners com link para a edição", async () => {
    db.posts.mockResolvedValue([{ id: "p1", title: "Paz", coverImage: "capa", content: "texto" }]);
    db.courses.mockResolvedValue([{ id: "c1", title: "Curso", bgImage: "fundo" }]);
    db.ads.mockResolvedValue([{ id: "a1", name: "Parceiro", imageUrl: "img" }]);

    expect(await listImageSources()).toEqual([
      { kind: "Artigo", id: "p1", title: "Paz", href: "/admin/artigos/p1", texts: ["capa", "texto"] },
      { kind: "Curso", id: "c1", title: "Curso", href: "/admin/cursos/c1", texts: ["fundo"] },
      { kind: "Banner", id: "a1", title: "Parceiro", href: "/admin/banners/a1", texts: ["img"] },
    ]);
  });
});
