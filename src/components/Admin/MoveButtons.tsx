/**
 * Caminho: src/components/Admin/MoveButtons.tsx
 * Arquivo: MoveButtons.tsx
 * Descrição: Botões de subir e descer um item numa fila ordenada (depoimentos, serviços). A ação de mover vem por props. Desabilita o que não faz sentido nas pontas.
 */
"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { MoveDirection } from "@/lib/ordering";

type Props = {
  id: string;
  name: string;
  isFirst: boolean;
  isLast: boolean;
  action: (id: string, direction: MoveDirection) => Promise<unknown>;
};

const btn = "rounded-md border border-black/10 px-2 py-1 text-xs leading-none hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30";

export default function MoveButtons({ id, name, isFirst, isLast, action }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const move = (direction: MoveDirection) =>
    start(async () => {
      await action(id, direction);
      router.refresh();
    });

  return (
    <div className="flex gap-1">
      <button type="button" aria-label={`Subir ${name}`} disabled={pending || isFirst} onClick={() => move("up")} className={btn}>▲</button>
      <button type="button" aria-label={`Descer ${name}`} disabled={pending || isLast} onClick={() => move("down")} className={btn}>▼</button>
    </div>
  );
}
