/**
 * Caminho: src/components/Admin/Testimonials/MoveButtons.tsx
 * Arquivo: MoveButtons.tsx
 * Descrição: Botões de subir e descer um depoimento na fila. Desabilita o que não faz sentido na primeira e na última posição.
 */
"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { moveTestimonialAction } from "@/app/admin/depoimentos/actions";

type Props = { id: string; name: string; isFirst: boolean; isLast: boolean };

const btn = "rounded-md border border-black/10 px-2 py-1 text-xs leading-none hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30";

export default function MoveButtons({ id, name, isFirst, isLast }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const move = (direction: "up" | "down") =>
    start(async () => {
      await moveTestimonialAction(id, direction);
      router.refresh();
    });

  return (
    <div className="flex gap-1">
      <button type="button" aria-label={`Subir ${name}`} disabled={pending || isFirst} onClick={() => move("up")} className={btn}>▲</button>
      <button type="button" aria-label={`Descer ${name}`} disabled={pending || isLast} onClick={() => move("down")} className={btn}>▼</button>
    </div>
  );
}
