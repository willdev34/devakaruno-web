/**
 * Caminho: src/components/Admin/MoveButtons.test.tsx
 * Arquivo: MoveButtons.test.tsx
 * Descrição: Testes dos botões de subir e descer: chamam a ação recebida, atualizam a página e se desabilitam nas pontas da fila.
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MoveButtons from "./MoveButtons";

const m = vi.hoisted(() => ({ refresh: vi.fn(), action: vi.fn() }));

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: m.refresh }) }));

describe("MoveButtons", () => {
  beforeEach(() => {
    Object.values(m).forEach((fn) => fn.mockReset());
    m.action.mockResolvedValue({ ok: true });
  });

  it("sobe usando a ação recebida e atualiza a página", async () => {
    render(<MoveButtons id="2" name="Bruno" isFirst={false} isLast={false} action={m.action} />);

    fireEvent.click(screen.getByRole("button", { name: "Subir Bruno" }));

    await waitFor(() => expect(m.refresh).toHaveBeenCalled());
    expect(m.action).toHaveBeenCalledWith("2", "up");
  });

  it("desce", async () => {
    render(<MoveButtons id="2" name="Bruno" isFirst={false} isLast={false} action={m.action} />);

    fireEvent.click(screen.getByRole("button", { name: "Descer Bruno" }));

    await waitFor(() => expect(m.action).toHaveBeenCalledWith("2", "down"));
  });

  it("desabilita subir no primeiro e descer no último", () => {
    const { rerender } = render(<MoveButtons id="1" name="Ana" isFirst isLast={false} action={m.action} />);
    expect(screen.getByRole("button", { name: "Subir Ana" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Descer Ana" })).toBeEnabled();

    rerender(<MoveButtons id="1" name="Ana" isFirst={false} isLast action={m.action} />);
    expect(screen.getByRole("button", { name: "Descer Ana" })).toBeDisabled();
  });
});
