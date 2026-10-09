/**
 * Caminho: src/components/Admin/Posts/DeleteButton.tsx
 * Arquivo: DeleteButton.tsx
 * Descrição: Botão Excluir com confirmação. Recebe a ação de exclusão por props, para servir a artigos, agenda e outros itens.
 */
"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  name: string;
  action: (id: string) => Promise<unknown>;
  // Para onde ir depois de excluir (por padrão só atualiza a página)
  redirectTo?: string;
};

export default function DeleteButton({ id, name, action, redirectTo }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const remove = () => {
    if (!window.confirm(`Excluir "${name}"? Essa ação não pode ser desfeita.`)) return;
    start(async () => {
      await action(id);
      if (redirectTo) router.push(redirectTo);
      else router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={remove}
      disabled={pending}
      className="text-sm font-medium text-error hover:underline disabled:opacity-60"
    >
      {pending ? "Excluindo..." : "Excluir"}
    </button>
  );
}
