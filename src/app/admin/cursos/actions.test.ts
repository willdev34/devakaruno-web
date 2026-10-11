/**
 * Caminho: src/app/admin/cursos/actions.test.ts
 * Arquivo: actions.test.ts
 * Descrição: Testes das Server Actions de cursos: exigem admin e revalidam Home, listagem pública, páginas de curso e listagem do admin.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { deleteCourseAction, saveCourseAction } from "./actions";

const m = vi.hoisted(() => ({ requireAdmin: vi.fn(), saveCourse: vi.fn(), deleteCourse: vi.fn(), revalidatePath: vi.fn() }));

vi.mock("@/lib/admin-session", () => ({ requireAdmin: m.requireAdmin }));
vi.mock("@/lib/courses/save-course", () => ({ saveCourse: m.saveCourse }));
vi.mock("@/lib/repositories/admin-courses", () => ({ deleteCourse: m.deleteCourse }));
vi.mock("next/cache", () => ({ revalidatePath: m.revalidatePath }));

const revalidated = () => m.revalidatePath.mock.calls.map((call) => call.join("|"));

describe("actions de cursos", () => {
  beforeEach(() => Object.values(m).forEach((fn) => fn.mockReset()));

  it("salva e revalida as páginas que mostram cursos", async () => {
    m.saveCourse.mockResolvedValue({ ok: true, id: "1" });

    expect(await saveCourseAction(null, {})).toEqual({ ok: true, id: "1" });
    expect(revalidated()).toEqual(["/", "/cursos-e-vivencias", "/cursos-e-vivencias/[slug]|page", "/admin/cursos"]);
  });

  it("não revalida quando a validação falha", async () => {
    m.saveCourse.mockResolvedValue({ ok: false, error: "x", fieldErrors: {} });

    await saveCourseAction("1", {});

    expect(m.revalidatePath).not.toHaveBeenCalled();
  });

  it("exclui e revalida", async () => {
    expect(await deleteCourseAction("1")).toEqual({ ok: true });
    expect(m.deleteCourse).toHaveBeenCalledWith("1");
    expect(revalidated()).toContain("/cursos-e-vivencias");
  });

  it("exige admin", async () => {
    m.requireAdmin.mockRejectedValue(new Error("NEXT_REDIRECT"));

    await expect(saveCourseAction(null, {})).rejects.toThrow("NEXT_REDIRECT");
    await expect(deleteCourseAction("1")).rejects.toThrow("NEXT_REDIRECT");
    expect(m.deleteCourse).not.toHaveBeenCalled();
    expect(m.saveCourse).not.toHaveBeenCalled();
  });
});
