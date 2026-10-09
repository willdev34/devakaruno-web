/**
 * Caminho: src/lib/repositories/admin-stats.test.ts
 * Arquivo: admin-stats.test.ts
 * Descrição: Testes do status do post (rascunho, agendado, no ar) e das contagens do dashboard, com o Prisma mockado.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getDashboardStats, getPostStatus } from "./admin-stats";

const { postCount, postFindMany, testimonialCount, courseCount } = vi.hoisted(() => ({
  postCount: vi.fn(),
  postFindMany: vi.fn(),
  testimonialCount: vi.fn(),
  courseCount: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    post: { count: postCount, findMany: postFindMany },
    testimonial: { count: testimonialCount },
    course: { count: courseCount },
  },
}));

const now = new Date("2026-10-09T12:00:00Z");

describe("getPostStatus", () => {
  it("classifica rascunho, agendado e no ar", () => {
    expect(getPostStatus({ published: false, publishedAt: now }, now)).toBe("draft");
    expect(getPostStatus({ published: true, publishedAt: new Date("2026-10-10T00:00:00Z") }, now)).toBe("scheduled");
    expect(getPostStatus({ published: true, publishedAt: new Date("2026-10-01T00:00:00Z") }, now)).toBe("published");
  });
});

describe("getDashboardStats", () => {
  beforeEach(() => {
    postCount.mockReset();
    postFindMany.mockReset();
  });

  it("junta contagens e artigos recentes com status", async () => {
    postCount.mockResolvedValueOnce(3).mockResolvedValueOnce(1).mockResolvedValueOnce(2);
    testimonialCount.mockResolvedValue(13);
    courseCount.mockResolvedValue(3);
    postFindMany.mockResolvedValue([
      { id: "1", title: "A", published: false, publishedAt: new Date(), updatedAt: new Date() },
    ]);

    const stats = await getDashboardStats();

    expect(stats.posts).toEqual({ published: 3, scheduled: 1, drafts: 2 });
    expect(stats.testimonials).toBe(13);
    expect(stats.courses).toBe(3);
    expect(stats.recent[0]).toMatchObject({ title: "A", status: "draft" });
  });
});
