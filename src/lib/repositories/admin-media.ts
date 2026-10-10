/**
 * Caminho: src/lib/repositories/admin-media.ts
 * Arquivo: admin-media.ts
 * Descrição: Reúne do banco os lugares onde imagens são usadas (artigos, cursos, banners) para a biblioteca de imagens saber o que está em uso.
 */
import { prisma } from "@/lib/prisma";
import type { ImageSource } from "@/lib/media/usage";

export async function listImageSources(): Promise<ImageSource[]> {
  const [posts, courses, ads] = await Promise.all([
    prisma.post.findMany({ select: { id: true, title: true, coverImage: true, content: true } }),
    prisma.course.findMany({ select: { id: true, title: true, bgImage: true } }),
    prisma.advertisement.findMany({ select: { id: true, name: true, imageUrl: true } }),
  ]);

  return [
    ...posts.map((p): ImageSource => ({ kind: "Artigo", id: p.id, title: p.title, href: `/admin/artigos/${p.id}`, texts: [p.coverImage, p.content] })),
    ...courses.map((c): ImageSource => ({ kind: "Curso", id: c.id, title: c.title, href: `/admin/cursos/${c.id}`, texts: [c.bgImage] })),
    ...ads.map((a): ImageSource => ({ kind: "Banner", id: a.id, title: a.name, href: `/admin/banners/${a.id}`, texts: [a.imageUrl] })),
  ];
}
